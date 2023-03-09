import React, {
	createContext,
	useContext,
	useRef,
	useReducer,
	useEffect,
} from 'react';
import Values from 'values.js';
import ColorContrastChecker from 'color-contrast-checker';
import historyService from '../services/history.service';
import urlParamsService from '../services/urlParams.service';
import { useAppContext } from './App.context';

const ColorsContext = createContext();
export const useColorsContext = () => {
	const context = useContext(ColorsContext);

	if (!context)
		throw new Error(
			'useColorContext must be called in `ColorContextProvider`'
		);

	return context;
};

function colorsReducer(state, action) {
	if (action.type === 'add') {
		return {
			...state,
			colorsList: [...state.colorsList, action.payload],
		};
	}
	if (action.type === 'remove') {
		return {
			...state,
			colorsList: state.colorsList.filter(
				(_, idx) => idx !== action.payload
			),
		};
	}
	if (action.type === 'set') {
		return {
			...state,
			colorsList: action.payload,
		};
	}
}

function ColorsContextProvider({ children }) {
	const initialState = {
		colorsList: [],
	};
	const [state, dispatch] = useReducer(colorsReducer, initialState);
	const { DARK_COLOR, LIGHT_COLOR } = useAppContext();
	const SCROLL_TIMEOUT = 250;
	const props = useRef({
		isValidColor,
		createAll,
		addColors,
		setColors,
	});
	const ccc = new ColorContrastChecker();
	const firstCreation = useRef(true);

	useEffect(() => {
		if (firstCreation.current) return;

		const lastList = Array.from(document.querySelectorAll('.colors')).pop();
		let timeout;

		if (lastList) {
			timeout = setTimeout(() => {
				lastList.scrollIntoView({
					behavior: 'smooth',
				});
			}, SCROLL_TIMEOUT);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [state.colorsList]);

	function createAll(color, range) {
		return new Values(color).all(range);
	}

	function addColors(color, range) {
		const params = urlParamsService.append(color.slice(1), range);
		historyService.update(params);
		firstCreation.current = false;
		dispatch({
			type: 'add',
			payload: createAll(color, range),
		});
	}

	function removeColor(id) {
		const color = state.colorsList[id].find((c) => c.type === 'base').hex;
		const params = urlParamsService.remove(color);
		historyService.update(params);
		dispatch({
			type: 'remove',
			payload: id,
		});
	}

	function setColors(data) {
		dispatch({ type: 'set', payload: data });
	}

	function isValidColor(color) {
		try {
			new Values(color);
			return true;
		} catch (error) {
			return false;
		}
	}

	function getBaseType(color) {
		const colorLum = ccc.hexToLuminance(color),
			darkContrastRatio = ccc.getContrastRatio(
				ccc.hexToLuminance(DARK_COLOR),
				colorLum
			),
			lightContrastRatio = ccc.getContrastRatio(
				ccc.hexToLuminance(LIGHT_COLOR),
				colorLum
			);

		return darkContrastRatio > lightContrastRatio ? 'tint' : 'shade';
	}

	return (
		<ColorsContext.Provider
			value={{
				...state,
				...props.current,
				removeColor,
				getBaseType,
			}}
		>
			{children}
		</ColorsContext.Provider>
	);
}

export default ColorsContextProvider;
