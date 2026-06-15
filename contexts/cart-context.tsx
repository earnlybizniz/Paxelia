'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { SizeId, FinishId, FrameId } from '@/lib/product'
// Display name + size label come from the SINGLE source of truth (pdp-product),
// never from a second product model — so the cart can never drift from the PDP.
import { PRODUCT_NAME, sizeLabel } from '@/lib/pdp-product'

// ============================================================
// TYPES
// ============================================================
export interface CartItem {
  id: string // Unique ID for this cart item
  sizeId: SizeId
  finishId: FinishId
  frameId: FrameId
  quantity: number
  price: number // Price at time of adding
  msrp: number  // MSRP at time of adding
}

export interface CartContextType {
  // State
  items: CartItem[]
  isOpen: boolean
  isHydrated: boolean
  
  // Computed
  itemCount: number
  subtotal: number
  savings: number
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Helpers
  getItemById: (itemId: string) => CartItem | undefined
  hasVariant: (sizeId: SizeId, finishId: FinishId, frameId: FrameId) => boolean
  getVariantItem: (sizeId: SizeId, finishId: FinishId, frameId: FrameId) => CartItem | undefined
}

// ============================================================
// STORAGE
// ============================================================
const CART_STORAGE_KEY = 'retail_cart_v2'

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (e) {
    console.error('[Cart] Failed to load from storage:', e)
  }
  return []
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.error('[Cart] Failed to save to storage:', e)
  }
}

// ============================================================
// HELPERS
// ============================================================
function generateItemId(sizeId: SizeId, finishId: FinishId, frameId: FrameId): string {
  return `${sizeId}-${finishId}-${frameId}`
}

export function getItemDisplayName(item: CartItem): string {
  return `${PRODUCT_NAME} — ${sizeLabel(item.sizeId)}`
}

export function getItemShortName(item: CartItem): string {
  return sizeLabel(item.sizeId)
}

// ============================================================
// CONTEXT
// ============================================================
const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadCartFromStorage()
    setItems(stored)
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(items)
    }
  }, [items, isHydrated])

  // Computed values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = items.reduce((sum, item) => sum + (item.msrp - item.price) * item.quantity, 0)

  // Actions
  const addItem = useCallback((newItem: Omit<CartItem, 'id'>) => {
    const itemId = generateItemId(newItem.sizeId, newItem.finishId, newItem.frameId)
    
    setItems(current => {
      const existingIndex = current.findIndex(item => item.id === itemId)
      
      if (existingIndex >= 0) {
        // Update existing item quantity
        const updated = [...current]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(updated[existingIndex].quantity + newItem.quantity, 10)
        }
        return updated
      } else {
        // Add new item
        return [...current, { ...newItem, id: itemId }]
      }
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems(current => current.filter(item => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(current => current.filter(item => item.id !== itemId))
      return
    }
    
    setItems(current => 
      current.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.min(quantity, 10) }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), [])

  const getItemById = useCallback((itemId: string) => {
    return items.find(item => item.id === itemId)
  }, [items])

  const hasVariant = useCallback((sizeId: SizeId, finishId: FinishId, frameId: FrameId) => {
    const itemId = generateItemId(sizeId, finishId, frameId)
    return items.some(item => item.id === itemId)
  }, [items])

  const getVariantItem = useCallback((sizeId: SizeId, finishId: FinishId, frameId: FrameId) => {
    const itemId = generateItemId(sizeId, finishId, frameId)
    return items.find(item => item.id === itemId)
  }, [items])

  const value: CartContextType = {
    items,
    isOpen,
    isHydrated,
    itemCount,
    subtotal,
    savings,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    getItemById,
    hasVariant,
    getVariantItem,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
