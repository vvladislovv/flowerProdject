'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { storage } from '@/lib/storage'
import { Order } from '@/lib/types'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const userOrders = storage.getOrders()
    setOrders(userOrders)
  }, [])

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Мои заказы" showBack showCart />

      <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12 glass-card p-8">
            <p className="text-gray-900 mb-4">У вас пока нет заказов</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 glass bg-primary-green/80 text-white border border-primary-green/50 hover:bg-primary-green hover:shadow-lg transition-all duration-200"
            >
              Перейти к каталогу
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block glass-card p-4 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Заказ #{order.id.slice(-8)}</p>
                    <p className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium glass-button border border-white/30 ${
                      order.status === 'delivered'
                        ? 'bg-green-100/50 text-green-700'
                        : order.status === 'delivering'
                        ? 'bg-blue-100/50 text-blue-700'
                        : 'bg-yellow-100/50 text-yellow-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-900">
                    {order.items.length} {order.items.length === 1 ? 'товар' : order.items.length < 5 ? 'товара' : 'товаров'}
                  </p>
                  <p className="font-bold text-primary-green">
                    {order.total.toFixed(2)} ₽
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

