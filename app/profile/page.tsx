'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import Button from '@/components/Button'
import { storage } from '@/lib/storage'

export default function ProfilePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const currentUser = storage.getUser()
    setUser(currentUser)
    
    if (!currentUser) {
      router.push('/welcome')
    }
  }, [router])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen pb-20 w-full overflow-x-hidden">
        <Header title="Профиль" showMenu showCart />
        <div className="max-w-md mx-auto px-4 py-4 space-y-4 w-full overflow-x-hidden">
          <div className="glass-card p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  const orders = storage.getOrders()

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Профиль" showMenu showCart />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4 w-full overflow-x-hidden">
        {/* User Info */}
        <div className="glass-card p-6 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-primary-green/80 backdrop-blur-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 border border-primary-green/50 shadow-lg">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold mb-1">{user.name}</h2>
          <p className="text-gray-900">{user.email}</p>
          {user.location && (
            <p className="text-sm text-gray-900 mt-1">{user.location}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="glass-card p-4 text-center animate-slide-up w-full max-w-full" style={{ animationDelay: '0.1s' }}>
            <p className="text-2xl font-bold text-primary-green">{orders.length}</p>
            <p className="text-sm text-gray-900">Заказов</p>
          </div>
          <div className="glass-card p-4 text-center animate-slide-up w-full max-w-full" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl font-bold text-primary-green">
              {storage.getWishlist().length}
            </p>
            <p className="text-sm text-gray-900">В избранном</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-4 animate-fade-in">
          <h3 className="font-semibold mb-4 text-gray-900">Недавние заказы</h3>
          {orders.length === 0 ? (
            <p className="text-gray-900 text-sm text-center py-4">
              Пока нет заказов
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order, index) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-3 glass-button hover:bg-white/70 transition-all duration-200 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Заказ #{order.id.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-green">
                      {order.total.toFixed(2)} ₽
                    </p>
                    <p className="text-xs text-gray-900 capitalize">
                      {order.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Menu Links */}
        <div className="space-y-2">
          <Link
            href="/menu"
            className="block glass-card p-4 hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="font-medium text-gray-900">Настройки</span>
          </Link>
          <Link
            href="/support"
            className="block glass-card p-4 hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <span className="font-medium text-gray-900">Поддержка</span>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

