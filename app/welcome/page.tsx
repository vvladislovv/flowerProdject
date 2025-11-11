'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

export default function WelcomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Добро пожаловать в доставку цветов',
      subtitle: 'Заказывайте свежие цветы и букеты с доставкой на дом. Широкий выбор для любого повода.',
      emoji: '💐',
    },
    {
      title: 'Свежие цветы каждый день',
      subtitle: 'Получайте самые свежие цветы с доставкой к вашей двери каждый день. Выбирайте из нашего широкого ассортимента красивых букетов.',
      emoji: '🌺',
    },
    {
      title: 'Индивидуальные букеты',
      subtitle: 'Создайте идеальный букет с помощью нашего инструмента. Добавьте персональное сообщение и выберите время доставки.',
      emoji: '🌹',
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/signin')
    }
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full overflow-x-hidden">
        <div className="text-center mb-8 glass-card p-6 animate-scale-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            {steps[currentStep].subtitle}
          </p>
        </div>

        <div className="w-full h-64 mb-8 flex items-center justify-center glass-card border border-white/30 animate-fade-in">
          <span className="text-9xl animate-scale-in" style={{ animationDelay: '0.2s' }}>{steps[currentStep].emoji}</span>
        </div>

        <div className="flex gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 transition-all ${
                index === currentStep
                  ? 'bg-primary-green w-8'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          fullWidth
          className="mb-4 animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          {currentStep < steps.length - 1 ? 'Далее' : 'Начать'}
        </Button>

        {currentStep < steps.length - 1 && (
          <button
            onClick={() => router.push('/signin')}
            className="text-gray-500 text-sm animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Пропустить
          </button>
        )}
      </div>
    </div>
  )
}

