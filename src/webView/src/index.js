import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app';
window.addEventListener('message', (event) => {
	console.log(event);
});
const root = window.document.getElementById('root');
ReactDOM.render(<App />, root);
