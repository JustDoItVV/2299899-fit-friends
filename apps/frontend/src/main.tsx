import 'react-toastify/dist/ReactToastify.css';

import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { browserHistory, frontendStorage } from '@2299899-fit-friends/frontend-core';

import App from './app/app';
import HistoryRouter from './app/components/history-router/history-router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={frontendStorage}>
      <HistoryRouter history={browserHistory}>
        <ToastContainer />
        <App />
      </HistoryRouter>
    </Provider>
  </StrictMode>
);
