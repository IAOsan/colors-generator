import React, { createContext, useContext, useRef, useState } from 'react';

const AppContext = createContext();
export const useAppContext = () => {
	const context = useContext(AppContext);

	if (!context)
		throw new Error('useAppContext must be called in `AppContextProvider`');

	return context;
};

function AppContextProvider({ children }) {
	const [isInitialized, setIsInitialized] = useState(false);
	const initialValues = useRef({
		INITIAL_COLOR: '#e8a703',
		INITIAL_RANGE: '10',
		DARK_COLOR: '#161616',
		LIGHT_COLOR: '#fdf3e6',
	});

	return (
		<AppContext.Provider
			value={{
				isInitialized,
				setIsInitialized,
				...initialValues.current,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export default AppContextProvider;
