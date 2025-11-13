'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Input from '@/components/Input'
import { FiSend } from 'react-icons/fi'
import { ChatMessage } from '@/lib/types'

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // Загрузить сообщения из localStorage
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('flowers_chat_messages')
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages)
          setMessages(parsed)
        } catch (e) {
          console.error('Error loading messages:', e)
          // Если ошибка, установить начальное сообщение
          setMessages([
            {
              id: '1',
              sender: 'florist',
              text: 'Здравствуйте! Чем могу помочь с вашим заказом?',
              timestamp: new Date().toISOString(),
            },
          ])
        }
      } else {
        // Если нет сохраненных сообщений, установить начальное
        setMessages([
          {
            id: '1',
            sender: 'florist',
            text: 'Здравствуйте! Чем могу помочь с вашим заказом?',
            timestamp: new Date().toISOString(),
          },
        ])
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    // Сохранить сообщения в localStorage
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('flowers_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setNewMessage('')

    // Simulate florist response
    setTimeout(() => {
      const floristMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'florist',
        text: 'Спасибо за ваше сообщение! Я проверю ваш заказ и свяжусь с вами в ближайшее время.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, floristMessage])
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Header title="Чат с флористом" showBack showCart={false} />

      <div className="flex-1 overflow-y-auto pb-20 max-w-md mx-auto w-full overflow-x-hidden">
        <div className="px-4 py-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex animate-slide-up ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[80%] px-4 py-2 border backdrop-blur-lg ${
                  message.sender === 'user'
                    ? 'glass bg-primary-green/80 text-gray-900 border-primary-green/50 shadow-lg'
                    : 'glass-card text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-gray-600'
                      : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSend}
        className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/30 p-4 max-w-md mx-auto"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 px-4 py-2 glass-button border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-green text-gray-900"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2 glass border transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-primary-green/80 text-white border-primary-green/50 hover:bg-primary-green hover:shadow-lg'
                : 'bg-gray-300/50 text-gray-500 border-gray-300/50 cursor-not-allowed'
            }`}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

