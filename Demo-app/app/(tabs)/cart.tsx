import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Image,ScrollView } from "react-native";
import HeaderNav from "../../components/HeaderNav";
import { useCart } from "../context/CartContext";
import { useHotelCart } from "../context/HotelCartContext";
import { useRouter } from "expo-router";

type TabKey = "clothing" | "grocery" | "jewellery" | "electronics" | "hotels";

export default function CartScreen() {
  const [tab, setTab] = useState<TabKey>("clothing");
  const router = useRouter();


  const tabLabel = (name: string, count: number) =>
  count > 0 ? `${name} (${count})` : name;


  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,

    clothingTotal,
    groceryTotal,
    jewelleryTotal,
    electronicsTotal,

    clothingCount,
    groceryCount,
    jewelleryCount,
    electronicsCount,
  } = useCart();

  // Hotels (optional)
  const hotel = useHotelCart?.() as any;
  const hotelItems = hotel?.cart ?? [];
  const hotelTotal = hotel?.totalPrice ?? 0;

  // ✅ Active items
  const activeItems = useMemo(() => {
    if (tab === "clothing") return cart.clothing;
    if (tab === "grocery") return cart.grocery;
    if (tab === "jewellery") return cart.jewellery;
    if (tab === "electronics") return cart.electronics;
    return hotelItems;
  }, [tab, cart, hotelItems]);

  // ✅ Active total
  const activeTotal =
    tab === "clothing"
      ? clothingTotal
      : tab === "grocery"
      ? groceryTotal
      : tab === "jewellery"
      ? jewelleryTotal
      : tab === "electronics"
      ? electronicsTotal
      : hotelTotal;

  return (
  <View style={styles.screen}>
    <HeaderNav />

    <Text style={styles.title}>My Cart</Text>

    {/* Tabs */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabRow}
    >
      <TabButton
        label={tabLabel("Clothing", clothingCount)}
        active={tab === "clothing"}
        onPress={() => setTab("clothing")}
      />
      <TabButton
        label={tabLabel("Grocery", groceryCount)}
        active={tab === "grocery"}
        onPress={() => setTab("grocery")}
      />
      <TabButton
        label={tabLabel("Jewellery", jewelleryCount)}
        active={tab === "jewellery"}
        onPress={() => setTab("jewellery")}
      />
      <TabButton
        label={tabLabel("Electronics", electronicsCount)}
        active={tab === "electronics"}
        onPress={() => setTab("electronics")}
      />
      {/* <TabButton
        label="Hotels"
        active={tab === "hotels"}
        onPress={() => setTab("hotels")}
      /> */}
    </ScrollView>

    {/* Cart list (ONLY scrollable area) */}
      <FlatList
        data={activeItems}
        keyExtractor={(item: any) => `${tab}:${item.id}`}
        contentContainerStyle={{
           paddingHorizontal: 12,
           paddingTop: 6, 
          paddingBottom: 180, // space for footer + bottom tabs
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items in this cart.</Text>
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image || "https://picsum.photos/200" }}
              style={styles.image}
            />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.meta}>₹{item.price}</Text>

              {tab !== "hotels" && (
                <View style={styles.qtyRow}>
                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() => decreaseQty(item.id, tab)}
                  >
                    <Text style={styles.qtyText}>−</Text>
                  </Pressable>

                  <Text style={styles.qtyNum}>{item.quantity}</Text>

                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() => increaseQty(item.id, tab)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => removeFromCart(item.id, tab)}
                    style={{ marginLeft: "auto" }}
                  >
                    <Text style={styles.remove}>REMOVE</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        )}
      />

    {/* Sticky Footer */}
    {activeTotal > 0 && (
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{activeTotal}</Text>
        </View>

        <Pressable
          style={styles.placeBtn}
          onPress={() =>
            router.push({
              pathname: "/checkout",
              params: { cartType: tab },
            })
          }
        >
          <Text style={styles.placeText}>
            {tab === "hotels" ? "BOOK NOW" : "PLACE ORDER"}
          </Text>
        </Pressable>
      </View>
    )}
  </View>
);

}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
      {active && <View style={styles.activeLine} />}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },

title: {
  fontSize: 26,
  fontWeight: "900",
  paddingHorizontal: 14,
  marginTop: 10,
  marginBottom: 4,   // 🔴 reduce this
},

  tabRow: {
    paddingHorizontal: 14,
    paddingBottom: 2,
  },

  tabBtn: {
    marginRight: 20,
  },

  tabText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#64748b",
  },

  tabTextActive: {
    color: "#2563eb",
  },

  activeLine: {
    height: 3,
    backgroundColor: "#2563eb",
    marginTop: 6,
    borderRadius: 3,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
     marginTop: 4,  
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "900",
  },

  meta: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },

  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: {
    fontSize: 20,
    fontWeight: "900",
  },

  qtyNum: {
    fontSize: 16,
    fontWeight: "900",
  },

  remove: {
    color: "#ef4444",
    fontWeight: "900",
  },

  emptyText: {
    padding: 0,
    textAlign: "center",
    fontWeight: "900",
    color: "#64748b",
  },

  footer: {
    position: "absolute",
    bottom: 1, // 👈 above bottom tabs
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 8,
  },

  totalLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "700",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "900",
  },

  placeBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },

  placeText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
