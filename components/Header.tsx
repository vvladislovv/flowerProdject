'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiSearch, FiShoppingCart, FiMenu } from 'react-icons/fi'
import { storage } from '@/lib/storage'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showCart?: boolean
  showSearch?: boolean
  showMenu?: boolean
  rightAction?: React.ReactNode
}

export default function Header({
  title,
  showBack = false,
  showCart = true,
  showSearch = false,
  showMenu = false,
  rightAction,
}: HeaderProps) {
  const router = useRouter()
  const cart = storage.getCart()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-white/30 w-full max-w-full overflow-x-hidden" suppressHydrationWarning>
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto w-full" suppressHydrationWarning>
        <div className="flex items-center gap-3 flex-1" suppressHydrationWarning>
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 glass-button hover:bg-white/60 transition-all duration-300 rounded-xl"
              aria-label="Назад"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
          )}
          {showMenu && (
            <Link
              href="/menu"
              className="p-2 glass-button hover:bg-white/60 transition-all duration-300 rounded-xl"
              aria-label="Меню"
            >
              <FiMenu className="w-5 h-5" />
            </Link>
          )}
          {title && (
            <h1 className="text-lg font-semibold flex-1">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <Link
              href="/search"
              className="p-2 glass-button hover:bg-white/60 transition-all duration-300 rounded-xl"
              aria-label="Поиск"
            >
              <FiSearch className="w-5 h-5" />
            </Link>
          )}
          {showCart && (
            <Link
              href="/cart"
              className="relative p-2 glass-button hover:bg-white/60 transition-all duration-300 rounded-xl"
              aria-label="Корзина"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-green text-white text-xs w-5 h-5 flex items-center justify-center border border-white/30 shadow-lg rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  )
}

