import { View, Text, StyleSheet } from "react-native";
import HeaderNav from "../../components/HeaderNav";

export default function BookingSuccess() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <HeaderNav />
      <Text style={styles.title}>🎉 Booking Confirmed</Text>
      <Text>Your hotel has been booked successfully!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
});
