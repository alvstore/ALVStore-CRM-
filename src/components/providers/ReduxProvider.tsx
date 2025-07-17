'use client'

// Third-party Imports
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

// Store Imports
import { persistor, store } from '@/redux-store'

type Props = {
  children: React.ReactNode
}

export function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
