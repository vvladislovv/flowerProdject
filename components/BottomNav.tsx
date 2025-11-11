'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiCompass, FiHeart, FiMessageCircle, FiUser } from 'react-icons/fi'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/home', icon: FiHome, label: 'Главная' },
    { href: '/products', icon: FiCompass, label: 'Каталог' },
    { href: '/wishlist', icon: FiHeart, label: 'Избранное' },
    { href: '/chat', icon: FiMessageCircle, label: 'Чат' },
    { href: '/profile', icon: FiUser, label: 'Профиль' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/30 w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-1.5 transition-all duration-300 rounded-xl flex-1 min-w-0 ${
                isActive
                  ? 'text-primary-green scale-105 bg-white/30'
                  : 'text-gray-600 hover:text-gray-800 hover:scale-105 hover:bg-white/20'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-green' : ''}`} />
              <span className="text-xs font-medium truncate w-full text-center">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

