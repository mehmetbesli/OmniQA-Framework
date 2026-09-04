export const APP_CONSTANTS = {
  PAGE_TITLE: 'StackDemo',
  ROUTES: {
    HOME: '/',
    SIGNIN: '/signin',
    OFFERS: '/offers',
    ORDERS: '/orders',
    FAVOURITES: '/favourites',
    CHECKOUT: '/checkout',
    CONFIRMATION: '/confirmation',
  },
  API_ENDPOINTS: {
    PRODUCTS: '/api/products',
  },
  HTTP: {
    STATUS_OK: 200,
    CONTENT_TYPE_JSON: 'application/json',
  },
  SLA: {
    MAX_RESPONSE_TIME_MS: 3000,
  },
  DB: {
    USER_STATUS_ACTIVE: 'ACTIVE',
  },
  PRODUCTS: {
    IPHONE: 'iphone',
  },
  VENDORS: {
    APPLE: 'Apple',
    SAMSUNG: 'Samsung',
    GOOGLE: 'Google',
    ONE_PLUS: 'OnePlus',
  },
  SORT_OPTIONS: {
    LOWEST_TO_HIGHEST: 'lowestprice',
    HIGHEST_TO_LOWEST: 'highestprice',
    LOWEST_PRICE: 'lowestprice',
    HIGHEST_PRICE: 'highestprice',
  },
} as const;
