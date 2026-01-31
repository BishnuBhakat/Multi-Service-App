import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { groceryItems } from "../data/groceryData";
import { clothingItems } from "../data/clothingData";
import { jewelleryItems } from "../data/jewelleryData";
import { electronicsItems } from "../data/electronicsData";

type ItemAny =
  | ((typeof groceryItems)[number] & { type: "grocery" })
  | ((typeof clothingItems)[number] & { type: "clothing" })
  | ((typeof jewelleryItems)[number] & { type: "jewellery" })
  | ((typeof electronicsItems)[number] & { type: "electronics" });

export default function GlobalSearch() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initial = typeof params.q === "string" ? params.q : "";
  const [q, setQ] = useState(initial);

  // ✅ MERGED all items
  const allItems: ItemAny[] = useMemo(() => {
    const g = (groceryItems ?? []).map((x) => ({ ...x, type: "grocery" as const }));
    const c = (clothingItems ?? []).map((x) => ({ ...x, type: "clothing" as const }));
    const j = (jewelleryItems ?? []).map((x) => ({ ...x, type: "jewellery" as const }));
    const e = (electronicsItems ?? []).map((x) => ({ ...x, type: "electronics" as const }));

    return [...g, ...c, ...j, ...e];
  }, []);

  // ✅ SEARCH LOGIC (unchanged)
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return allItems;

    return allItems.filter((item) => {
      const name = String(item.name ?? "").toLowerCase();
      const category = "category" in item ? String(item.category ?? "").toLowerCase() : "";
      const section = "section" in item ? String(item.section ?? "").toLowerCase() : "";
      return name.includes(s) || category.includes(s) || section.includes(s);
    });
  }, [q, allItems]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchWrap}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search anything… (name / category / section)"
          style={styles.search}
          autoFocus
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.type}:${item.id}`}
        contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No results found.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: "/product/[id]",
                params: { id: item.id },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.price}>₹{item.price}</Text>

              <Text style={styles.meta} numberOfLines={1}>
                {"category" in item && item.category
                  ? `${String(item.category)} • ${item.type.toUpperCase()}`
                  : item.type.toUpperCase()}
              </Text>
            </View>
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

  row: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eef2f7",
    alignItems: "center",
  },
  img: { width: 64, height: 64, borderRadius: 12, backgroundColor: "#e5e7eb" },
  name: { fontWeight: "900", fontSize: 15 },
  price: { marginTop: 4, fontWeight: "900" },
  meta: { marginTop: 4, color: "#6b7280", fontWeight: "800", fontSize: 12 },
});
