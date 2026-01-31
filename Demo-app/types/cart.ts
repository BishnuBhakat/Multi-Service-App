// types/cart.ts

export type CartItem = {
  id: string;           // product / hotel id
  name: string;         // item name
  price: number;        // price per unit / per night
  image?: string;       // optional image
  quantity: number;     // quantity (or nights for hotel)
  category?: string;    // grocery / clothing / hotel category
  type?: "grocery" | "clothing" | "hotel"; // useful later
};
