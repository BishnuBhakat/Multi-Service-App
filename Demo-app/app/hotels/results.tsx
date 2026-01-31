import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import HeaderNav from "../../components/HeaderNav";
import { useHotelCart } from "../context/HotelCartContext";
import { demoHotels } from "../data/hotelsData";
export default function Results() {
  const params = useLocalSearchParams();

  const location =
    typeof params.location === "string"
      ? params.location
      : Array.isArray(params.location)
      ? params.location[0]
      : "";

  const searchLocation = location.toLowerCase().trim();
  const { addHotel } = useHotelCart();
  const router = useRouter();
  const filteredHotels = demoHotels.filter((item) =>
  item.location.toLowerCase().trim().includes(searchLocation)
);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <HeaderNav />
      <Text style={styles.title}>Stays in {location}</Text>

      {filteredHotels.length === 0 && (
        <Text style={{ padding: 20, fontSize: 16 }}>
          No hotels found in {location}
        </Text>
      )}
      <FlatList
        data={filteredHotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price} / night</Text>

            {/* ADD TO HOTEL CART */}
            {/* CHECKOUT */}
            <Pressable
              style={styles.checkoutBtn}
              onPress={() =>
                router.push({
                  pathname: "/hotels/confirm",
                  params: { hotel: JSON.stringify(item) },
                })
              }
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>CHECKOUT</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", padding: 12 },
  card: { backgroundColor: "#fff", margin: 10, borderRadius: 12, padding: 10 },
  image: { height: 150, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: "600", marginTop: 6 },
  price: { color: "#16a34a", fontWeight: "700", marginBottom: 8 },
  addBtn: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  checkoutBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
