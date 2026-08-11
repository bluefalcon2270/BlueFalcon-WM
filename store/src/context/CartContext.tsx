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
  cart: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)) } catch(e) {}
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isMounted])

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        imageUrl: product.images?.[0]?.url || "", 
        quantity: 1 
      }]
    })
  }

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id))
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id)
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
