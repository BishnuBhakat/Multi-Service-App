import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import HeaderNav from "../../components/HeaderNav";
import { groceryItems } from "../data/groceryData";
import { useCart } from "../context/CartContext";

export default function GrocerySearch() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const search = typeof q === "string" ? q : "";

  const filteredItems =
    search.trim() === ""
      ? []
      : groceryItems.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <View style={{ flex: 1 }}>
      <HeaderNav />

      {search === "" && (
        <Text style={{ padding: 16 }}>Start typing to search</Text>
      )}

      {filteredItems.length === 0 && search !== "" && (
        <Text style={{ padding: 16 }}>No items found</Text>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
              <Text>{item.name}</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                  type: "grocery",
                })
              }
            >
              <Text style={{ color: "green" }}>ADD</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 8,
    padding: 10,
    borderRadius: 8,
  },
  image: {
    height: 100,
    borderRadius: 8,
  },
});
