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
import { Product } from '@/lib/types'

const cityStoreOptions = [
  {
    city: 'Москва, Россия',
    stores: [
      {
        name: 'Бутик «Арбатские цветы»',
        tagline: 'Авторские букеты и экспресс-доставка по центру.',
        featuredProductIds: ['1', '2', '7', '12'],
      },
      {
        name: 'Мастерская «Цветы на Патриарших»',
        tagline: 'Премиальные композиции и редкие растения.',
        featuredProductIds: ['3', '5', '14', '18'],
      },
    ],
  },
  {
    city: 'Санкт-Петербург, Россия',
    stores: [
      {
        name: 'Студия «Невский сад»',
        tagline: 'Северная классика и кофейные тона в букетах.',
        featuredProductIds: ['4', '6', '10', '16'],
      },
      {
        name: 'Flower Loft «Лиговский»',
        tagline: 'Современные минималистичные букеты и декор.',
        featuredProductIds: ['8', '9', '19', '25'],
      },
    ],
  },
  {
    city: 'Казань, Россия',
    stores: [
      {
        name: '«Восточный букет»',
        tagline: 'Яркие сочетания и национальные мотивы.',
        featuredProductIds: ['11', '13', '20', '23'],
      },
      {
        name: 'Маркет «Цветы на Кремлёвской»',
        tagline: 'Комнатные растения и подарочные наборы.',
        featuredProductIds: ['15', '17', '21', '24'],
      },
    ],
  },
]

const LOCATION_STORAGE_KEY = 'flowers_location_selection'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('Букеты')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCityIndex, setSelectedCityIndex] = useState(0)
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (typeof parsed.city === 'number') {
          setSelectedCityIndex(parsed.city)
        }
        if (typeof parsed.store === 'number') {
          setSelectedStoreIndex(parsed.store)
        }
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    let currentUser = storage.getUser()

    if (!currentUser) {
      currentUser = {
        id: 'guest',
        name: 'Гость',
        email: 'guest@example.com',
        phone: '+7 (000) 000-00-00',
        location: 'Москва, Россия',
      }
      storage.setUser(currentUser)
    }

    setUser(currentUser)
    setProducts(storage.getProducts())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify({ city: selectedCityIndex, store: selectedStoreIndex })
    )

    setUser((prev: any) => {
      if (!prev) return prev
      const activeCity = cityStoreOptions[selectedCityIndex]
      const activeStore = activeCity.stores[selectedStoreIndex]
      const updatedUser = {
        ...prev,
        location: `${activeCity.city} • ${activeStore.name}`,
      }
      storage.setUser(updatedUser)
      return updatedUser
    })
  }, [selectedCityIndex, selectedStoreIndex])

  const activeCity = cityStoreOptions[selectedCityIndex]
  const activeStore = activeCity.stores[selectedStoreIndex]
  const featuredProducts = activeStore.featuredProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[]

  const displayProducts = featuredProducts.length
    ? featuredProducts
    : products.slice(0, 2)

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
        <div className="glass-card p-4 mb-4 rounded-2xl animate-fade-in space-y-4">
          <div className="flex items-center gap-3">
            <FiMapPin className="w-5 h-5 text-primary-green flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Выберите город</p>
              <p className="text-xs text-gray-600">
                Найдено {activeCity.stores.length} магазинов
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-gray-500">
              Город
            </label>
            <select
              value={selectedCityIndex}
              onChange={(e) => {
                setSelectedCityIndex(Number(e.target.value))
                setSelectedStoreIndex(0)
              }}
              className="glass-button border border-white/30 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-green"
            >
              {cityStoreOptions.map((option, index) => (
                <option value={index} key={option.city}>
                  {option.city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-gray-500">
              Магазин
            </label>
            <select
              value={selectedStoreIndex}
              onChange={(e) => setSelectedStoreIndex(Number(e.target.value))}
              className="glass-button border border-white/30 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-green"
            >
              {activeCity.stores.map((store, index) => (
                <option value={index} key={store.name}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="glass-button border border-dashed border-primary-green/40 p-3 rounded-xl text-sm text-gray-900">
            <p className="font-semibold">{activeStore.name}</p>
            <p className="text-gray-600 text-xs">{activeStore.tagline}</p>
            <div className="flex items-center justify-between text-xs mt-2 text-gray-600">
              <span>{activeCity.city}</span>
              <span>Товаров: {activeStore.featuredProductIds.length}</span>
            </div>
          </div>
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
                    ? 'glass bg-white text-gray-900 border border-primary-green/60 shadow-lg'
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
            {displayProducts.map((product, index) => (
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
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

