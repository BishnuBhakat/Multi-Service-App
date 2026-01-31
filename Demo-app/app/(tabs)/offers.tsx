import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { OFFERS_LIST } from "../data/offersPageData";

export default function OffersPage() {
  const router = useRouter();

  const renderItem = ({ item }: any) => {
    const discount = Math.round(
      ((item.originalPrice - item.offerPrice) / item.originalPrice) * 100
    );

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/product/[id]",
            params: { id: item.id },
          })
        }
      >
        {/* Product Image */}
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* Product Info */}
        <Text numberOfLines={2} style={styles.name}>
          {item.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.offerPrice}>₹{item.offerPrice}</Text>
          <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
        </View>

        <Text style={styles.discount}>{discount}% OFF</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Offers</Text>

      <FlatList
        data={OFFERS_LIST}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 12,
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    width: "48%",
  },

  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  offerPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#16a34a",
  },

  originalPrice: {
    fontSize: 13,
    color: "#6b7280",
    textDecorationLine: "line-through",
  },

  discount: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "800",
    color: "#16a34a",
  },
});