import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

// CONTEXT PROVIDERS
import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { HotelCartProvider } from "@/app/context/HotelCartContext";

type InitialRoute =
  | "(tabs)"
  | "auth/intro"
  | "auth/signup"
  | "auth/login"
  | null;

export default function Layout() {
  const [initialRoute, setInitialRoute] = useState<InitialRoute>(null);

  useEffect(() => {
    const decideInitialRoute = async () => {
      const token = await AsyncStorage.getItem("token");
      const seenIntro = await AsyncStorage.getItem("seenIntro");
      const userCreated = await AsyncStorage.getItem("userCreated");

      // ✅ 1. User already logged in
      if (token) {
        setInitialRoute("(tabs)");
        return;
      }

      // ✅ 2. First time app open
      if (!seenIntro) {
        setInitialRoute("auth/intro");
        return;
      }

      // ✅ 3. Intro seen but user not created
      if (!userCreated) {
        setInitialRoute("auth/signup");
        return;
      }

      // ✅ 4. User exists but not logged in
      setInitialRoute("auth/login");
    };

    decideInitialRoute();
  }, []);

  // ⛔ Avoid black screen
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
                <Stack.Screen name="auth/intro" />
                <Stack.Screen name="auth/signup" />
                <Stack.Screen name="auth/login" />

                {/* MAIN APP */}
                <Stack.Screen name="(tabs)" />
              </Stack>

              {/* TOAST ROOT */}
              <Toast />
            </>
          </WishlistProvider>
        </CartProvider>
      </HotelCartProvider>
    </AuthProvider>
  );
}