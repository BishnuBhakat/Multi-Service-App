import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import HeaderNav from "../../components/HeaderNav";
import { clothingItems } from "../data/clothingData";
import { useCart } from "../context/CartContext";

export default function ClothingSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { addToCart } = useCart();

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clothingItems; // show all when empty (you can change this)

    return clothingItems.filter((item) => {
      const name = String(item.name ?? "").toLowerCase();
      const category = String(item.category ?? "").toLowerCase();
      const section = String(item.section ?? "").toLowerCase();

      // ✅ search by name (and also category/section so it feels smart)
      return (
        name.includes(q) ||
        category.includes(q) ||
        section.includes(q)
      );
    });
  }, [search]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <HeaderNav />

      <Text style={styles.title}>Search Clothing</Text>

      <TextInput
        placeholder="Search clothing items..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {filteredItems.length === 0 ? (
        <Text style={{ padding: 20 }}>No items found</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: item.id },
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>

                {/* show where it belongs */}
                <Text style={styles.meta}>
                  {item.section} • {item.category}
                </Text>

                <Text style={styles.price}>₹{item.price}</Text>
              </Pressable>

              <Pressable
                style={styles.addBtn}
                onPress={() =>
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1,
                    type: "clothing",
                  })
                }
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>ADD</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", padding: 12 },
  search: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 12,
    marginBottom: 6,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 6,
    flex: 1,
  },
  image: { height: 120, borderRadius: 8 },
  name: { fontSize: 14, fontWeight: "600", marginTop: 6 },
  meta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  price: { fontWeight: "bold", marginVertical: 4 },
  addBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
  },
});