import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

// CONTEXT PROVIDERS
import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { HotelCartProvider } from "@/src/context/HotelCartContext";

type InitialRoute = "(tabs)" | "auth/phone" | null;

export default function Layout() {
  const [initialRoute, setInitialRoute] = useState<InitialRoute>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        // If user already logged in → go home
        if (token) {
          setInitialRoute("(tabs)");
        } 
        // Otherwise → OTP phone screen
        else {
          setInitialRoute("auth/phone");
        }
      } catch (e) {
        setInitialRoute("auth/phone");
      }
    };

    checkAuth();
  }, []);

  // Prevent black screen flicker
  if (!initialRoute) return null;

  return (
    <AuthProvider>
      <HotelCartProvider>
        <CartProvider>
          <WishlistProvider>
            <>
              <Stack
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false }}
              >
                {/* AUTH FLOW */}
                <Stack.Screen name="auth/phone" />
                <Stack.Screen name="auth/profile" />

                {/* MAIN APP */}
                <Stack.Screen name="(tabs)" />
              </Stack>

              {/* TOAST */}
              <Toast />
            </>
          </WishlistProvider>
        </CartProvider>
      </HotelCartProvider>
    </AuthProvider>
  );
}
