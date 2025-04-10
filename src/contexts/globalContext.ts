import { createContext } from 'react'
import { GlobalContextType } from '../types/global/globalContext'

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
)
