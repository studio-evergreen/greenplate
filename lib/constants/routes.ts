export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];