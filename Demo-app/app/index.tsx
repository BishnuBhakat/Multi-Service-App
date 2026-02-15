import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StartScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const userCreated = await AsyncStorage.getItem("userCreated");

      // Already logged in
      if (token) {
        router.replace("/(tabs)");
        return;
      }

      // First time user (no account yet)
      if (!userCreated) {
        router.replace("/auth/phone");
        return;
      }

      // Existing user but logged out
      router.replace("/auth/phone");
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
