import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { height: 60 + insets.bottom, paddingBottom: insets.bottom },
        tabBarLabelStyle: { fontSize: 12 ,fontWeight: "600"},
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="electronicsMain"
        options={{
          href: null, // ✅ hides it from the bottom tab bar
        }}
      />
<Tabs.Screen
  name="explore-more"
  options={{
    href: null, // ✅ hides it from the bottom tab bar
  }}
/>
<Tabs.Screen name="trending" options={{ href: null }} />
<Tabs.Screen name="top-deals" options={{ href: null }} />
<Tabs.Screen name="search" options={{ href: null }} />
<Tabs.Screen name="orders" options={{ href: null }} />
<Tabs.Screen name="order-details" options={{ href: null }} />
<Tabs.Screen name="rate-product" options={{ href: null }} />

      <Tabs.Screen
        name="offers"
        options={{
          title: "Offers",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

