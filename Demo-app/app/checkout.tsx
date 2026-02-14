import { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderNav from "../components/HeaderNav";
import { useCart } from "./context/CartContext";
import Toast from "react-native-toast-message";

type CartType = "clothing" | "grocery" | "electronics" | "jewellery";

type Address = {
  _id: string;
  fullName: string;
  phone: string;
  house: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
};

const SELECTED_KEY = "selected_address";

export default function Checkout() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const params = useLocalSearchParams();

  const cartTypeParam = params.cartType;
  const cartType: CartType =
    cartTypeParam === "clothing" ||
    cartTypeParam === "grocery" ||
    cartTypeParam === "electronics" ||
    cartTypeParam === "jewellery"
      ? cartTypeParam
      : "clothing";

  const items = useMemo(() => {
    if (cartType === "clothing") return cart.clothing;
    if (cartType === "grocery") return cart.grocery;
    if (cartType === "electronics") return cart.electronics;
    if (cartType === "jewellery") return cart.jewellery;
    return [];
  }, [cartType, cart]);

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const [address, setAddress] = useState<Address | null>(null);
  const [payment, setPayment] = useState<"COD" | "UPI" | "CARD">("COD");

  useEffect(() => {
    const loadAddress = async () => {
      const saved = await AsyncStorage.getItem(SELECTED_KEY);
      if (saved) setAddress(JSON.parse(saved));
    };
    loadAddress();
  }, []);

  const placeOrder = () => {
    if (items.length === 0)
      return Alert.alert("Cart", `No items in ${cartType} cart.`);

    if (!address)
      return Alert.alert("Address", "Please select a delivery address.");

    if (payment !== "COD") {
      Toast.show({
        type: "success",
        text1: "Payment Successful",
        position: "bottom",
      });
    }

    clearCart(cartType);

    router.replace({
      pathname: "/order-success",
      params: {
        cartType,
        amount: String(totalPrice),
        payment,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <HeaderNav />

      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 30 }}>
        <Text style={styles.pageTitle}>
          Checkout - {cartType.toUpperCase()}
        </Text>

        <Text style={styles.title}>Deliver to</Text>

        {address ? (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.name}>{address.fullName}</Text>

              {/* ✅ FIXED CHANGE BUTTON */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/addresses",
                    params: { cartType },
                  })
                }
              >
                <Text style={styles.change}>Change</Text>
              </Pressable>
            </View>

            <Text style={styles.addr}>
              {address.house}, {address.area}
              {address.landmark ? `, ${address.landmark}` : ""}
              {"\n"}
              {address.city}, {address.state} - {address.pincode}
            </Text>

            <Text style={styles.phone}>{address.phone}</Text>
          </View>
        ) : (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/addresses",
                params: { cartType },
              })
            }
          >
            <Text style={{ color: "#2563eb", fontWeight: "900" }}>
              Select Address
            </Text>
          </Pressable>
        )}

        <Text style={styles.title}>Payment</Text>

        <View style={styles.card}>
          {(["COD", "UPI", "CARD"] as const).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPayment(p)}
              style={[
                styles.payOption,
                payment === p && styles.payActive,
              ]}
            >
              <Text
                style={[
                  styles.payText,
                  payment === p && styles.payTextActive,
                ]}
              >
                {p === "COD" ? "Cash on Delivery" : p}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.summary}>
          <Text>Total Amount</Text>
          <Text style={{ fontWeight: "900" }}>₹{totalPrice}</Text>
        </View>

        <Pressable style={styles.placeBtn} onPress={placeOrder}>
          <Text style={styles.placeText}>
            PLACE ORDER ({cartType.toUpperCase()})
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 20, fontWeight: "900", marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "900", marginVertical: 8 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: { fontWeight: "900", fontSize: 16 },
  addr: { marginTop: 6, color: "#475569", fontWeight: "600" },
  phone: { marginTop: 6, fontWeight: "800" },

  change: { color: "#2563eb", fontWeight: "900" },

  payOption: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    marginBottom: 8,
  },

  payActive: { backgroundColor: "#2563eb" },
  payText: { fontWeight: "800" },
  payTextActive: { color: "#fff" },

  summary: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  placeBtn: {
    backgroundColor: "#fb923c",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },

  placeText: { color: "#fff", fontWeight: "900" },
});
