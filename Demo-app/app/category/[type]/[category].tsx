import { View, Text, FlatList, Image, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { groceryItems } from "../../data/groceryData";
import { clothingItems } from "../../data/clothingData";
import { jewelleryItems } from "../../data/jewelleryData";
import { electronicsItems } from "../../data/electronicsData";

export default function CategoryPage() {
  const router = useRouter();

  const { type, category } = useLocalSearchParams<{
    type: "grocery" | "clothing" | "jewellery" | "electronics";
    category: string;
  }>();

  // ✅ pick correct source (NO logic change, just merged)
  const source =
    type === "electronics"
      ? electronicsItems
      : type === "jewellery"
      ? jewelleryItems
      : type === "clothing"
      ? clothingItems
      : groceryItems;

  // ✅ filter by category (handles "All" safely)
  const items =
    category === "All"
      ? source
      : source.filter(
          (i) => String(i.category) === String(category)
        );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <Text style={{ padding: 20, fontWeight: "700" }}>
            No products found.
          </Text>
        }
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
            <Text style={styles.name}>{item.name}</Text>
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

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  image: { width: "100%", height: 140, borderRadius: 12 },
  name: { fontWeight: "800", marginTop: 6 },
  price: { fontWeight: "900", marginTop: 4 },
});
