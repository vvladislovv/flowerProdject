'use client'

import BottomNav from '@/components/BottomNav'
import EmojiImage from '@/components/EmojiImage'
import Header from '@/components/Header'
import { storage } from '@/lib/storage'
import { FilterOptions, Product } from '@/lib/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiFilter, FiGrid, FiList } from 'react-icons/fi'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const allProducts = storage.getProducts()
    setProducts(allProducts)
    setFilteredProducts(allProducts)
  }, [])

  useEffect(() => {
    let filtered = [...products]

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter((p) => p.category === filters.category)
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!)
    }

    if (filters.occasion) {
      filtered = filtered.filter(
        (p) => p.occasion?.includes(filters.occasion!)
      )
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= filters.minRating!)
    }

    setFilteredProducts(filtered)
  }, [filters, searchQuery, products])

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setShowFilters(false)
  }

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header
        title="Продукты"
        showMenu
        showSearch
        showCart
      />

      <div className="max-w-md mx-auto px-4 py-4 w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-4 glass-card p-3 animate-fade-in">
          <p className="text-sm text-gray-900 font-medium">{filteredProducts.length} товаров</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="p-2 glass-button hover:bg-white/70 transition-all duration-200"
            >
              <FiFilter className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1 glass p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-all duration-200 ${
                  viewMode === 'grid' ? 'glass bg-primary-green/80 text-white border border-primary-green/50 shadow-lg' : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-all duration-200 ${
                  viewMode === 'list' ? 'glass bg-primary-green/80 text-white border border-primary-green/50 shadow-lg' : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in w-full max-w-full"
                style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }}
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
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 flex animate-slide-up"
                style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }}
              >
                <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary-green/10 via-white to-primary-purple/10 border-r border-white/30 overflow-hidden">
                  <EmojiImage emoji={product.image} size="sm" className="w-full h-full" />
                </div>
                <div className="p-4 flex-1 min-w-0 overflow-hidden">
                  <h3 className="font-semibold mb-1 text-gray-900 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-900 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-green font-bold">
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
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-900">Товары не найдены</p>
          </div>
        )}
      </div>

      {showFilters && (
        <FilterModal
          filters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      <BottomNav />
    </div>
  )
}

function FilterModal({
  filters,
  onApply,
  onClose,
}: {
  filters: FilterOptions
  onApply: (filters: FilterOptions) => void
  onClose: () => void
}) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const categories = ['All', 'Bouquets', 'Indoor', 'Accessories', 'Gifts']
  const categoryLabels: Record<string, string> = {
    'All': 'Все',
    'Bouquets': 'Букеты',
    'Indoor': 'Комнатные',
    'Accessories': 'Аксессуары',
    'Gifts': 'Подарки'
  }
  const occasions = ['Birthday', 'Anniversary', 'Wedding', 'Valentine', 'Housewarming']
  const flowers = ['Roses', 'Lilies', 'Tulips', 'Peonies', 'Hyacinths', 'Marigolds', 'Daffodils']

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end">
      <div className="glass-dark w-full max-w-md mx-auto border-t border-white/30 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Фильтр</h2>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Категории</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={localFilters.category === cat}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        category: e.target.checked ? cat : undefined,
                      })
                    }
                    className="w-4 h-4 text-primary-green"
                  />
                  <span className="text-gray-900">{categoryLabels[cat] || cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Ценовой диапазон</h3>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Мин. цена"
                value={localFilters.minPrice || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="flex-1 px-3 py-2 border rounded-lg text-gray-900"
              />
              <input
                type="number"
                placeholder="Макс. цена"
                value={localFilters.maxPrice || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="flex-1 px-3 py-2 border rounded-lg text-gray-900"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">Рейтинг</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={localFilters.minRating === rating}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        minRating: e.target.checked ? rating : undefined,
                      })
                    }
                    className="w-4 h-4 text-primary-green"
                  />
                  <span className="text-gray-900">{rating}+ звезд</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onApply(localFilters)}
          className="w-full mt-6 bg-primary-green text-white py-3 rounded-lg font-medium hover:bg-accent-green transition"
        >
          Применить фильтр
        </button>
      </div>
    </div>
  )
}

