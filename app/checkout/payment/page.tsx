'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { storage } from '@/lib/storage'
import { PaymentInfo, Order } from '@/lib/types'

export default function PaymentPage() {
  const router = useRouter()
  const user = storage.getUser()
  const cart = storage.getCart()

  const [payment, setPayment] = useState<PaymentInfo>({
    method: 'Master Card',
    cardName: user?.name || '',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    saveCard: false,
  })

  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const paymentMethods = ['Master Card', 'Visa', 'МИР', 'Сбербанк Онлайн']

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19)
  }

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const validateCard = () => {
    const newErrors: Record<string, string> = {}
    
    if (!payment.cardName.trim()) {
      newErrors.cardName = 'Введите имя на карте'
    } else if (payment.cardName.trim().length < 2) {
      newErrors.cardName = 'Имя слишком короткое'
    }
    
    const cardNumber = payment.cardNumber.replace(/\s/g, '')
    if (!cardNumber) {
      newErrors.cardNumber = 'Введите номер карты'
    } else if (cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = 'Номер карты должен содержать от 13 до 19 цифр'
    } else if (!/^\d+$/.test(cardNumber)) {
      newErrors.cardNumber = 'Номер карты должен содержать только цифры'
    }
    
    const expDate = payment.expirationDate.replace(/\D/g, '')
    if (!expDate) {
      newErrors.expirationDate = 'Введите срок действия'
    } else if (expDate.length !== 4) {
      newErrors.expirationDate = 'Введите ММ/ГГ'
    } else {
      const month = parseInt(expDate.slice(0, 2))
      const year = parseInt(expDate.slice(2, 4))
      if (month < 1 || month > 12) {
        newErrors.expirationDate = 'Неверный месяц'
      } else if (year < 23) {
        newErrors.expirationDate = 'Карта просрочена'
      }
    }
    
    if (!payment.securityCode) {
      newErrors.securityCode = 'Введите CVV'
    } else if (payment.securityCode.length < 3 || payment.securityCode.length > 4) {
      newErrors.securityCode = 'CVV должен содержать 3-4 цифры'
    } else if (!/^\d+$/.test(payment.securityCode)) {
      newErrors.securityCode = 'CVV должен содержать только цифры'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.payment-method-dropdown')) {
        setShowPaymentMethods(false)
      }
    }

    if (showPaymentMethods) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showPaymentMethods])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateCard()) {
      return
    }

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
          <div className="glass-card p-4 animate-fade-in relative z-0">
            <h2 className="font-semibold mb-4 text-gray-900">Способ оплаты</h2>
            <div className="relative payment-method-dropdown z-50">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPaymentMethods(!showPaymentMethods)
                }}
                className={`w-full border p-4 flex items-center justify-between hover:bg-white/70 transition-all duration-200 text-gray-900 rounded-xl ${
                  showPaymentMethods 
                    ? 'border-orange-500 bg-white/90' 
                    : 'border-white/30 bg-white/50'
                }`}
              >
                <span className="font-medium">{payment.method}</span>
                <span className={`transition-transform duration-200 text-gray-600 ${showPaymentMethods ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {showPaymentMethods && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-xl z-[100]">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPayment({ ...payment, method })
                        setShowPaymentMethods(false)
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                        payment.method === method
                          ? 'bg-primary-green/10 text-primary-green font-semibold'
                          : 'text-gray-900 bg-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="glass-card p-4 animate-slide-up">
            <h2 className="font-semibold mb-4 text-gray-900">Данные карты</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Имя на карте
                </label>
                <input
                  type="text"
                  value={payment.cardName}
                  onChange={(e) => {
                    setPayment({ ...payment, cardName: e.target.value })
                    if (errors.cardName) {
                      setErrors({ ...errors, cardName: '' })
                    }
                  }}
                  className={`w-full px-4 py-3 bg-white/50 border rounded-xl transition-all duration-200 ${
                    errors.cardName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20'
                  } focus:outline-none text-gray-900`}
                  placeholder="Clement Bernard"
                />
                {errors.cardName && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Номер карты
                </label>
                <input
                  type="text"
                  value={payment.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    setPayment({ ...payment, cardNumber: formatted })
                    if (errors.cardNumber) {
                      setErrors({ ...errors, cardNumber: '' })
                    }
                  }}
                  className={`w-full px-4 py-3 bg-white/50 border rounded-xl transition-all duration-200 ${
                    errors.cardNumber 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20'
                  } focus:outline-none text-gray-900`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Срок действия
                  </label>
                  <input
                    type="text"
                    value={payment.expirationDate}
                    onChange={(e) => {
                      const formatted = formatExpirationDate(e.target.value)
                      setPayment({ ...payment, expirationDate: formatted })
                      if (errors.expirationDate) {
                        setErrors({ ...errors, expirationDate: '' })
                      }
                    }}
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl transition-all duration-200 ${
                      errors.expirationDate 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20'
                    } focus:outline-none text-gray-900`}
                    placeholder="ММ/ГГ"
                    maxLength={5}
                  />
                  {errors.expirationDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={payment.securityCode}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setPayment({ ...payment, securityCode: cleaned })
                      if (errors.securityCode) {
                        setErrors({ ...errors, securityCode: '' })
                      }
                    }}
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl transition-all duration-200 ${
                      errors.securityCode 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20'
                    } focus:outline-none text-gray-900`}
                    placeholder="CVV"
                    maxLength={4}
                  />
                  {errors.securityCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.securityCode}</p>
                  )}
                </div>
              </div>
              
              <label className="flex items-center gap-2 pt-2">
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

