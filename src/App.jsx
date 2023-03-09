import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import searchParamsService from './services/urlParams.service';
import { useColorsContext } from './context/Colors.context';
import { useAppContext } from './context/App.context';
import Header from './components/Header.component';
import ColorForm from './components/ColorForm.component';
import Colors from './components/Colors.component';
import Fab from './components/Fab.component';
import { dataParser } from './utils';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	const { isInitialized, setIsInitialized, INITIAL_COLOR, INITIAL_RANGE } =
		useAppContext();
	const { addColors, setColors, createAll, isValidColor } =
		useColorsContext();

	useEffect(() => {
		if (!searchParamsService.get()) {
			addColors(INITIAL_COLOR, INITIAL_RANGE);
		} else {
			const colors = searchParamsService.entries().map(([key, value]) => {
				const hex = dataParser.hex(key);
				if (isValidColor(hex))
					return createAll(hex, dataParser.number(value));
				return [];
			});
			setColors(colors);
		}
		setIsInitialized(true);
	}, [
		INITIAL_COLOR,
		INITIAL_RANGE,
		addColors,
		setColors,
		createAll,
		isValidColor,
		setIsInitialized,
	]);

	return (
		<>
			<Header />
			<main>
				<div className='container'>
					<ColorForm />
					<Colors isLoading={!isInitialized} />
				</div>
			</main>
			<Fab />
			<ToastContainer
				position='bottom-center'
				autoClose={2000}
				hideProgressBar={true}
				newestOnTop={true}
				rtl={false}
				closeButton={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
			/>
		</>
	);
}

export default App;
