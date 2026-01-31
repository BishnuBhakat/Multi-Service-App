
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { useState,useMemo } from "react";
import HeaderNav from "../components/HeaderNav";
import { groceryItems } from "./data/groceryData";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import Toast from "react-native-toast-message";

import { useRouter } from "expo-router";
const CATEGORIES = ["All", "Fruits", "Vegetables", "Dairy", "Snacks"];

export default function Grocery() {
  const router = useRouter();
    const { addToCart } = useCart();
    const { toggleLike } = useWishlist();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
     const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
    
        return groceryItems.filter((item) => {
          const matchCategory =
            selectedCategory === "All" || item.category === selectedCategory;
    
          const matchSearch =
            !q ||
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ;
    
          return matchCategory && matchSearch;
        });
      }, [selectedCategory, search]);
  
    return (
      <View style={styles.container}>
        <HeaderNav />
        <View style={styles.header}>
          <Text style={styles.title}>Grocery Store</Text>
        </View>
          {/* 🔍 SEARCH BAR */}
            <View style={styles.searchWrapper}>
                <TextInput
                    placeholder="Search for groceries...."
                    value={search}
                    onChangeText={setSearch}
                    style={styles.search}
                />
            </View>
  
        {/* Categories */}
        <View style={styles.categoryWrapper}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x) => x}
          contentContainerStyle={styles.categoryRow}
          renderItem={({ item }) => {
            const active = item === selectedCategory;
            return (
              <Pressable
                onPress={() => setSelectedCategory(item)}
                style={[styles.categoryPill, active && styles.categoryActive]}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
        </View>
  
        {/* Products grid (same fix as clothing/grocery) */}
        {filteredItems.length === 0 ? (
          <Text style={{ padding: 20 }}>No items found</Text>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
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
                     • {item.category}
                    </Text>
                    <Text style={styles.price}>₹{item.price}</Text>
                  </View>
  
                  {/* ❤️ Wishlist */}
                  <Pressable
                    style={styles.heartBtn}
                    onPress={() => {
                      toggleLike({ ...item, type: "grocery" as any }); // see note below
                      Toast.show({
                        type: "success",
                        text1: "Added to Wishlist ❤️",
                        text2: `${item.name} saved`,
                        position: "bottom",
                      });
                    }}
                  >
                    <Text style={styles.heartText}>❤️</Text>
                  </Pressable>
  
                  {/* 🛒 Add to cart */}
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
                          type: "grocery" as any, // ✅ IMPORTANT NOTE (see below)
                        });
  
                        Toast.show({
                          type: "success",
                          text1: "Added to Cart 🛒",
                          text2: `${item.name} added successfully`,
                          position: "bottom",
                        });
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "900" }}>ADD TO CART</Text>
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
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "900" },
  categoryWrapper: {
  backgroundColor: "#f9fafb",
  paddingVertical: 14,
  marginBottom: 12,          // ✅ space before cards start
},

  categoryRow: { paddingHorizontal: 12,  gap: 15 },
  categoryPill: {
    height: 44,
    borderRadius: 90,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryActive: { backgroundColor: "#2bd016ff" },
  categoryText: { fontWeight: "700", color: "#111827" },
  categoryTextActive: { color: "#fff" },

  list: { paddingHorizontal: 16, paddingBottom: 30 , paddingTop: 10},
  row: { justifyContent: "space-between", marginBottom: 14 },

  cardWrapper: { width: "48%" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    overflow: "hidden",
    
  },
  image: { width: "100%", height: 110, borderRadius: 12 },
  cardBody: { marginTop: 8 },
  name: { fontWeight: "800" },
  meta: { marginTop: 4, color: "#6b7280", fontWeight: "700", fontSize: 12 },
  price: { marginTop: 4, fontWeight: "900" },

  addBtn: {
    marginTop: 6,
    backgroundColor:"#2bd016ff"  ,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
   /* SEARCH */
  searchWrapper: {
    paddingHorizontal: 12,
    
  },
  search: {
    backgroundColor: "#ffffffff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontSize: 16,
  },

   heartBtn: {
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "#ffffffee",
  borderRadius: 20,
  width: 34,
  height: 34,
  alignItems: "center",
  justifyContent: "center",
  elevation: 3, // Android shadow
  shadowColor: "#000", // iOS shadow
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
heartText: {
  fontSize: 16,
},
});