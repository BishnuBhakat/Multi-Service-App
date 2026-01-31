import { View, Text, FlatList, Image, Pressable, StyleSheet } from "react-native";
import HeaderNav from "../../components/HeaderNav";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";

export default function WishlistScreen() {
  const { wishlist, toggleLike } = useWishlist();
  const { addToCart } = useCart();

  return (
    <View style={styles.container}>
      <HeaderNav />
      <Text style={styles.title}>My Wishlist</Text>

      {wishlist.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>💔 Your wishlist is empty</Text>
          <Text style={styles.emptySub}>Save items you like here</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.price}>₹{item.price}</Text>

                <View style={styles.actions}>
                  {/* MOVE TO CART */}
                  <Pressable
                    style={styles.cartBtn}
                    onPress={() => {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1,
                        type: item.type ?? (item.category === "clothing" ? "clothing" : "grocery"),
                      });

                      toggleLike(item);

                      Toast.show({
                        type: "success",
                        text1: "Moved to Cart 🛒",
                      });
                    }}
                  >
                    <Text style={styles.cartText}>MOVE TO CART</Text>
                  </Pressable>

                  {/* REMOVE */}
                  <Pressable
                    onPress={() => toggleLike(item)}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeText}>REMOVE</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "900", padding: 12 },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { fontSize: 18, fontWeight: "800" },
  emptySub: { marginTop: 6, color: "#6b7280" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
  },
  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "900",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  cartBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  cartText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },
  removeBtn: {
    marginLeft: 12,
  },
  removeText: {
    color: "#ef4444",
    fontWeight: "900",
  },
});