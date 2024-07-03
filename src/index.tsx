import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ReduxStore, persistor } from './redux/store';
import './index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={ReduxStore}>
      <BrowserRouter>
        <div className=' bg-gray-300'>
          <PersistGate persistor={persistor} loading={null}>
            <App />
          </PersistGate>
        </div>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
