export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  type: "grocery" | "clothing" | "hotel";
};
