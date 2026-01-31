import { View, Text, FlatList, Image, Pressable, StyleSheet, TextInput } from "react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { groceryItems } from "../data/groceryData";
import { clothingItems } from "../data/clothingData";

export default function TopDealsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const allItems = useMemo(() => {
    const g = (groceryItems ?? []).map((x) => ({ ...x, type: "grocery" as const }));
    const c = (clothingItems ?? []).map((x) => ({ ...x, type: "clothing" as const }));
    return [...g, ...c];
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;

    return allItems.filter((item) => {
      const name = String(item.name ?? "").toLowerCase();
      const category = "category" in item ? String(item.category ?? "").toLowerCase() : "";
      const section = "section" in item ? String(item.section ?? "").toLowerCase() : "";
      return name.includes(q) || category.includes(q) || section.includes(q);
    });
  }, [search, allItems]);

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Today{"'"}s Top Deals</Text>


    <View style={styles.searchWrap}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search deals (name / category / section)…"
        style={styles.search}
      />
    </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => `${item.type}:${item.id}`}
        numColumns={2}
        contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
        columnWrapperStyle={{ gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>No products found.</Text>}
        renderItem={({ item }) => (
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
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  title: { fontSize: 22, fontWeight: "900", padding: 12 },

  searchWrap: { paddingHorizontal: 12, paddingBottom: 6 },
  search: {
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },

  empty: { padding: 20, color: "#6b7280", fontWeight: "800" },

  card: { flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 10, marginBottom: 12 },
  image: { width: "100%", height: 120, borderRadius: 12, marginBottom: 8 },
  name: { fontWeight: "800" },
  price: { marginTop: 4, fontWeight: "900" },
});
