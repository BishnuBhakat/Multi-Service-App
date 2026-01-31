import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../../app/context/CartContext";
import { useWishlist } from "../../app/context/WishlistContext";

export default function ProductCard({ item }: any) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleLike } = useWishlist();

  const handleAdd = () => {
    addToCart(item);
    Alert.alert("Added to Cart 🛒", `${item.name} added successfully`);
  };

  const handleLike = () => {
    toggleLike(item);
    Alert.alert("Liked ❤️", `${item.name} added to wishlist`);
  };

  return (
    <View style={styles.card}>
      {/* Discount Badge */}
      <View style={styles.discount}>
        <Text style={styles.discountText}>↓{item.discount}%</Text>
      </View>

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

        <View style={styles.row}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
        </View>

        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={{ color: "#fff" }}>+</Text>
        </Pressable>

        <Pressable onPress={handleLike}>
          <Text style={{ fontSize: 18 }}>❤️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  image: { height: 100, borderRadius: 8 },
  name: { fontSize: 14, fontWeight: "600", marginTop: 6 },
  price: { fontWeight: "bold" },
  oldPrice: { textDecorationLine: "line-through", color: "#888", marginLeft: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 12, marginTop: 4 },
  discount: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "green",
    paddingHorizontal: 6,
    borderRadius: 6,
    zIndex: 10,
  },
  discountText: { color: "#fff", fontSize: 12 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  addBtn: {
    backgroundColor: "#8b5cf6",
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
