export interface Product {
  id: string;
  name: string;
  subName: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  badge?: string;
  tags: string[];
  size: string;
  ageLimit: string;
  colorHex: string;
  bgColor: string;
  scent: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SoundOption {
  id: string;
  name: string;
  subName: string;
  icon: string;
  frequency: number; // For synth sounds
  waveType: OscillatorType;
  description: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  location: string;
}
