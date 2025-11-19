import { Order } from './types'

export const ORDER_STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждён',
  preparing: 'Готовится',
  delivering: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

export const ORDER_STATUS_DESCRIPTIONS: Record<Order['status'], string> = {
  pending: 'Мы проверяем детали вашего заказа.',
  confirmed: 'Ваш заказ подтверждён и передан в сборку.',
  preparing: 'Флористы собирают композицию и упаковывают заказ.',
  delivering: 'Курьер уже в пути и скоро будет у вас.',
  delivered: 'Заказ доставлен. Надеемся, вам понравилось!',
  cancelled: 'Заказ отменён. Если это ошибка, напишите нам в поддержку.',
}

export const ORDER_STATUS_BADGES: Record<Order['status'], string> = {
  pending: 'bg-yellow-100/50 text-yellow-700',
  confirmed: 'bg-amber-50 text-amber-700',
  preparing: 'bg-blue-50 text-blue-700',
  delivering: 'bg-blue-100/50 text-blue-700',
  delivered: 'bg-green-100/50 text-green-700',
  cancelled: 'bg-red-100/60 text-red-700',
}

