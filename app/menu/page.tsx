'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { FiArrowRight, FiLogOut, FiPackage, FiGrid, FiShoppingCart, FiHeart, FiTruck, FiHelpCircle, FiMessageCircle } from 'react-icons/fi'
import { storage } from '@/lib/storage'

export default function MenuPage() {
  const router = useRouter()
  const user = storage.getUser()

  const handleLogout = () => {
    storage.setUser(null)
    router.push('/welcome')
  }

  const menuItems = [
    { icon: FiPackage, label: 'Продукты', href: '/products' },
    { icon: FiGrid, label: 'Категории', href: '/products' },
    { icon: FiShoppingCart, label: 'Моя корзина', href: '/cart' },
    { icon: FiHeart, label: 'Избранное', href: '/wishlist' },
    { icon: FiTruck, label: 'Отследить заказ', href: '/orders' },
    { icon: FiMessageCircle, label: 'Поддержка', href: '/support' },
    { icon: FiHelpCircle, label: 'Частые вопросы', href: '/faqs' },
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header showBack showCart={false} />

      <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
        {/* User Profile */}
        <div className="glass-card p-4 mb-4 flex items-center justify-between animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-green/80 backdrop-blur-lg flex items-center justify-center text-white font-bold text-lg border border-primary-green/50 shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name || 'Пользователь'}</p>
              <p className="text-sm text-gray-900">{user?.location || 'Москва, Россия'}</p>
            </div>
          </div>
          <FiArrowRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* Menu Items */}
        <div className="glass-card overflow-hidden animate-fade-in">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                className={`flex items-center justify-between p-4 animate-slide-in-right ${
                  index !== menuItems.length - 1 ? 'border-b border-white/30' : ''
                } hover:bg-white/50 transition-all duration-200`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-900" />
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <FiArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            )
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 py-3 text-red-500 font-medium glass-button hover:bg-red-50/50 border border-red-200/50 transition-all duration-200 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          Выйти
        </button>
      </div>
    </div>
  )
}

