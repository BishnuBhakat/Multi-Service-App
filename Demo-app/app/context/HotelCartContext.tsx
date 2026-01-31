import { createContext, useContext, useState } from "react";
import { CartItem } from "../../app/types/cart";

type HotelCartContextType = {
  hotelCart: CartItem[];
  addHotel: (item: CartItem) => void;
  clearHotelCart: () => void;
};

const HotelCartContext = createContext<HotelCartContextType | null>(null);

export function HotelCartProvider({ children }: any) {
  const [hotelCart, setHotelCart] = useState<CartItem[]>([]);

  const addHotel = (item: CartItem) => {
    setHotelCart([item]);
  }; 

  const clearHotelCart = () => setHotelCart([]);

  return (
    <HotelCartContext.Provider value={{ hotelCart, addHotel, clearHotelCart }}>
      {children}
    </HotelCartContext.Provider>
  );
}

export const useHotelCart = () => useContext(HotelCartContext)!;
