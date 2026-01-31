import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import HeaderNav from "../../../components/HeaderNav";
import { hotels } from "./../../data/hotelsData";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function HotelsCategory() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleLike } = useWishlist();

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <HeaderNav />
      <Text style={styles.title}>{category}</Text>

      <FlatList
        data={hotels}
        numColumns={2}
        keyExtractor={(item) => item.id}
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
              <Text style={styles.price}>₹{item.price}/night</Text>
            </Pressable>

            <View style={styles.actions}>
              <Pressable
                style={styles.addBtn}
                onPress={() => {
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1,
                    type: "hotel",
                  });
                  Alert.alert("Added to Booking Cart 🏨", item.name);
                }}
              >
                <Text style={{ color: "#fff" }}>BOOK</Text>
              </Pressable>

              <Pressable
                onPress={() => toggleLike(item)}
              >
                <Text>❤️</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", padding: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 6,
    flex: 1,
  },
  image: { height: 110, borderRadius: 8 },
  name: { fontSize: 14, fontWeight: "600", marginTop: 6 },
  price: { fontWeight: "bold", marginVertical: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addBtn: {
    backgroundColor: "#f97316",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
});
