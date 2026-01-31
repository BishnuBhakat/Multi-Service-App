import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import HeaderNav from "../components/HeaderNav";

export default function Hotels() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("16 Jan 2026");
  const [checkOut, setCheckOut] = useState("17 Jan 2026");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);

  return (
    <View style={styles.container}>
      <HeaderNav />
      <Text style={styles.heading}>Find your perfect stay</Text>

      <TextInput
        placeholder="Enter destination"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <View style={styles.row}>
        <TextInput style={styles.inputSmall} value={checkIn} />
        <TextInput style={styles.inputSmall} value={checkOut} />
      </View>

      <View style={styles.row}>
        <TextInput style={styles.inputSmall} value={`${guests} Adult`} />
        <TextInput style={styles.inputSmall} value={`${rooms} Room`} />
      </View>

      <Pressable
        style={styles.searchBtn}
        onPress={() =>
          router.push({
            pathname: "/hotels/results",
            params: { location, checkIn, checkOut, guests, rooms },
          })
        }
      >
        <Text style={styles.searchText}>SEARCH</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 10 ,padding:10},
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    marginVertical: 6,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputSmall: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    width: "48%",
    marginVertical: 6,
  },
  searchBtn: {
    backgroundColor: "#ff5e00ff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 12,
  },
  searchText: { color: "#fff", textAlign: "center", fontSize: 18 },
});
