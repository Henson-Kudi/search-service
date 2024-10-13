export const esIndexes = {
  products: 'products',
  categories: 'categories',
  brands: 'brands',
  users: 'users',
  orders: 'orders',
  cart: 'cart',
  chats: 'chats',
} as const;

export const esIndexFields = {
  products: ['name', 'description', 'category'],
  categories: ['name'],
  brands: ['name'],
  users: ['name', 'email'],
  orders: ['name', 'description', 'refNumber'],
  cart: ['name', 'description'],
  chats: ['name', 'message'],
} as const;
