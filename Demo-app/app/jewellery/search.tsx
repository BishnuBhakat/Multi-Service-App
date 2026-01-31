import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import HeaderNav from "../../components/HeaderNav";
import { jewelleryItems } from "../data/jewelleryData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function JewellerySearch() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleLike } = useWishlist();

  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return jewelleryItems;

    return jewelleryItems.filter((item) => {
      const name = String(item.name ?? "").toLowerCase();
      const category = String(item.category ?? "").toLowerCase();
      const section = String(item.section ?? "").toLowerCase();
      return name.includes(s) || category.includes(s) || section.includes(s);
    });
  }, [q]);

  return (
    <View style={styles.container}>
      <HeaderNav />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Jewellery Search</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search jewellery (name / category / section)…"
          style={styles.search}
          autoFocus
        />
      </View>

      {results.length === 0 ? (
        <Text style={styles.empty}>No items found</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <Pressable
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: item.id },
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.image} />

                <View style={styles.cardBody}>
                  <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    {item.section} • {item.category}
                  </Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>

                <Pressable
                  style={styles.heartBtn}
                  onPress={() => {
                    toggleLike({ ...item, type: "jewellery" as any });
                    Toast.show({ type: "success", text1: "Added to Wishlist ❤️", position: "bottom" });
                  }}
                >
                  <Text style={styles.heartText}>❤️</Text>
                </Pressable>

                <View style={styles.cardBody}>
                  <Pressable
                    style={styles.addBtn}
                    onPress={() => {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1,
                        type: "jewellery" as any,
                      });
                      Toast.show({ type: "success", text1: "Added to Cart 🛒", position: "bottom" });
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "900" }}>ADD</Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },

  headerRow: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "900" },
  backLink: { color: "#2563eb", fontWeight: "900" },

  searchWrap: { paddingHorizontal: 12, paddingBottom: 6 },
  search: {
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },

  empty: { padding: 20, color: "#6b7280", fontWeight: "800" },

  list: { paddingHorizontal: 12, paddingBottom: 100 },
  row: { justifyContent: "space-between", marginBottom: 14 },

  cardWrapper: { width: "48%" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    position: "relative",
  },
  image: { width: "100%", height: 160, borderRadius: 12 },
  cardBody: { marginTop: 8 },
  name: { fontWeight: "800" },
  meta: { marginTop: 4, color: "#6b7280", fontWeight: "700", fontSize: 12 },
  price: { marginTop: 4, fontWeight: "900" },

  addBtn: {
    marginTop: 6,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  heartBtn: { position: "absolute", top: 10, right: 10 },
  heartText: { fontSize: 18 },
});
