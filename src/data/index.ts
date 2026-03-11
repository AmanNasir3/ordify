import type { Service, NavLink, SliderImage } from '../types';

export const quickServices = [
  { id: '1', name: 'Housekeeping', slug: 'housekeeping' },
  { id: '2', name: 'Room Service', slug: 'room-service' },
  { id: '3', name: 'Nearby Attractions', slug: 'nearby-attractions' },
  { id: '4', name: 'Restaurant & Cafe', slug: 'restaurant-cafe' },
];

export const services: Service[] = [
  {
    id: '1',
    name: 'Room Service',
    slug: 'room-service',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=450&fit=crop',
    icon: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
    rating: null,
    reviewCount: 0,
  },
  {
    id: '2',
    name: 'The Wave',
    slug: 'the-wave',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=450&fit=crop',
    icon: 'https://cdn-icons-png.flaticon.com/512/2942/2942037.png',
    rating: null,
    reviewCount: 0,
  },
  {
    id: '3',
    name: 'Housekeeping',
    slug: 'housekeeping',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=450&fit=crop',
    icon: 'https://cdn-icons-png.flaticon.com/512/2838/2838694.png',
    rating: null,
    reviewCount: 0,
  },
  {
    id: '4',
    name: 'Nearby Attractions',
    slug: 'nearby-attractions',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=450&fit=crop',
    icon: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    rating: null,
    reviewCount: 0,
  },
];

export const sliderImages: SliderImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop',
    alt: 'Hotel exterior view',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=400&fit=crop',
    alt: 'Hotel pool area',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop',
    alt: 'Hotel lobby',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=400&fit=crop',
    alt: 'Hotel room',
  },
];

export const navLinks: NavLink[] = [
  { id: '1', label: 'Home', icon: 'home', href: '/' },
  { id: '2', label: 'Reviews', icon: 'star', href: '/reviews' },
  { id: '3', label: 'My Orders', icon: 'orders', href: '/orders' },
  { id: '4', label: 'My Requests', icon: 'requests', href: '/requests' },
];
