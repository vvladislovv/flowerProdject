import { CartItem, Order, Product, Review, User } from './types'

const STORAGE_KEYS = {
  USER: 'flowers_user',
  CART: 'flowers_cart',
  ORDERS: 'flowers_orders',
  WISHLIST: 'flowers_wishlist',
  PRODUCTS: 'flowers_products',
  REVIEWS: 'flowers_reviews',
}

export const storage = {
  // User
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  },

  setUser: (user: User | null): void => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  },

  // Cart
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.CART)
    return data ? JSON.parse(data) : []
  },

  setCart: (cart: CartItem[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
  },

  addToCart: (item: CartItem): void => {
    const cart = storage.getCart()
    const existingIndex = cart.findIndex(
      (i) => i.product.id === item.product.id
    )
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity
    } else {
      cart.push(item)
    }
    storage.setCart(cart)
  },

  removeFromCart: (productId: string): void => {
    const cart = storage.getCart()
    const filtered = cart.filter((item) => item.product.id !== productId)
    storage.setCart(filtered)
  },

  updateCartItemQuantity: (productId: string, quantity: number): void => {
    const cart = storage.getCart()
    const item = cart.find((i) => i.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        storage.removeFromCart(productId)
      } else {
        item.quantity = quantity
        storage.setCart(cart)
      }
    }
  },

  clearCart: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.CART)
  },

  // Orders
  getOrders: (): Order[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
    return data ? JSON.parse(data) : []
  },

  addOrder: (order: Order): void => {
    const orders = storage.getOrders()
    orders.unshift(order)
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  },

  // Wishlist
  getWishlist: (): string[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST)
    return data ? JSON.parse(data) : []
  },

  toggleWishlist: (productId: string): void => {
    const wishlist = storage.getWishlist()
    const index = wishlist.indexOf(productId)
    if (index >= 0) {
      wishlist.splice(index, 1)
    } else {
      wishlist.push(productId)
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist))
  },

  // Products (mock data)
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    if (data) return JSON.parse(data)
    
    // Initialize with mock data
    const mockProducts: Product[] = [
      // Букеты
      {
        id: '1',
        name: 'Букет «Белый рассвет»',
        price: 86,
        image: '🌼',
        category: 'Bouquets',
        occasion: ['Birthday', 'Anniversary'],
        flowers: ['Roses', 'Lilies'],
        rating: 4.9,
        reviewsCount: 24,
        description: 'Белые цветы с лимонными акцентами, собранные в воздушную композицию.',
        seller: 'Студия «Лилии на Патриарших»',
        size: 'Средний',
      },
      {
        id: '2',
        name: 'Букет «Лазурная волна»',
        price: 90,
        image: '💐',
        category: 'Bouquets',
        occasion: ['Wedding', 'Anniversary'],
        flowers: ['Tulips', 'Hyacinths'],
        rating: 4.9,
        reviewsCount: 107,
        description: 'Комбинация голубых и молочных бутонов для торжественных событий.',
        seller: 'Бутик «Арбатские цветы»',
        size: 'Премиум',
      },
      {
        id: '3',
        name: 'Букет «Королевский пион»',
        price: 95,
        image: '🌹',
        category: 'Bouquets',
        occasion: ['Valentine', 'Anniversary'],
        flowers: ['Roses', 'Peonies'],
        rating: 4.8,
        reviewsCount: 84,
        description: 'Насыщенно-розовые бутоны пионов и садовых роз в бархатной упаковке.',
        seller: 'Flower Loft «Лиговский»',
        size: 'Большой',
      },
      {
        id: '4',
        name: 'Букет «Закатный огонь»',
        price: 110,
        image: '🌺',
        category: 'Bouquets',
        occasion: ['Birthday', 'Graduation'],
        flowers: ['Sunflowers', 'Daisies'],
        rating: 4.7,
        reviewsCount: 52,
        description: 'Контраст подсолнухов и гербер с мягкими пастельными оттенками.',
        seller: 'Студия «Невский сад»',
        size: 'Большой',
      },
      {
        id: '5',
        name: 'Букет «Ванильная нежность»',
        price: 98,
        image: '🌷',
        category: 'Bouquets',
        occasion: ['Wedding', 'Anniversary'],
        flowers: ['Lilies', 'Baby Breath'],
        rating: 4.8,
        reviewsCount: 91,
        description: 'Лилии цвета айвори с гипсофилой и хлопковыми веточками.',
        seller: 'Мастерская «Цветы на Патриарших»',
        size: 'Средний',
      },
      {
        id: '6',
        name: 'Букет «Северное сияние»',
        price: 105,
        image: '🤍',
        category: 'Bouquets',
        occasion: ['Wedding', 'Anniversary', 'Valentine'],
        flowers: ['White Roses', 'Lilies'],
        rating: 4.9,
        reviewsCount: 145,
        description: 'Белоснежная композиция в форме сердца с легким серебристым декором.',
        seller: 'Студия «Невский сад»',
        size: 'Премиум',
      },
      {
        id: '7',
        name: 'Букет «Изумрудное утро»',
        price: 120,
        image: '🌈',
        category: 'Bouquets',
        occasion: ['Birthday', 'Graduation'],
        flowers: ['Mixed Seasonal'],
        rating: 4.8,
        reviewsCount: 123,
        description: 'Яркая смесь сезонных цветов с акцентом на зелёные оттенки.',
        seller: 'Бутик «Арбатские цветы»',
        size: 'Большой',
      },
      {
        id: '8',
        name: 'Букет «Алые легенды»',
        price: 125,
        image: '🌹',
        category: 'Bouquets',
        occasion: ['Valentine', 'Anniversary'],
        flowers: ['Red Roses'],
        rating: 4.9,
        reviewsCount: 203,
        description: 'Классические красные розы, перевязанные бархатной лентой.',
        seller: 'Студия «Цветы на Кремлёвской»',
        size: 'Большой',
      },
      {
        id: '9',
        name: 'Букет «Весенний сад»',
        price: 75,
        image: '🌷',
        category: 'Bouquets',
        occasion: ['Birthday', 'Housewarming'],
        flowers: ['Tulips'],
        rating: 4.7,
        reviewsCount: 64,
        description: 'Пастельные тюльпаны нескольких сортов в крафтовой упаковке.',
        seller: 'Flower Loft «Лиговский»',
        size: 'Средний',
      },
      {
        id: '10',
        name: 'Букет «Сиреневый туман»',
        price: 115,
        image: '🌸',
        category: 'Bouquets',
        occasion: ['Spring', 'Anniversary', 'Birthday'],
        flowers: ['Cherry Blossoms'],
        rating: 4.9,
        reviewsCount: 67,
        description: 'Коллекция веточек сакуры и пионовидных роз с ароматом лета.',
        seller: 'Маркет «Цветы на Кремлёвской»',
        size: 'Средний',
      },
      // Комнатные растения
      {
        id: '11',
        name: 'Фикус «Городской сад»',
        price: 126,
        image: '🌿',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['House Plants'],
        rating: 4.8,
        reviewsCount: 38,
        description: 'Высокий фикус в молочном кашпо, очищающий воздух в квартире.',
        seller: 'Маркет «Цветы на Кремлёвской»',
        size: 'Большой',
      },
      {
        id: '12',
        name: 'Орхидея «Белый шёлк»',
        price: 68,
        image: '🪷',
        category: 'Indoor',
        occasion: ['Anniversary', 'Housewarming'],
        flowers: ['Orchids'],
        rating: 4.9,
        reviewsCount: 88,
        description: 'Двухцветная орхидея фаленопсис в керамическом кашпо.',
        seller: 'Мастерская «Цветы на Патриарших»',
        size: 'Средний',
      },
      {
        id: '13',
        name: 'Лавандовый куст',
        price: 45,
        image: '🌿',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['Lavender'],
        rating: 4.7,
        reviewsCount: 41,
        description: 'Ароматная лаванда для балкона или кухни, поставляется с удобрением.',
        seller: '«Восточный букет»',
        size: 'Малый',
      },
      {
        id: '14',
        name: 'Суккуленты «Мини-сад»',
        price: 35,
        image: '🌵',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['Succulents'],
        rating: 4.8,
        reviewsCount: 127,
        description: 'Собранная композиция из пяти суккулентов в бетонном кашпо.',
        seller: 'Flower Loft «Лиговский»',
        size: 'Набор',
      },
      {
        id: '15',
        name: 'Лимонное дерево «Амальфи»',
        price: 246,
        image: '🍋',
        category: 'Indoor',
        occasion: ['Housewarming', 'Birthday'],
        flowers: ['House Plants'],
        rating: 4.9,
        reviewsCount: 25,
        description: 'Компактное цитрусовое дерево с плодами и ароматом свежести.',
        seller: 'Маркет «Цветы на Кремлёвской»',
        size: 'Большой',
      },
      {
        id: '16',
        name: 'Бамбук удачи',
        price: 42,
        image: '🎋',
        category: 'Indoor',
        occasion: ['Housewarming', 'New Year'],
        flowers: ['Bamboo'],
        rating: 4.6,
        reviewsCount: 89,
        description: 'Традиционный бамбук в стеклянной вазе с морскими камнями.',
        seller: 'Студия «Невский сад»',
        size: 'Средний',
      },
      {
        id: '17',
        name: 'Коллекция мягких кактусов',
        price: 48,
        image: '🌵',
        category: 'Indoor',
        occasion: ['Housewarming'],
        flowers: ['Cacti'],
        rating: 4.7,
        reviewsCount: 156,
        description: 'Три вида кактусов в матовых кашпо, не требующих особого ухода.',
        seller: 'Flower Loft «Лиговский»',
        size: 'Набор',
      },
      {
        id: '18',
        name: 'Набор пряных трав',
        price: 55,
        image: '🌿',
        category: 'Indoor',
        occasion: ['Housewarming', 'Birthday'],
        flowers: ['Herbs'],
        rating: 4.9,
        reviewsCount: 134,
        description: 'Базилик, мята и розмарин в отдельных горшках с поддонами.',
        seller: 'Бутик «Арбатские цветы»',
        size: 'Набор',
      },
      // Аксессуары
      {
        id: '19',
        name: 'Хрустальная ваза «Галерея»',
        price: 65,
        image: '🏺',
        category: 'Accessories',
        occasion: ['Wedding', 'Anniversary'],
        rating: 4.8,
        reviewsCount: 42,
        description: 'Высокая ваза из выдувного стекла с ручной гравировкой.',
        seller: 'Мастерская «Цветы на Патриарших»',
        size: 'Средний',
      },
      {
        id: '20',
        name: 'Керамические вазы пастель',
        price: 85,
        image: '🫖',
        category: 'Accessories',
        occasion: ['Housewarming', 'Birthday'],
        rating: 4.7,
        reviewsCount: 28,
        description: 'Набор из трёх ваз в пастельных тонах для минималистичных интерьеров.',
        seller: '«Восточный букет»',
        size: 'Набор',
      },
      {
        id: '21',
        name: 'Металлическая ваза «Лофт»',
        price: 55,
        image: '⚱️',
        category: 'Accessories',
        occasion: ['Housewarming'],
        rating: 4.9,
        reviewsCount: 19,
        description: 'Матовый металл с геометрическим тиснением для сухоцветов.',
        seller: 'Студия «Невский сад»',
        size: 'Большой',
      },
      {
        id: '22',
        name: 'Набор лент и бантов',
        price: 12,
        image: '🎀',
        category: 'Accessories',
        occasion: ['Wedding', 'Birthday'],
        rating: 4.6,
        reviewsCount: 38,
        description: 'Шестнадцать оттенков атласных лент и готовых бантов.',
        seller: 'Flower Loft «Лиговский»',
        size: 'Набор',
      },
      {
        id: '23',
        name: 'Ароматические свечи «Сад»',
        price: 32,
        image: '🕯️',
        category: 'Accessories',
        occasion: ['Housewarming', 'Anniversary'],
        rating: 4.8,
        reviewsCount: 71,
        description: 'Свечи с ароматами жасмина, ванили и свежей зелени.',
        seller: 'Бутик «Арбатские цветы»',
        size: 'Набор',
      },
      {
        id: '24',
        name: 'Флористический набор «Старт»',
        price: 45,
        image: '🧰',
        category: 'Accessories',
        occasion: ['Birthday'],
        rating: 4.7,
        reviewsCount: 56,
        description: 'Ножницы, секатор и проволока в текстильном чехле.',
        seller: 'Маркет «Цветы на Кремлёвской»',
        size: 'Набор',
      },
      {
        id: '25',
        name: 'Современный подвес для растений',
        price: 28,
        image: '🪑',
        category: 'Accessories',
        occasion: ['Housewarming'],
        rating: 4.6,
        reviewsCount: 54,
        description: 'Макраме-подвес с деревянными бусинами для кашпо до 20 см.',
        seller: 'Студия «Невский сад»',
        size: 'Стандарт',
      },
      {
        id: '26',
        name: 'Диффузор «Цветочный дождь»',
        price: 38,
        image: '🕯️',
        category: 'Accessories',
        occasion: ['Housewarming', 'Anniversary'],
        rating: 4.9,
        reviewsCount: 167,
        description: 'Стеклянный флакон с тростниковыми палочками и ароматом пионов.',
        seller: 'Flower Loft «Лиговский»',
        size: 'Стандарт',
      },
      // Подарки
      {
        id: '27',
        name: 'Подарочная карта «Premium»',
        price: 100,
        image: '💳',
        category: 'Gifts',
        occasion: ['Birthday', 'Anniversary', 'Valentine'],
        rating: 5.0,
        reviewsCount: 156,
        description: 'Карта на любую сумму с возможностью персонального сообщения.',
        seller: 'Сеть «Demo Flowers»',
        size: 'Стандарт',
      },
      {
        id: '28',
        name: 'Ручная открытка «Тепло»',
        price: 8,
        image: '💌',
        category: 'Gifts',
        occasion: ['Birthday', 'Anniversary', 'Valentine'],
        rating: 4.9,
        reviewsCount: 89,
        description: 'Хэнд-мейд открытка с фактурной бумагой и тиснением по фольге.',
        seller: 'Студия «Арбатские буквы»',
        size: 'Стандарт',
      },
      {
        id: '29',
        name: 'Подарочный бокс «Ваниль»',
        price: 25,
        image: '🎁',
        category: 'Gifts',
        occasion: ['Birthday', 'Anniversary'],
        rating: 4.8,
        reviewsCount: 67,
        description: 'Шляпная коробка с шелковой лентой и карточкой для пожелания.',
        seller: '«Восточный букет»',
        size: 'Стандарт',
      },
      {
        id: '30',
        name: 'Шоколад ручной работы',
        price: 35,
        image: '🍫',
        category: 'Gifts',
        occasion: ['Valentine', 'Birthday', 'Anniversary'],
        rating: 4.9,
        reviewsCount: 124,
        description: 'Ассорти трюфелей с ягодами и орехами без добавленного сахара.',
        seller: 'Кондитерская «Какао и Цветы»',
        size: 'Средний',
      },
      {
        id: '31',
        name: 'Набор мёда «Лаванда и липа»',
        price: 28,
        image: '🍯',
        category: 'Gifts',
        occasion: ['Housewarming', 'Birthday'],
        rating: 4.8,
        reviewsCount: 45,
        description: 'Два вида натурального мёда с деревянной ложкой в комплекте.',
        seller: 'Маркет «Цветы на Кремлёвской»',
        size: 'Набор',
      },
      {
        id: '32',
        name: 'Плюшевый медведь с букетом',
        price: 45,
        image: '🧸',
        category: 'Gifts',
        occasion: ['Valentine', 'Birthday'],
        rating: 4.8,
        reviewsCount: 92,
        description: 'Мягкая игрушка высотой 35 см с мини-букетом из хлопка.',
        seller: 'Сеть «Demo Flowers»',
        size: 'Средний',
      },
      {
        id: '33',
        name: 'Коллекция цветочного чая',
        price: 32,
        image: '🫖',
        category: 'Gifts',
        occasion: ['Birthday', 'Housewarming'],
        rating: 4.7,
        reviewsCount: 98,
        description: 'Набор из шести видов чая с лепестками розы, жасмина и василька.',
        seller: 'Студия «Невский сад»',
        size: 'Набор',
      },
      {
        id: '34',
        name: 'Арома-набор «Домашний спа»',
        price: 45,
        image: '🌹',
        category: 'Gifts',
        occasion: ['Valentine', 'Anniversary'],
        rating: 4.9,
        reviewsCount: 201,
        description: 'Пена для ванны, крем для рук и бомбочка с лепестками роз.',
        seller: 'Бутик «Арбатские цветы»',
        size: 'Набор',
      },
      {
        id: '35',
        name: 'Парфюмерный сет «Флёр»',
        price: 65,
        image: '🌺',
        category: 'Gifts',
        occasion: ['Valentine', 'Anniversary', 'Birthday'],
        rating: 4.8,
        reviewsCount: 178,
        description: 'Три мини-аромата с нотами пиона, магнолии и мускуса.',
        seller: 'Кондитерская «Какао и Цветы»',
        size: 'Набор',
      },
      {
        id: '36',
        name: 'Подарочный набор «Сладкий сад»',
        price: 38,
        image: '🧁',
        category: 'Gifts',
        occasion: ['Birthday', 'Celebration'],
        rating: 4.8,
        reviewsCount: 73,
        description: 'Ассорти мармелада, зефира и меренг с цветочным декором.',
        seller: 'Сеть «Demo Flowers»',
        size: 'Набор',
      },
    ]
    
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts))
    return mockProducts
  },

  // Reviews
  getReviews: (productId?: string): Review[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS)
    const reviews: Review[] = data ? JSON.parse(data) : []
    return productId ? reviews.filter((r) => r.productId === productId) : reviews
  },

  addReview: (review: Review): void => {
    const reviews = storage.getReviews()
    reviews.unshift(review)
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews))
  },
}

