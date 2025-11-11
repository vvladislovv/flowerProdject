'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Button from '@/components/Button'
import { storage } from '@/lib/storage'
import { Product } from '@/lib/types'

const flowerTypes = [
  { id: 'roses', name: 'Roses', price: 5, emoji: '🌹' },
  { id: 'lilies', name: 'Lilies', price: 4, emoji: '🌺' },
  { id: 'tulips', name: 'Tulips', price: 3, emoji: '🌷' },
  { id: 'peonies', name: 'Peonies', price: 6, emoji: '🌸' },
  { id: 'hyacinths', name: 'Hyacinths', price: 4, emoji: '🌼' },
]

const sizes = [
  { id: 'small', name: 'Small', basePrice: 30, flowers: 5 },
  { id: 'medium', name: 'Medium', basePrice: 50, flowers: 10 },
  { id: 'large', name: 'Large', basePrice: 80, flowers: 15 },
]

export default function CustomBouquetPage() {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState(sizes[1])
  const [selectedFlowers, setSelectedFlowers] = useState<Record<string, number>>({})
  const [customMessage, setCustomMessage] = useState('')

  const handleFlowerChange = (flowerId: string, count: number) => {
    setSelectedFlowers({
      ...selectedFlowers,
      [flowerId]: Math.max(0, Math.min(count, selectedSize.flowers)),
    })
  }

  const calculatePrice = () => {
    const basePrice = selectedSize.basePrice
    const flowersPrice = Object.entries(selectedFlowers).reduce((sum, [flowerId, count]) => {
      const flower = flowerTypes.find((f) => f.id === flowerId)
      return sum + (flower ? flower.price * count : 0)
    }, 0)
    return basePrice + flowersPrice
  }

  const handleAddToCart = () => {
    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name: 'Custom Bouquet',
      price: calculatePrice(),
      image: '💐',
      category: 'Custom',
      rating: 5,
      reviewsCount: 0,
      description: 'Custom made bouquet',
    }

    storage.addToCart({
      product: customProduct,
      quantity: 1,
      customMessage,
    })

    router.push('/cart')
  }

  const totalFlowers = Object.values(selectedFlowers).reduce((sum, count) => sum + count, 0)
  const remainingFlowers = selectedSize.flowers - totalFlowers

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Индивидуальный букет" showBack showCart />

      <div className="max-w-md mx-auto px-4 py-4 space-y-6 w-full overflow-x-hidden">
        {/* Size Selection */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Выберите размер</h2>
          <div className="grid grid-cols-3 gap-3 w-full">
            {sizes.map((size, index) => (
              <button
                key={size.id}
                onClick={() => {
                  setSelectedSize(size)
                  setSelectedFlowers({})
                }}
                className={`p-4 border-2 transition-all duration-300 backdrop-blur-lg rounded-2xl animate-scale-in w-full max-w-full ${
                  selectedSize.id === size.id
                    ? 'glass bg-primary-green/20 border-primary-green/50 shadow-lg'
                    : 'glass-button border-white/30 hover:bg-white/70'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="font-semibold text-gray-900">{size.name === 'Small' ? 'Маленький' : size.name === 'Medium' ? 'Средний' : 'Большой'}</p>
                <p className="text-sm text-gray-900">{size.flowers} цветков</p>
                <p className="text-primary-green font-bold mt-1">{size.basePrice} ₽</p>
              </button>
            ))}
          </div>
        </div>

        {/* Flower Selection */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Выберите цветы (осталось {remainingFlowers})
          </h2>
          <div className="space-y-3">
            {flowerTypes.map((flower, index) => {
              const count = selectedFlowers[flower.id] || 0
              return (
                <div
                  key={flower.id}
                  className="glass-card p-4 flex items-center gap-4 rounded-2xl animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30 flex-shrink-0">
                    <span className="text-4xl">{flower.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{flower.name === 'Roses' ? 'Розы' : flower.name === 'Lilies' ? 'Лилии' : flower.name === 'Tulips' ? 'Тюльпаны' : flower.name === 'Peonies' ? 'Пионы' : 'Гиацинты'}</p>
                    <p className="text-sm text-gray-900">{flower.price} ₽ за штуку</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleFlowerChange(flower.id, count - 1)}
                      disabled={count === 0}
                      className="w-10 h-10 glass-button flex items-center justify-center hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-xl"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{count}</span>
                    <button
                      onClick={() => handleFlowerChange(flower.id, count + 1)}
                      disabled={remainingFlowers === 0 && count === 0}
                      className="w-10 h-10 glass-button flex items-center justify-center hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Custom Message */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Добавить сообщение (необязательно)</h2>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Введите ваше сообщение здесь..."
            className="w-full px-4 py-3 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green resize-none text-gray-900"
            rows={4}
          />
        </div>

        {/* Price Summary */}
        <div className="glass-card p-4 rounded-2xl animate-slide-up">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Итоговая цена</span>
            <span className="text-2xl font-bold text-primary-green">
              {calculatePrice()} ₽
            </span>
          </div>
        </div>

        <Button onClick={handleAddToCart} fullWidth>
          Добавить в корзину
        </Button>
      </div>
    </div>
  )
}

