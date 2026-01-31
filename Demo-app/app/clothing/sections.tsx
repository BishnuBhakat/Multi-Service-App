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
import HeaderNav from "../../components/HeaderNav";
import { clothingItems } from "../data/clothingData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";


const SECTIONS = ["All", "Men", "Women", "Kids", "Footwear"];

export default function ClothingSections() {
  const [selectedSection, setSelectedSection] = useState("All");
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
    const { toggleLike } = useWishlist();
  const router = useRouter();

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return clothingItems.filter((item) => {
      const section = String(item.section ?? "").trim().toLowerCase();
      const category = String(item.category ?? "").trim().toLowerCase();
      const name = String(item.name ?? "").trim().toLowerCase();

      const sectionMatch =
        selectedSection === "All"
          ? true
          : section === selectedSection.trim().toLowerCase();

      const searchMatch =
        q.length === 0 ? true : name.includes(q) || category.includes(q) || section.includes(q);

      return sectionMatch && searchMatch;
    });
  }, [selectedSection, search]);

  return (
    <View style={ styles.container }>
      <HeaderNav />
      <View style={styles.header}>
        <Text style={styles.title}>Clothing Store </Text>
      </View>
      <View style={styles.searchWrapper}>
      {/* 🔍 Global Search */}
      <TextInput
        placeholder="Search clothing items...."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      </View>

      {/* Tabs */}
      <View style={styles.categoryWrapper}>
        <FlatList
          data={SECTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x) => x}
          contentContainerStyle={styles.categoryRow}
          renderItem={({ item }) => {
            const active = item === selectedSection;
            return (
              <Pressable
                onPress={() => setSelectedSection(item)}
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

      {/* Products */}
      {filteredItems.length === 0 ? (
        <Text style={{ padding: 20 }}>No items found</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list }
          columnWrapperStyle={ styles.row }
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
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {item.section} • {item.category}
                  </Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>


                {/* ❤️ Wishlist */}
                <Pressable
                  style={styles.heartBtn}
                  onPress={() => {
                    toggleLike({ ...item, type: "clothing" as any }); // see note below
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
                {/* ADD TO CART */}
                       
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
                        type: "clothing",
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
  categoryRow: { paddingHorizontal: 12, gap: 15 },
  categoryPill: {
    height: 44,
    borderRadius: 90,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryActive: { backgroundColor: "#0155baff" },
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
    backgroundColor:  "#0155baff",
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