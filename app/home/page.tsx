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
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [allProducts, setAllProducts] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    const currentUser = storage.getUser()
    setUser(currentUser)
    
    if (!currentUser) {
      router.push('/welcome')
    }
  }, [router])

  useEffect(() => {
    if (mounted) {
      const products = storage.getProducts()
      setAllProducts(products)
    }
  }, [mounted])

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

  const categories = ['Все', 'Букеты', 'Комнатные', 'Аксессуары', 'Подарки', 'Семена', 'Уход']
  
  const categoryMap: Record<string, string> = {
    'Все': 'All',
    'Букеты': 'Bouquets',
    'Комнатные': 'Indoor',
    'Аксессуары': 'Accessories',
    'Подарки': 'Gifts',
    'Семена': 'Seeds',
    'Уход': 'Care',
  }

  const russianCities = [
    'Москва, Россия',
    'Санкт-Петербург, Россия',
    'Новосибирск, Россия',
    'Екатеринбург, Россия',
    'Казань, Россия',
    'Нижний Новгород, Россия',
    'Челябинск, Россия',
    'Самара, Россия',
    'Омск, Россия',
    'Ростов-на-Дону, Россия',
    'Уфа, Россия',
    'Красноярск, Россия',
    'Воронеж, Россия',
    'Пермь, Россия',
    'Волгоград, Россия',
  ]

  const getFilteredProducts = () => {
    if (selectedCategory === 'Все') {
      return allProducts.slice(0, 6)
    }
    const category = categoryMap[selectedCategory]
    return allProducts
      .filter(p => p.category === category)
      .slice(0, 6)
  }

  const displayedProducts = getFilteredProducts()

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
          <select 
            className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none flex-1 cursor-pointer"
            value={user.location || 'Москва, Россия'}
            onChange={(e) => {
              const updatedUser = { ...user, location: e.target.value }
              setUser(updatedUser)
              storage.setUser(updatedUser)
            }}
          >
            {russianCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Special Offers */}
        <div className="glass-card p-8 mb-6 border border-primary-green/30 bg-primary-green/20 backdrop-blur-xl rounded-3xl animate-slide-up">
          <div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Сегодняшние предложения</h3>
            <p className="text-base mb-6 text-gray-900">
              Получите специальное предложение до{' '}
              <span className="text-5xl font-bold text-primary-green">20%</span>
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
                    ? 'glass bg-white/90 text-gray-900 border border-gray-300 shadow-lg font-semibold'
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
            {displayedProducts.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-900">Товары не найдены</p>
              </div>
            ) : (
              displayedProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-2xl animate-scale-in w-full max-w-full"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-primary-green/10 via-white to-primary-purple/10 overflow-hidden">
                    <EmojiImage emoji={product.image} size="lg" className="w-full h-full" />
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
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

