import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAddresses, deleteAddress } from "@/src/services/addressService";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  title: { fontSize: 20, fontWeight: "900" },
  add: { color: "#2563eb", fontWeight: "900" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  safe: {
  flex: 1,
  backgroundColor: "#fff",
},


  name: { fontSize: 16, fontWeight: "900" },
  addr: { marginTop: 6, color: "#475569", fontWeight: "600" },
  phone: { marginTop: 8, fontWeight: "800" },

  actions: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
  },

  edit: { color: "#2563eb", fontWeight: "900" },
  delete: { color: "#dc2626", fontWeight: "900" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});


type Address = {
  _id: string;
  fullName: string;
  phone: string;
  house: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType?: string;
};

const SELECTED_KEY = "selected_address";

export default function Addresses() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cartType = params.cartType as string | undefined;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ADDRESSES ================= */

  const loadAddresses = useCallback(async () => {
    setLoading(true);

    const res = await getAddresses();

    if (res?.success) {
      setAddresses(res.addresses || []);
    } else {
      Alert.alert("Error", "Failed to load addresses");
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [loadAddresses])
  );

  /* ================= SELECT ADDRESS ================= */

  const selectAddress = async (address: Address) => {
    await AsyncStorage.setItem(SELECTED_KEY, JSON.stringify(address));

    // ✅ If opened from checkout → go back to same checkout
    if (cartType) {
      router.replace({
        pathname: "/checkout",
        params: { cartType },
      });
    } else {
      // ✅ If opened from Home → just go back
      router.back();
    }
  };

  /* ================= DELETE ================= */

  const onDelete = (id: string) => {
    Alert.alert("Delete Address?", "This cannot be undone", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteAddress(id);

          // If deleted address was selected → remove it
          const selectedRaw = await AsyncStorage.getItem(SELECTED_KEY);
          if (selectedRaw) {
            const selected = JSON.parse(selectedRaw);
            if (selected._id === id) {
              await AsyncStorage.removeItem(SELECTED_KEY);
            }
          }

          loadAddresses();
        },
      },
    ]);
  };

  /* ================= RENDER ================= */

  const renderItem = ({ item }: { item: Address }) => (
    <Pressable style={styles.card} onPress={() => selectAddress(item)}>
      <Text style={styles.name}>{item.fullName}</Text>

      <Text style={styles.addr}>
        {item.house}, {item.area}
        {item.landmark ? `, ${item.landmark}` : ""}
        {"\n"}
        {item.city}, {item.state} - {item.pincode}
      </Text>

      <Text style={styles.phone}>{item.phone}</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/address-form",
              params: { id: item._id },
            })
          }
        >
          <Text style={styles.edit}>Edit</Text>
        </Pressable>

        <Pressable onPress={() => onDelete(item._id)}>
          <Text style={styles.delete}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  if (loading) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.center}>
        <Text>Loading addresses...</Text>
      </View>
    </SafeAreaView>
  );
}

return (
  <SafeAreaView style={styles.safe} edges={["top"]}>
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Addresses</Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/address-form",
              params: cartType ? { cartType } : {},
            })
          }
        >
          <Text style={styles.add}>+ Add New</Text>
        </Pressable>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 14 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No saved addresses</Text>
          </View>
        }
      />
    </View>
  </SafeAreaView>
);


}