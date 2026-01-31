import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { groceryItems } from "../data/groceryData";
import { clothingItems } from "../data/clothingData";
import { jewelleryItems } from "../data/jewelleryData";
import { electronicsItems } from "../data/electronicsData";

import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const { addToCart } = useCart();
  const { toggleLike } = useWishlist();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  // ✅ combine ALL products
  const allProducts = [
    ...groceryItems,
    ...clothingItems,
    ...jewelleryItems,
    ...electronicsItems,
  ];

  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Product not found</Text>
      </View>
    );
  }

  // ✅ detect product type
  const isClothing = clothingItems.some((x) => x.id === product.id);
  const isJewellery = jewelleryItems.some((x) => x.id === product.id);
  const isElectronics = electronicsItems.some((x) => x.id === product.id);

  const type: "grocery" | "clothing" | "jewellery" | "electronics" =
    isClothing
      ? "clothing"
      : isJewellery
      ? "jewellery"
      : isElectronics
      ? "electronics"
      : "grocery";

  // ✅ back routing
  const backRoute =
    type === "clothing"
      ? "/clothingMain"
      : type === "jewellery"
      ? "/jewelleryMain"
      : type === "electronics"
      ? "/electronicsMain"
      : "/groceryMain";

  const backLabel =
    type === "clothing"
      ? "Clothing"
      : type === "jewellery"
      ? "Jewellery"
      : type === "electronics"
      ? "Electronics"
      : "Grocery";

  const categoryKey =
    "category" in product && product.category
      ? String(product.category)
      : "All";

  return (
    <View style={styles.container}>
      {/* 🔙 BACK */}
      <Pressable onPress={() => router.push(backRoute)} style={styles.backBtn}>
        <Text style={styles.backText}>← Back to {backLabel}</Text>
      </Pressable>

      {/* 🖼 IMAGE */}
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.body}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>

        {/* DESCRIPTION */}
        {"description" in product && product.description ? (
          <Text style={styles.desc}>{product.description}</Text>
        ) : (
          <Text style={styles.desc}>
            Premium quality {type} product with great comfort and style.
          </Text>
        )}

        {/* SEE MORE */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/category/[type]/[category]",
              params: { type, category: categoryKey },
            })
          }
        >
          <Text style={styles.linkText}>See more in this category →</Text>
        </Pressable>

        {/* ACTIONS */}
        <View style={styles.actionRow}>
          {/* ADD TO CART */}
          <Pressable
            style={styles.addBtn}
            onPress={() => {
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                type, // ✅ correct bucket always
              });

              Toast.show({
                type: "success",
                text1: "Added to Cart 🛒",
                text2: `${product.name} added successfully`,
                position: "bottom",
              });
            }}
          >
            <Text style={styles.addText}>ADD TO CART</Text>
          </Pressable>

          {/* WISHLIST */}
          <Pressable
            style={styles.wishlistBtn}
            onPress={() => {
              toggleLike({ ...product, type }); // ✅ preserve type
              Toast.show({
                type: "success",
                text1: "Added to Wishlist ❤️",
                text2: `${product.name} Added to Wishlist ❤️`,
                position: "bottom",
              });
            }}
          >
            <Text style={styles.wishlistText}>ADD TO WISHLIST</Text>
          </Pressable>
        </View>

        {/* GO TO CART */}
        <Pressable onPress={() => router.push("/cart")} style={styles.goCartBtn}>
          <Text style={styles.goCartText}>🛒 Go to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  backBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  backText: { color: "#2563eb", fontWeight: "700", fontSize: 15 },

  image: { width: "100%", height: 320 },
  body: { padding: 16 },

  name: { fontSize: 22, fontWeight: "800" },
  price: { fontSize: 18, fontWeight: "900", marginVertical: 6 },

  desc: { color: "#6b7280", lineHeight: 20, marginVertical: 12 },
  linkText: { color: "#2563eb", fontWeight: "900" },

  actionRow: { flexDirection: "row", gap: 12, marginTop: 18 },

  addBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  wishlistBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  wishlistText: { color: "#2563eb", fontWeight: "900", fontSize: 15 },

  goCartBtn: { marginTop: 16, alignItems: "center" },
  goCartText: { fontSize: 15, fontWeight: "800", color: "#2563eb" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 18, fontWeight: "600", color: "#6b7280" },
});
