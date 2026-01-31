import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Payment = "COD" | "UPI" | "CARD";

export default function OrderSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    cartType?: string;
    section?: string;
    amount?: string;
    payment?: Payment | string;
    orderId?: string;
  }>();

  // ✅ accept either "cartType" or "section" param
  const section = (params.cartType || params.section || "shopping").toString();
  const payment = (params.payment || "COD").toString();
  const amount = (params.amount || "").toString();

  // ✅ generate a simple order id if not passed
  const orderId = useMemo(() => {
    if (params.orderId) return String(params.orderId);
    const suffix = Math.floor(100000 + Math.random() * 900000);
    return `OD${suffix}`;
  }, [params.orderId]);

  // ✅ countdown + auto redirect
  const [secLeft, setSecLeft] = useState(10);

  useEffect(() => {
    const t1 = setInterval(() => {
      setSecLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    const t2 = setTimeout(() => {
      router.replace("/");
    }, 10000);

    return () => {
      clearInterval(t1);
      clearTimeout(t2);
    };
  }, []);

  // ✅ small animation
  const scale = useState(new Animated.Value(0.6))[0];
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.screen}>
      {/* Header like Flipkart */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Status</Text>
      </View>

      <View style={styles.container}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale }], opacity },
          ]}
        >
          {/* Big tick */}
          <View style={styles.tickWrap}>
            <Text style={styles.tick}>✓</Text>
          </View>

          <Text style={styles.title}>Order placed successfully</Text>
          <Text style={styles.subtitle}>
            Thanks for shopping with us! Your order is confirmed.
          </Text>

          {/* Summary */}
          <View style={styles.summary}>
            <Row label="Order ID" value={orderId} mono />
            <Row label="Section" value={section.toUpperCase()} />
            {amount ? <Row label="Amount" value={`₹${amount}`} /> : null}
            <Row label="Payment" value={payment.toUpperCase()} />
          </View>

          {/* Buttons */}
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.primaryText}>CONTINUE SHOPPING</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.replace("/cart")}
          >
            <Text style={styles.secondaryText}>GO TO CART</Text>
          </Pressable>

          <Text style={styles.autoText}>
            Redirecting to Home in {secLeft}s…
          </Text>
        </Animated.View>

        {/* Bottom hint like Flipkart */}
        <Text style={styles.helpText}>
          Need help? Check your order details in Account → Orders.
        </Text>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, mono && styles.mono]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const FLIPKART_BLUE = "#2874F0";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9" },

  header: {
    backgroundColor: FLIPKART_BLUE,
    paddingTop: Platform.OS === "ios" ? 54 : 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },

  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  tickWrap: {
    alignSelf: "center",
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  tick: { color: "#fff", fontSize: 44, fontWeight: "900" },

  title: { fontSize: 20, fontWeight: "900", textAlign: "center" },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },

  summary: {
    marginTop: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eef2f7",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 6,
  },
  rowLabel: { color: "#64748b", fontWeight: "800" },
  rowValue: { color: "#0f172a", fontWeight: "900", flexShrink: 1 },
  mono: { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: FLIPKART_BLUE,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "900" },

  secondaryBtn: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryText: { color: "#0f172a", fontWeight: "900" },

  autoText: {
    marginTop: 12,
    textAlign: "center",
    color: "#64748b",
    fontWeight: "800",
    fontSize: 12,
  },

  helpText: {
    marginTop: 14,
    textAlign: "center",
    color: "#64748b",
    fontWeight: "700",
    fontSize: 12,
  },
});