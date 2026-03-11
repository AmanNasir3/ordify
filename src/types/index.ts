export interface Service {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon?: string;
  rating: number | null;
  reviewCount: number;
}

export interface NavLink {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface SliderImage {
  id: string;
  src: string;
  alt: string;
}
