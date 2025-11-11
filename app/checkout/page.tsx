'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { storage } from '@/lib/storage'
import { BillingInfo } from '@/lib/types'

export default function CheckoutPage() {
  const router = useRouter()
  const user = storage.getUser()
  const cart = storage.getCart()

  const [billing, setBilling] = useState<BillingInfo>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: 'Россия',
    state: '',
    address: '',
    postalCode: '',
  })

  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [cardMessage, setCardMessage] = useState('')

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart')
    }
  }, [cart, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save checkout data to sessionStorage for payment page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkout_data', JSON.stringify({
        billing,
        deliveryDate,
        deliveryTime,
        cardMessage,
      }))
    }
    router.push('/checkout/payment')
  }

  if (cart.length === 0) return null

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = 15
  const total = subtotal + deliveryFee

  // Set minimum date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Оформление заказа" showBack showCart />

      <div className="max-w-md mx-auto px-4 py-4 space-y-6 w-full overflow-x-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details */}
          <div className="glass-card p-4 animate-fade-in">
            <h2 className="font-semibold mb-4 text-gray-900">Личные данные</h2>
            <div className="space-y-3">
              <Input
                label="Полное имя"
                value={billing.fullName}
                onChange={(e) => setBilling({ ...billing, fullName: e.target.value })}
                required
              />
              <Input
                type="email"
                label="Email адрес"
                value={billing.email}
                onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                required
              />
              <Input
                type="tel"
                label="Номер телефона"
                value={billing.phone}
                onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Address Details */}
          <div className="glass-card p-4 animate-slide-up">
            <h2 className="font-semibold mb-4 text-gray-900">Адрес доставки</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Страна
                </label>
                <select
                  value={billing.country}
                  onChange={(e) => setBilling({ ...billing, country: e.target.value })}
                  className="w-full px-4 py-3 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green text-gray-900"
                  required
                >
                  <option>Россия</option>
                  <option>Беларусь</option>
                  <option>Казахстан</option>
                </select>
              </div>
              <Input
                label="Регион/Область"
                value={billing.state}
                onChange={(e) => setBilling({ ...billing, state: e.target.value })}
                required
              />
              <Input
                label="Адрес"
                value={billing.address}
                onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                required
              />
              <Input
                label="Почтовый индекс"
                value={billing.postalCode}
                onChange={(e) => setBilling({ ...billing, postalCode: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Delivery Date & Time */}
          <div className="glass-card p-4 animate-fade-in">
            <h2 className="font-semibold mb-4 text-gray-900">Дата и время доставки</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Дата доставки
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={minDate}
                  className="w-full px-4 py-3 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Время доставки
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-4 py-3 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green text-gray-900"
                  required
                >
                  <option value="">Выберите время</option>
                  <option value="09:00">9:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card Message */}
          <div className="glass-card p-4 animate-slide-up">
            <h2 className="font-semibold mb-4 text-gray-900">Сообщение на открытке (необязательно)</h2>
            <textarea
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              placeholder="Введите ваше сообщение для открытки..."
              className="w-full px-4 py-3 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green resize-none text-gray-900"
              rows={4}
            />
          </div>

          {/* Order Summary */}
          <div className="glass-card p-4 animate-fade-in">
            <h2 className="font-semibold mb-4 text-gray-900">Итого заказа</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-900">Подытог</span>
                <span className="text-gray-900">{subtotal.toFixed(2)} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">Доставка</span>
                <span className="text-gray-900">{deliveryFee.toFixed(2)} ₽</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span className="text-gray-900">Итого</span>
                <span className="text-gray-900">{total.toFixed(2)} ₽</span>
              </div>
            </div>
          </div>

          <Button type="submit" fullWidth>
            Перейти к оплате
          </Button>
        </form>
      </div>
    </div>
  )
}

