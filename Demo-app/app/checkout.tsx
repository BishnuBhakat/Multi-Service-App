import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import HeaderNav from "../components/HeaderNav";
import { useCart } from "./context/CartContext";
import Toast from "react-native-toast-message";

type CartType = "clothing" | "grocery" | "electronics" | "jewellery";

export default function Checkout() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const params = useLocalSearchParams();

  /* ✅ SAFE cartType detection */
  const cartTypeParam = params.cartType;
  const cartType: CartType =
    cartTypeParam === "clothing" ||
    cartTypeParam === "grocery" ||
    cartTypeParam === "electronics" ||
    cartTypeParam === "jewellery"
      ? cartTypeParam
      : "clothing";

  /* ✅ PICK CORRECT CART ITEMS */
  const items = useMemo(() => {
    if (cartType === "clothing") return cart.clothing;
    if (cartType === "grocery") return cart.grocery;
    if (cartType === "electronics") return cart.electronics;
    if (cartType === "jewellery") return cart.jewellery;
    return [];
  }, [cartType, cart]);

  /* ✅ TOTAL */
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  /* FORM STATE */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [payment, setPayment] = useState<"COD" | "UPI" | "CARD">("COD");

  /* ✅ PLACE ORDER */
  const placeOrder = () => {
    if (items.length === 0) {
      return Alert.alert("Cart", `No items in ${cartType} cart.`);
    }

    if (!name.trim()) return Alert.alert("Missing", "Enter full name");
    if (phone.trim().length < 10) return Alert.alert("Missing", "Enter phone");
    if (pincode.trim().length < 6) return Alert.alert("Missing", "Enter pincode");
    if (!address.trim()) return Alert.alert("Missing", "Enter address");
    if (!city.trim()) return Alert.alert("Missing", "Enter city");
    if (!stateName.trim()) return Alert.alert("Missing", "Enter state");

    // ✅ UPI / CARD → toast only
    if (payment !== "COD") {
      Toast.show({
        type: "success",
        text1: "Payment Successful",
        position: "bottom",
      });
    }

    // ✅ clear correct cart
    clearCart(cartType);

    // ✅ go to success page
    router.replace({
      pathname: "/order-success",
      params: { cartType, amount: String(totalPrice), payment },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <HeaderNav />

      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 30 }}>
        <Text style={styles.pageTitle}>
          Checkout - {cartType.toUpperCase()}
        </Text>

        <Text style={styles.title}>Delivery Address</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                value={pincode}
                onChangeText={setPincode}
                style={styles.input}
                keyboardType="number-pad"
              />
            </View>

            <View style={{ width: 10 }} />

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>City</Text>
              <TextInput value={city} onChangeText={setCity} style={styles.input} />
            </View>
          </View>

          <Text style={styles.label}>State</Text>
          <TextInput
            value={stateName}
            onChangeText={setStateName}
            style={styles.input}
          />

          <Text style={styles.label}>Full Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={[styles.input, { height: 90 }]}
            multiline
          />
        </View>

        <Text style={styles.title}>Payment</Text>
        <View style={styles.card}>
          {(["COD", "UPI", "CARD"] as const).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPayment(p)}
              style={[styles.payOption, payment === p && styles.payActive]}
            >
              <Text style={[styles.payText, payment === p && styles.payTextActive]}>
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
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 12, marginBottom: 10 },
  label: { fontSize: 12, fontWeight: "800", marginTop: 10 },
  input: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 10 },
  row: { flexDirection: "row" },

  payOption: { padding: 12, borderRadius: 12, backgroundColor: "#f3f4f6", marginBottom: 8 },
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