'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { FiChevronDown } from 'react-icons/fi'

const faqs = [
  {
    question: 'Как оформить заказ?',
    answer: 'Вы можете оформить заказ, просматривая наш каталог, выбирая товары и переходя к оформлению заказа. Вы также можете создать индивидуальный букет с помощью нашего инструмента.',
  },
  {
    question: 'Какое время доставки?',
    answer: 'Стандартная доставка занимает 2-3 рабочих дня. Экспресс-доставка доступна для доставки в тот же день или на следующий день в выбранных районах.',
  },
  {
    question: 'Могу ли я отследить свой заказ?',
    answer: 'Да! После подтверждения заказа вы можете отслеживать его в реальном времени через раздел "Отследить заказ" в вашем аккаунте.',
  },
  {
    question: 'Какие способы оплаты вы принимаете?',
    answer: 'Мы принимаем все основные кредитные карты, дебетовые карты и цифровые способы оплаты. Все транзакции защищены и зашифрованы.',
  },
  {
    question: 'Могу ли я отменить или изменить заказ?',
    answer: 'Вы можете отменить или изменить заказ в течение 2 часов после его оформления. После этого обратитесь в нашу службу поддержки.',
  },
  {
    question: 'Предлагаете ли вы индивидуальные букеты?',
    answer: 'Да! У нас есть конструктор букетов, где вы можете выбрать цветы, размер и добавить персональное сообщение.',
  },
]

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen pb-20 w-full overflow-x-hidden">
      <Header title="Частые вопросы" showBack showCart />

      <div className="max-w-md mx-auto px-4 py-4 space-y-3 w-full overflow-x-hidden">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="glass-card overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-all duration-200"
            >
              <span className="font-semibold text-left text-gray-900">{faq.question}</span>
              <FiChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-900 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

