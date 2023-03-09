import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppContextProvider from './context/App.context';
import ColorsContextProvider from './context/Colors.context';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AppContextProvider>
			<ColorsContextProvider>
				<App />
			</ColorsContextProvider>
		</AppContextProvider>
	</React.StrictMode>
);
