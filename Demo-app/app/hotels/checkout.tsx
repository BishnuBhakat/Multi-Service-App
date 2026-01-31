import { View, Text, Image, Pressable } from "react-native";
import { useHotelCart } from "../context/HotelCartContext";

export default function Checkout() {
  const { hotelCart } = useHotelCart();
  const hotel = hotelCart[0];

  if (!hotel) return <Text style={{ padding: 20 }}>No hotel selected</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Image source={{ uri: hotel.image }} style={{ height: 200, borderRadius: 12 }} />
      <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 10 }}>{hotel.name}</Text>
      <Text style={{ color: "green", fontSize: 18 }}>₹{hotel.price} / night</Text>

      <Pressable style={{ marginTop: 20, backgroundColor: "#2563eb", padding: 14, borderRadius: 10 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>CONFIRM BOOKING</Text>
      </Pressable>
    </View>
  );
}
