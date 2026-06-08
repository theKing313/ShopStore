export enum AlertType {
  Info = "info",
  Success = "success",
  Error = "error",
  Warning = "warning",
}
export type user = {
  username: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  birthDate?: string;
  birthday?: string;
  id?: string;
};
export type Alert = {
  action?: "cart" | "wishlist";
  type: AlertType;
  message: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  url: string;
};

export type Brand = {
  id: string;
  name?: string;
  url?: string;
  description?: string;
};

export type Option = {
  [key: string]: string;
};

export type Product = {
  id: string;
  category: {
    name: string;
    id: string;
    url: string;
  };
  sizes?: string[];
  materials?: string[];
  colors?: string[];
  description: string;

  discountPercent?: number;
  discountedPrice?: number;
  discount?: {
    percent: number;
    discountedPrice: number;
  } | null;
  image: string;
  colorImages?: Record<string, string>;
  images?: string[];
  name: string;
  brand: {
    name: string;
    id: string;
  };
  price: number;
  weight: number;
  isLocked?: boolean;
  gender: {
    id: string;
    name: string;
    url: string;
  };
};

export type Error = {
  isError: boolean;
  message: string;
};

export type CartItem = {
  productId: Product["id"];
  name: Product["name"];
  price: Product["price"];
  quantity: number;
  totalPrice: number;
  weight: Product["weight"];
  totalWeight: number;
  profit?: number;
  discount?: number;
  discountedPrice?: number;
  selectedSize?: string;
  selectedMaterial?: string;
  selectedColor?: string;
  colorImages?: Record<string, string>;
};

export type Review = {
  id: number;
  productId: Product["id"];
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type OrderItem = CartItem & {
  id: number;
  orderId: string;
};

export type ProductCartItem = CartItem & {
  name: Product["name"];
  categoryUrl: Product["category"]["url"];
  image: Product["image"];
  isWished: boolean;
};

export type Order = {
  id: string;
  orderNumber: number;
  timestamp: number;
  userName: string;
  userPhone: string;
  userAddress: string;
  paymentType: string;
  orderType: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolder?: string;
  cart: OrderItem[];
  totalPrice: number;
  totalWeight: number;
  totalDiscount: number;
  totalQuantity: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  metadata?: any;
  paymentUrl?: string;
};
