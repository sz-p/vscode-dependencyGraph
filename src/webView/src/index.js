import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app';
import { processMessage } from './processMessage';

window.addEventListener('message', (event) => {
	processMessage(event);
});
const root = window.document.getElementById('root');
ReactDOM.render(<App />, root);
