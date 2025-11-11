'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import { storage } from '@/lib/storage'
import { Order } from '@/lib/types'
import EmojiImage from '@/components/EmojiImage'

const statusSteps = [
  { key: 'confirmed', label: 'Подтверждён', icon: '✓' },
  { key: 'preparing', label: 'Готовится', icon: '🌺' },
  { key: 'delivering', label: 'В пути', icon: '🚗' },
  { key: 'delivered', label: 'Доставлен', icon: '🎉' },
]

export default function OrderTrackingPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id as string

  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!orderId) return

    const orders = storage.getOrders()
    const foundOrder = orders.find((o) => o.id === orderId)
    setOrder(foundOrder || null)
  }, [orderId])

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Заказ не найден</p>
      </div>
    )
  }

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === order.status)
  const statusProgress = ((currentStatusIndex + 1) / statusSteps.length) * 100

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Отслеживание заказа" showBack showCart />

      <div className="max-w-md mx-auto px-4 py-4 space-y-6 w-full overflow-x-hidden">
        {/* Order Status */}
        <div className="glass-card p-6 animate-scale-in">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Заказ #{order.id.slice(-8)}</h2>
          
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex

              return (
                <div key={step.key} className="flex items-start gap-4 animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div
                    className={`w-10 h-10 flex items-center justify-center flex-shrink-0 border backdrop-blur-lg ${
                      isActive
                        ? 'glass bg-primary-green/80 text-white border-primary-green/50 shadow-lg'
                        : 'glass-button text-gray-400 border-white/30'
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p
                      className={`font-semibold ${
                        isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-gray-900 mt-1">
                        {step.key === 'confirmed' ? 'Ваш заказ подтверждён' : step.key === 'preparing' ? 'Ваш заказ готовится' : step.key === 'delivering' ? 'Ваш заказ в пути' : 'Ваш заказ доставлен'}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="glass-card p-4 animate-fade-in">
          <h3 className="font-semibold mb-4 text-gray-900">Товары в заказе</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={item.product.id} className="flex gap-3 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary-green/10 via-white to-primary-purple/10 border border-white/30 flex-shrink-0 overflow-hidden">
                  <EmojiImage emoji={item.product.image} size="sm" className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{item.product.name}</p>
                  <p className="text-xs text-gray-900">Кол-во: {item.quantity}</p>
                  <p className="text-primary-green font-bold">
                    {(item.product.price * item.quantity).toFixed(2)} ₽
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-card p-4 animate-slide-up">
          <h3 className="font-semibold mb-4 text-gray-900">Итого заказа</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-900">Подытог</span>
              <span className="text-gray-900">{order.subtotal.toFixed(2)} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Доставка</span>
              <span className="text-gray-900">{order.deliveryFee.toFixed(2)} ₽</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span className="text-gray-900">Итого</span>
              <span className="text-gray-900">{order.total.toFixed(2)} ₽</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="glass-card p-4 animate-fade-in">
          <h3 className="font-semibold mb-4 text-gray-900">Информация о доставке</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-900">Дата:</span>{' '}
              <span className="font-medium text-gray-900">
                {new Date(order.deliveryDate).toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="text-gray-900">Время:</span>{' '}
              <span className="font-medium text-gray-900">{order.deliveryTime}</span>
            </p>
            <p>
              <span className="text-gray-900">Адрес:</span>{' '}
              <span className="font-medium text-gray-900">
                {order.billing.address}, {order.billing.state}
              </span>
            </p>
          </div>
        </div>

        {/* Chat with Florist */}
        <Button
          onClick={() => router.push(`/chat?order=${order.id}`)}
          fullWidth
          variant="outline"
        >
          Чат с флористом
        </Button>
      </div>
    </div>
  )
}

