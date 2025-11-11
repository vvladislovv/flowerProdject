'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import Button from '@/components/Button'
import EmojiImage from '@/components/EmojiImage'
import { FiMapPin } from 'react-icons/fi'
import { storage } from '@/lib/storage'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('Букеты')

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
        <Header
          title=""
          showMenu
          showSearch
          showCart
        />
        <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
          <div className="glass-card p-4 rounded-2xl animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  const categories = ['Все', 'Букеты', 'Комнатные', 'Аксессуары', 'Подарки']

  const featuredProducts = [
    {
      id: '5',
      name: 'Blue White Bouquets',
      price: 90,
      emoji: '💐',
      rating: 4.9,
    },
    {
      id: '6',
      name: 'Royal Pink Bouquets',
      price: 95,
      emoji: '🌹',
      rating: 4.8,
    },
  ]

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header
        title=""
        showMenu
        showSearch
        showCart
      />
      
      <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
        {/* Location */}
        <div className="flex items-center gap-2 mb-4 glass-card p-4 rounded-2xl animate-fade-in">
          <FiMapPin className="w-5 h-5 text-primary-green" />
          <select className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none flex-1">
            <option>{user.location || 'Москва, Россия'}</option>
          </select>
        </div>

        {/* Special Offers */}
        <div className="glass-card p-6 mb-6 border border-primary-green/30 bg-primary-green/20 backdrop-blur-xl rounded-3xl animate-slide-up">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Сегодняшние предложения</h3>
            <p className="text-sm mb-4 text-gray-900">
              Получите специальное предложение до{' '}
              <span className="text-3xl font-bold text-primary-green">20%</span>
            </p>
            <Button
              variant="secondary"
              color="green"
              onClick={() => router.push('/products')}
            >
              Заказать сейчас
            </Button>
          </div>
        </div>

        {/* Recommended For You */}
        <div className="mb-6 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Рекомендуем для вас
          </h2>
          
          {/* Category Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 rounded-full animate-slide-in-right flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'glass bg-primary-green/80 text-white border border-primary-green/50 shadow-lg'
                    : 'glass-button text-gray-900 border border-white/30 hover:bg-white/70'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-2xl animate-scale-in w-full max-w-full"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-primary-green/10 via-white to-primary-purple/10 overflow-hidden">
                  <EmojiImage emoji={product.emoji} size="lg" className="w-full h-full" />
                </div>
                <div className="p-3 w-full overflow-hidden bg-white/50">
                  <h3 className="font-semibold text-sm mb-1 truncate text-gray-900">{product.name}</h3>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-primary-green font-bold truncate">
                      {product.price} ₽
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs text-gray-900 font-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

