import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import 'modern-normalize/modern-normalize.css'
import Modal from 'react-modal'

import './index.css'
import App from './App.jsx'
import { persistor, store } from './store/store'
import { AppLoader } from './ui/AppLoader/AppLoader'

Modal.setAppElement('#root')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<AppLoader />} persistor={persistor}>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
