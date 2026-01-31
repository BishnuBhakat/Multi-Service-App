import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import HeaderNav from "../../components/HeaderNav";

// ✅ make sure these paths match your project (data should be OUTSIDE app/)
import { groceryItems } from "../data/groceryData";
import { clothingItems } from "../data/clothingData";
import { electronicsItems } from "../data/electronicsData";
import { jewelleryItems } from "../data/jewelleryData";

type OrderItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  qty: number;
  category?: string;
};

type Order = {
  id: string;
  status: string;
  deliveredAt?: string;
  confirmedAt?: string;
  amount: number;
  items: OrderItem[];
  addressTitle?: string;
  addressLine?: string;
  customerName?: string;
  phone?: string;
};

export default function OrderDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{ order?: string }>();

  const [rating, setRating] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);

  // ✅ hooks must run unconditionally
  const order: Order | null = useMemo(() => {
    const raw = params.order;
    if (!raw || typeof raw !== "string") return null;
    try {
      return JSON.parse(raw) as Order;
    } catch {
      return null;
    }
  }, [params.order]);

  const allProducts = useMemo(() => {
    const g = (groceryItems ?? []).map((p) => ({ ...p, type: "grocery" as const }));
    const c = (clothingItems ?? []).map((p) => ({ ...p, type: "clothing" as const }));
    const e = (electronicsItems ?? []).map((p) => ({ ...p, type: "electronics" as const }));
    const j = (jewelleryItems ?? []).map((p) => ({ ...p, type: "jewellery" as const }));
    return [...g, ...c, ...e, ...j];
  }, []);

  const firstItem = order?.items?.[0];
  const deliveredAt = order?.deliveredAt ?? "Dec 22, 2025";
  const confirmedAt = order?.confirmedAt ?? deliveredAt;
  const delivered = String(order?.status ?? "").toLowerCase() === "delivered";

  const mayLike = useMemo(() => {
    const excludeId = firstItem?.id;
    const list = allProducts.filter((p: any) => p?.id && p.id !== excludeId);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [allProducts, firstItem?.id]);

  const openRatePage = () => {
    router.push({
      pathname: "/rate-product",
      params: {
        productName: firstItem?.name ?? "Product",
        productImage: firstItem?.image ?? "",
        deliveredAt,
      },
    });
  };

  const goProductDetails = (id: string) => {
    router.push({
      pathname: "/product/[id]",
      params: { id },
    });
  };

  // ✅ help actions (replace routes if you want)
  const downloadInvoice = () => {
    setHelpOpen(false);
    // If you have an invoice page, route to it:
    // router.push({ pathname: "/invoice", params: { orderId: order?.id ?? "" } });
  };

  const chatWithUs = () => {
    setHelpOpen(false);
    // If you have a support/chat page:
    // router.push("/support-chat");
  };

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
        <HeaderNav />
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: "900", fontSize: 18 }}>Order not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <HeaderNav />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.topTitle}>Order Details</Text>

        {/* ✅ Help button clickable */}
        <Pressable style={styles.helpBtn} onPress={() => setHelpOpen(true)}>
          <Text style={styles.helpText}>Help</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Product row */}
        <View style={styles.productRow}>
          <Image source={{ uri: firstItem?.image }} style={styles.productImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.productName} numberOfLines={1}>
              {firstItem?.name ?? "Product"}
            </Text>
            <Text style={styles.productMeta}>
              {firstItem?.qty ?? 1} item • ₹{firstItem?.price ?? order.amount}
            </Text>
            <Text style={styles.orderIdText}>Order #{order.id}</Text>
          </View>
        </View>

        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusTopRow}>
            <Text style={[styles.statusTitle, !delivered && { color: "#111827" }]}>
              {delivered ? `Delivered, ${deliveredAt}` : order.status}
            </Text>

            <View style={[styles.statusTickWrap, !delivered && { backgroundColor: "#64748b" }]}>
              <Text style={styles.statusTick}>{delivered ? "✓" : "!"}</Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={[styles.dotDone, !delivered && { backgroundColor: "#64748b" }]}>
              <Text style={styles.dotText}>✓</Text>
            </View>
            <View style={[styles.lineDone, !delivered && { backgroundColor: "#cbd5e1" }]} />
            <View style={[styles.dotDone, !delivered && { backgroundColor: "#cbd5e1" }]}>
              <Text style={[styles.dotText, !delivered && { color: "#64748b" }]}>
                {delivered ? "✓" : "•"}
              </Text>
            </View>
          </View>

          <View style={styles.progressLabels}>
            <View style={{ flex: 1 }}>
              <Text style={styles.progressMain}>Order Confirmed</Text>
              <Text style={styles.progressSub}>{confirmedAt}</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.progressMain}>{delivered ? "Delivered" : "In progress"}</Text>
              <Text style={styles.progressSub}>{delivered ? deliveredAt : "-"}</Text>
            </View>
          </View>

          <View style={styles.returnRow}>
            <Text style={styles.infoIcon}>i</Text>
            <Text style={styles.returnText}>
              Return policy ended on {deliveredAt}
            </Text>
          </View>

          <Pressable style={styles.updateBtn}>
            <Text style={styles.updateText}>See all updates</Text>
          </Pressable>
        </View>

        {/* Rate */}
        <Text style={styles.rateTitle}>Rate your experience</Text>

        <View style={styles.rateCard}>
          <Pressable onPress={openRatePage} style={styles.rateHeader}>
            <Text style={styles.rateIcon}>☑</Text>
            <Text style={styles.rateHeaderText}>Rate the product</Text>
          </Pressable>

          <View style={styles.starRow}>
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;
              const filled = starValue <= rating;

              return (
                <Pressable
                  key={starValue}
                  onPress={() => {
                    setRating(starValue);
                    openRatePage();
                  }}
                  style={styles.starBtn}
                >
                  <Text style={[styles.star, filled ? styles.starFilled : styles.starEmpty]}>
                    ★
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* You May Also Like (clickable -> product details) */}
        <Text style={styles.mayLikeTitle}>You May Also Like...</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.mayLikeRow}>
            {mayLike.map((p: any) => (
              <Pressable
                key={`${p.type}:${p.id}`}
                style={styles.mayLikeCard}
                onPress={() => goProductDetails(String(p.id))}
              >
                <Image source={{ uri: p.image }} style={styles.mayLikeImg} />
                <Text style={styles.mayLikeName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.mayLikeOff}>Min. 30% Off</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Delivery details */}
        <Text style={styles.sectionTitle}>Delivery details</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLine}>
            📍 <Text style={styles.bold}>{order.addressTitle ?? "Address"}</Text>{" "}
            {order.addressLine ?? ""}
          </Text>
          <Text style={[styles.infoLine, { marginTop: 10 }]}>
            👤 <Text style={styles.bold}>{order.customerName ?? "Customer"}</Text>{" "}
            {order.phone ?? ""}
          </Text>
        </View>
      </ScrollView>

      {/* ✅ Flipkart-like HELP Bottom Sheet */}
      <Modal
        transparent
        visible={helpOpen}
        animationType="fade"
        onRequestClose={() => setHelpOpen(false)}
      >
        {/* backdrop */}
        <Pressable style={styles.backdrop} onPress={() => setHelpOpen(false)} />

        {/* sheet */}
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Need help?</Text>
            <Pressable onPress={() => setHelpOpen(false)} style={styles.sheetClose}>
              <Text style={styles.sheetCloseText}>✕</Text>
            </Pressable>
          </View>

          <Pressable style={styles.sheetRow} onPress={downloadInvoice}>
            <Text style={styles.sheetIcon}>⬇️</Text>
            <Text style={styles.sheetRowText}>Download Invoice</Text>
            <Text style={styles.sheetArrow}>›</Text>
          </Pressable>

          <View style={styles.sheetDivider} />

          <Pressable style={styles.sheetRow} onPress={chatWithUs}>
            <Text style={styles.sheetIcon}>💬</Text>
            <Text style={styles.sheetRowText}>Chat with us</Text>
            <Text style={styles.sheetArrow}>›</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  backBtn: { padding: 6, marginRight: 6 },
  backText: { fontSize: 22, fontWeight: "900" },
  topTitle: { flex: 1, fontSize: 18, fontWeight: "900" },
  helpBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
  },
  helpText: { fontWeight: "900", color: "#0f172a" },

  productRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  productImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: "#e5e7eb" },
  productName: { fontWeight: "900", fontSize: 15, color: "#0f172a" },
  productMeta: { marginTop: 4, color: "#64748b", fontWeight: "700" },
  orderIdText: { marginTop: 6, color: "#64748b", fontWeight: "800" },

  statusCard: {
    marginTop: 14,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#3b82f6",
    padding: 12,
  },
  statusTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statusTitle: { fontSize: 18, fontWeight: "900", color: "#16a34a" },
  statusTickWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  statusTick: { color: "#fff", fontSize: 18, fontWeight: "900" },

  progressRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  dotDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: { color: "#fff", fontWeight: "900" },
  lineDone: { flex: 1, height: 3, backgroundColor: "#16a34a", marginHorizontal: 10, borderRadius: 2 },

  progressLabels: { flexDirection: "row", marginTop: 10 },
  progressMain: { fontWeight: "900", color: "#111827" },
  progressSub: { marginTop: 3, color: "#6b7280", fontWeight: "700", fontSize: 12 },

  returnRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  infoIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#9ca3af",
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 12,
    lineHeight: 16,
  },
  returnText: { color: "#6b7280", fontWeight: "700" },

  updateBtn: { marginTop: 12, alignItems: "center" },
  updateText: { color: "#2563eb", fontWeight: "900", fontSize: 16 },

  rateTitle: { marginTop: 18, marginHorizontal: 12, fontSize: 20, fontWeight: "900" },
  rateCard: {
    marginTop: 10,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  rateHeader: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  rateIcon: { fontSize: 16, color: "#6b7280" },
  rateHeaderText: { fontWeight: "900", color: "#111827", fontSize: 16 },

  starRow: {
    marginTop: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  starBtn: { paddingHorizontal: 6, paddingVertical: 2 },
  star: { fontSize: 28, fontWeight: "900" },
  starFilled: { color: "#facc15" },
  starEmpty: { color: "#d1d5db" },

  mayLikeTitle: {
    marginTop: 16,
    marginHorizontal: 12,
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  mayLikeRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingRight: 20,
    marginTop: 10,
  },
  mayLikeCard: {
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  mayLikeImg: { width: "100%", height: 110, backgroundColor: "#e5e7eb" },
  mayLikeName: {
    paddingHorizontal: 10,
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  mayLikeOff: {
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 12,
    color: "#16a34a",
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 10,
  },
  infoCard: {
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoLine: { color: "#0f172a", fontWeight: "700", lineHeight: 20 },
  bold: { fontWeight: "900" },

  /* ✅ HELP SHEET */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  sheetTitle: { fontSize: 18, fontWeight: "900" },
  sheetClose: { padding: 8, borderRadius: 12 },
  sheetCloseText: { fontSize: 18, fontWeight: "900" },

  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  sheetIcon: { width: 28, fontSize: 18 },
  sheetRowText: { flex: 1, fontSize: 16, fontWeight: "700", color: "#111827" },
  sheetArrow: { fontSize: 22, color: "#94a3b8", paddingLeft: 10 },

  sheetDivider: { height: 1, backgroundColor: "#e5e7eb" },
});
