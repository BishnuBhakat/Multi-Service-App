import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { HotelCartProvider } from "./context/HotelCartContext";

export default function RootLayout() {
  return (
    <HotelCartProvider>
    <CartProvider>
      <WishlistProvider>
        <>
        <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="_entry" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
          <Toast />
        </>
      </WishlistProvider>
    </CartProvider>
    </HotelCartProvider>
  );
}
