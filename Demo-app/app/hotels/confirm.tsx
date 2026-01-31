import { View, Text, Image, Pressable, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import HeaderNav from "../../components/HeaderNav";

export default function ConfirmBooking() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const hotel =
    typeof params.hotel === "string"
      ? JSON.parse(params.hotel)
      : null;

  if (!hotel) {
    return <Text style={{ padding: 20 }}>Hotel not found</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderNav />

      <View style={styles.card}>
        <Image source={{ uri: hotel.image }} style={styles.image} />

        <Text style={styles.name}>{hotel.name}</Text>
        <Text style={styles.desc}>{hotel.desc}</Text>
        <Text style={styles.price}>₹{hotel.price} / night</Text>

        <Pressable
          style={styles.confirmBtn}
          onPress={() => {
            Alert.alert("🎉 Booking Confirmed", `${hotel.name} booked successfully`);
            router.replace("/hotels/success");
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            CONFIRM BOOKING
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 12,
  },
  image: {
    height: 180,
    borderRadius: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  desc: {
    color: "#6b7280",
    marginVertical: 8,
  },
  price: {
    fontSize: 16,
    color: "#16a34a",
    fontWeight: "700",
  },
  confirmBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
});
