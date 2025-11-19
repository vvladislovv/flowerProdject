'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { storage } from '@/lib/storage'
import { PaymentInfo, Order } from '@/lib/types'

const paymentOptions = [
  {
    id: 'mastercard',
    label: 'Mastercard',
    description: 'Основная карта • **** 3221',
    type: 'card',
    icon: '💳',
  },
  {
    id: 'visa',
    label: 'Visa',
    description: 'Доп. карта • **** 4410',
    type: 'card',
    icon: '💳',
  },
  {
    id: 'mir',
    label: 'Карта «Мир»',
    description: 'Сбербанк • **** 9011',
    type: 'card',
    icon: '💳',
  },
  {
    id: 'sbp',
    label: 'СБП / QR',
    description: 'Оплата через приложение банка по QR-коду',
    type: 'sbp',
    icon: '📲',
  },
]

export default function PaymentPage() {
  const router = useRouter()
  const user = storage.getUser()
  const cart = storage.getCart()

  const [payment, setPayment] = useState<PaymentInfo>({
    method: paymentOptions[0].label,
    cardName: user?.name || '',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    saveCard: false,
  })
  const [selectedMethodId, setSelectedMethodId] = useState(paymentOptions[0].id)

  const [checkoutData, setCheckoutData] = useState<any>(null)

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart')
      return
    }

    // Get checkout data from sessionStorage
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('checkout_data')
      if (data) {
        setCheckoutData(JSON.parse(data))
      } else {
        router.push('/checkout')
      }
    }
  }, [cart, router])

  useEffect(() => {
    const existing = paymentOptions.find((option) => option.label === payment.method)
    if (existing && existing.id !== selectedMethodId) {
      setSelectedMethodId(existing.id)
    }
  }, [payment.method, selectedMethodId])

  const selectedMethod = useMemo(
    () => paymentOptions.find((option) => option.id === selectedMethodId) ?? paymentOptions[0],
    [selectedMethodId]
  )

  useEffect(() => {
    setPayment((prev) =>
      prev.method === selectedMethod.label
        ? prev
        : {
            ...prev,
            method: selectedMethod.label,
          }
    )
  }, [selectedMethod.label])

  const isCardMethod = selectedMethod.type === 'card'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!checkoutData) {
      router.push('/checkout')
      return
    }

    // Create order
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const deliveryFee = 15
    const total = subtotal + deliveryFee

    const order: Order = {
      id: `order-${Date.now()}`,
      userId: user?.id || '1',
      items: cart,
      subtotal,
      deliveryFee,
      total,
      deliveryDate: checkoutData.deliveryDate || new Date().toISOString(),
      deliveryTime: checkoutData.deliveryTime || '12:00',
      billing: checkoutData.billing,
      payment,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      cardMessage: checkoutData.cardMessage,
    }

    storage.addOrder(order)
    storage.clearCart()
    
    // Clear session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('checkout_data')
    }
    
    router.push(`/orders/${order.id}`)
  }

  if (cart.length === 0 || !checkoutData) return null

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const deliveryFee = 15
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Оплата" showBack showCart />

      <div className="max-w-md mx-auto px-4 py-4 space-y-6 w-full overflow-x-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Method */}
          <div className="glass-card p-4 animate-fade-in">
            <h2 className="font-semibold mb-4 text-gray-900">Способ оплаты</h2>
            <div className="space-y-3">
              {paymentOptions.map((option) => {
                const isActive = option.id === selectedMethodId
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedMethodId(option.id)}
                    className={`w-full p-3 rounded-2xl border transition-all duration-200 text-left flex items-center justify-between gap-3 ${
                      isActive
                        ? 'glass bg-primary-green/15 border-primary-green/60 shadow-lg'
                        : 'glass-button border-white/30 hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{option.label}</p>
                        <p className="text-xs text-gray-600">{option.description}</p>
                      </div>
                    </div>
                    {isActive && <span className="text-primary-green text-lg font-bold">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Card Details */}
          {isCardMethod ? (
            <div className="glass-card p-4 animate-slide-up">
              <h2 className="font-semibold mb-4 text-gray-900">Данные карты</h2>
              <div className="space-y-3">
                <Input
                  label="Имя на карте"
                  value={payment.cardName}
                  onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                  required
                />
                <Input
                  label="Номер карты"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Input
                    label="Срок действия"
                    value={payment.expirationDate}
                    onChange={(e) => setPayment({ ...payment, expirationDate: e.target.value })}
                    placeholder="ММ/ГГ"
                    maxLength={5}
                    required
                  />
                  <Input
                    label="Код CVV"
                    value={payment.securityCode}
                    onChange={(e) => setPayment({ ...payment, securityCode: e.target.value })}
                    placeholder="***"
                    maxLength={4}
                    required
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={payment.saveCard}
                    onChange={(e) => setPayment({ ...payment, saveCard: e.target.checked })}
                    className="w-4 h-4 text-primary-green rounded"
                  />
                  <span className="text-sm text-gray-900">Сохранить данные карты</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="glass-card p-4 animate-slide-up">
              <h2 className="font-semibold mb-4 text-gray-900">Инструкция по оплате</h2>
              <p className="text-sm text-gray-900 leading-relaxed">
                После подтверждения заказа мы отправим QR-код и ссылку на оплату через СБП. Вы
                сможете завершить платеж в приложении любого банка. При необходимости менеджер
                свяжется с вами для уточнения деталей.
              </p>
            </div>
          )}

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
            Завершить заказ
          </Button>
        </form>
      </div>
    </div>
  )
}

