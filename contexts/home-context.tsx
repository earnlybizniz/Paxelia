'use client'

import { createContext, useContext } from 'react'
import { HOME, type HomeContent } from '@/lib/home-content'

const HomeContext = createContext<HomeContent>(HOME)

export function HomeProvider({
  children,
  content = HOME,
}: {
  children: React.ReactNode
  content?: HomeContent
}) {
  return <HomeContext.Provider value={content}>{children}</HomeContext.Provider>
}

export function useHome() {
  return useContext(HomeContext)
}
