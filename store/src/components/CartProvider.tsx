"use client"
import { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem("cart")
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isMounted])

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === newItem.id)
      if (existing) {
        return prev.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i)
      }
      return [...prev, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) throw new Error("useCart must be used within a CartProvider")
  return context
}
