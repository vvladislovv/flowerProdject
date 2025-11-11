'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import { storage } from '@/lib/storage'
import { CartItem } from '@/lib/types'
import EmojiImage from '@/components/EmojiImage'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    const cartItems = storage.getCart()
    setCart(cartItems)
  }, [])

  const updateQuantity = (productId: string, quantity: number) => {
    storage.updateCartItemQuantity(productId, quantity)
    const updatedCart = storage.getCart()
    setCart(updatedCart)
  }

  const removeItem = (productId: string) => {
    storage.removeFromCart(productId)
    const updatedCart = storage.getCart()
    setCart(updatedCart)
  }

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'FLOWER20') {
      setDiscount(0.2) // 20% discount
    } else if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(0.1) // 10% discount
    } else {
      alert('Неверный промокод')
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = subtotal > 0 ? 15 : 0
  const discountAmount = subtotal * discount
  const total = subtotal + deliveryFee - discountAmount

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Моя корзина" showBack showCart={false} />
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="glass-card p-8">
            <p className="text-gray-900 mb-6">Ваша корзина пуста</p>
            <Button onClick={() => router.push('/products')} fullWidth>
              Перейти к каталогу
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Моя корзина" showBack showCart={false} />

      <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
        <p className="text-sm text-gray-900 mb-4 glass-card p-3 font-medium rounded-2xl animate-fade-in">{cart.length} товаров</p>

        <div className="space-y-4 mb-6">
          {cart.map((item, index) => (
            <div
              key={item.product.id}
              className="glass-card p-4 flex gap-4 hover:shadow-xl transition-all duration-300 rounded-2xl animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-primary-green/10 via-white to-primary-purple/10 border border-white/30 flex-shrink-0 overflow-hidden">
                <EmojiImage emoji={item.product.image} size="sm" className="w-full h-full" />
              </div>

              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
                    <p className="text-primary-green font-bold truncate">
                      {item.product.price} ₽
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 glass-button flex items-center justify-center hover:bg-white/70 transition-all duration-300 rounded-xl"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 glass-button flex items-center justify-center hover:bg-white/70 transition-all duration-300 rounded-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code */}
        <div className="glass-card p-4 mb-4 rounded-2xl animate-fade-in">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Введите промокод"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-4 py-2 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green rounded-xl"
            />
            <Button onClick={applyPromoCode} variant="outline">
              Применить
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-card p-4 mb-4 rounded-2xl animate-fade-in">
          <h3 className="font-semibold mb-3 text-gray-900">Итого заказа</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-900">Подытог</span>
              <span className="text-gray-900">{subtotal.toFixed(2)} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Доставка</span>
              <span className="text-gray-900">{deliveryFee.toFixed(2)} ₽</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary-green">
                <span>Скидка ({Math.round(discount * 100)}%)</span>
                <span>-{discountAmount.toFixed(2)} ₽</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span className="text-gray-900">Итого</span>
              <span className="text-gray-900">{total.toFixed(2)} ₽</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push('/checkout')}
          fullWidth
          className="mb-4"
        >
          Купить сейчас
        </Button>
      </div>
    </div>
  )
}

