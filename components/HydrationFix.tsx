'use client'

import { useEffect } from 'react'

/**
 * Компонент для исправления проблем с гидратацией,
 * вызванных браузерными расширениями, которые добавляют
 * атрибуты к DOM элементам (например, bis_skin_checked)
 */
export default function HydrationFix() {
  useEffect(() => {
    // Удаляем атрибут bis_skin_checked, добавленный браузерными расширениями
    const removeBisSkinChecked = () => {
      try {
        // Используем более широкий поиск
        const allElements = document.querySelectorAll('*')
        allElements.forEach((el) => {
          if (el.hasAttribute('bis_skin_checked')) {
            el.removeAttribute('bis_skin_checked')
          }
        })
      } catch (error) {
        // Игнорируем ошибки при удалении атрибутов
        console.debug('HydrationFix: Error removing attributes', error)
      }
    }

    // Удаляем сразу после монтирования
    removeBisSkinChecked()

    // Используем MutationObserver для отслеживания изменений DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
          if (mutation.target instanceof Element) {
            mutation.target.removeAttribute('bis_skin_checked')
          }
        } else if (mutation.type === 'childList') {
          // Проверяем новые добавленные элементы
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              if (node.hasAttribute('bis_skin_checked')) {
                node.removeAttribute('bis_skin_checked')
              }
              // Проверяем дочерние элементы
              const children = node.querySelectorAll('[bis_skin_checked]')
              children.forEach((el) => el.removeAttribute('bis_skin_checked'))
            }
          })
        }
      })
    })

    // Начинаем наблюдение за изменениями во всем документе
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['bis_skin_checked'],
      childList: true,
      subtree: true,
    })

    // Также удаляем периодически для надежности
    const intervals = [
      setTimeout(removeBisSkinChecked, 50),
      setTimeout(removeBisSkinChecked, 100),
      setTimeout(removeBisSkinChecked, 200),
      setTimeout(removeBisSkinChecked, 500),
    ]

    return () => {
      observer.disconnect()
      intervals.forEach((id) => clearTimeout(id))
    }
  }, [])

  return null
}

