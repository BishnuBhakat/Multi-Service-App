import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import HeaderNav from "../../components/HeaderNav";
import { DEMO_ORDERS } from "../data/demoOrdersData";
export default function Orderss() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <HeaderNav />
      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={DEMO_ORDERS}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/order-details",
                params: { order: JSON.stringify(item) as string },// ✅ pass only id (clean)
              })
            }
          >
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.meta}>
              {item.status} • {item.date}
            </Text>
            <Text style={styles.amount}>₹{item.amount}</Text>
            <Text style={styles.tapHint}>Tap to view details →</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  title: { fontSize: 22, fontWeight: "900", padding: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  orderId: { fontWeight: "900", fontSize: 16 },
  meta: { marginTop: 4, color: "#64748b", fontWeight: "700" },
  amount: { marginTop: 8, fontWeight: "900", fontSize: 16 },
  tapHint: { marginTop: 8, color: "#2874F0", fontWeight: "900" },
});