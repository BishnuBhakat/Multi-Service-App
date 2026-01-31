import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

type AnyAddress = {
  id?: string | number;

  // New fields (from your address-form.tsx)
  fullName?: string;
  phone?: string;
  house?: string;
  area?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  label?: "home" | "work" | "other";

  // Old fields (if you had older schema)
  name?: string;
  addressLine?: string;
};

const ADDR_KEY = "saved_addresses_v1";

// ✅ IMPORTANT: set this correctly
// If address-form file is at: app/address-form.tsx  -> "/address-form"
// If address-form file is at: app/(tabs)/address-form.tsx -> "/(tabs)/address-form"
const ADDRESS_FORM_ROUTE = "/address-form"; // change if needed

export default function Addresses() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AnyAddress[]>([]);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(ADDR_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setAddresses(Array.isArray(parsed) ? parsed : []);
    } catch {
      setAddresses([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const save = useCallback(async (next: AnyAddress[]) => {
    setAddresses(next);
    await AsyncStorage.setItem(ADDR_KEY, JSON.stringify(next));
  }, []);

  const iconFor = (label?: AnyAddress["label"]) => {
    if (label === "home") return "🏠";
    if (label === "work") return "🏢";
    return "📍";
  };

  const buildAddressLine = (item: AnyAddress) => {
    if (item.addressLine && String(item.addressLine).trim().length > 0) {
      return String(item.addressLine).trim();
    }

    const line1 = [item.house, item.area].filter(Boolean).join(", ");
    const line2 = item.landmark ? String(item.landmark) : "";
    const line3 = [item.city, item.state, item.pincode].filter(Boolean).join(", ");

    return [line1, line2, line3]
      .map((x) => String(x ?? "").trim())
      .filter((x) => x.length > 0)
      .join("\n");
  };

  const onDelete = useCallback(
    (id: string) => {
      Alert.alert("Delete address?", "This address will be removed.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const next = addresses.filter((a) => String(a.id) !== id);
            await save(next);
          },
        },
      ]);
    },
    [addresses, save]
  );

  const onMenu = useCallback(
    (item: AnyAddress) => {
      const id = String(item.id ?? "");
      Alert.alert(item.fullName ?? item.name ?? "Address", "Choose an action", [
        {
          text: "Edit",
          onPress: () =>
            router.push({
              pathname: ADDRESS_FORM_ROUTE as any,
              params: { mode: "edit", id },
            }),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(id),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [onDelete, router]
  );

  const renderItem = ({ item }: { item: AnyAddress }) => {
    const name = item.fullName ?? item.name ?? "User";
    const phone = item.phone ? String(item.phone) : "";
    const addressLine = buildAddressLine(item);

    return (
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>{iconFor(item.label)}</Text>
        </View>

        <View style={styles.mid}>
          <Text style={styles.name}>{name}</Text>
          {addressLine.length > 0 && <Text style={styles.addr}>{addressLine}</Text>}
          {phone.length > 0 && <Text style={styles.phone}>{phone}</Text>}
        </View>

        {/* ✅ Bulletproof clickable dots */}
        <Pressable
          onPress={() => onMenu(item)}
          hitSlop={18}
          style={styles.dotsBtn}
          android_ripple={{ color: "#e5e7eb", borderless: true }}
        >
          <Text style={styles.dots}>⋯</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={addresses}
        keyExtractor={(item, idx) => String(item.id ?? idx)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} hitSlop={16} style={styles.backBtn}>
              <Text style={styles.back}>←</Text>
            </Pressable>

            <Text style={styles.title}>Saved Addresses</Text>

            <View style={{ flex: 1 }} />

            {/* ✅ Add New clickable */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: ADDRESS_FORM_ROUTE as any,
                  params: { mode: "add" },
                })
              }
              hitSlop={16}
              style={styles.addBtnWrap}
            >
              <Text style={styles.addNew}>＋ Add New</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptySub}>Tap “Add New” to add your first address.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
    gap: 10,
    backgroundColor: "#fff",
  },
  backBtn: { paddingVertical: 4, paddingRight: 6 },
  back: { fontSize: 22, fontWeight: "900" },
  title: { fontSize: 20, fontWeight: "900", color: "#0f172a" },

  addBtnWrap: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },
  addNew: { fontSize: 16, fontWeight: "900", color: "#2563eb" },

  list: { padding: 14, paddingBottom: 24 },

  row: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 6 },
  left: { width: 32, alignItems: "center", marginTop: 2 },
  icon: { fontSize: 18 },

  mid: { flex: 1, paddingRight: 10 },
  name: { fontSize: 16, fontWeight: "900", color: "#0f172a" },
  addr: { marginTop: 6, fontSize: 15, color: "#475569", fontWeight: "600", lineHeight: 20 },
  phone: { marginTop: 10, fontSize: 15, color: "#0f172a", fontWeight: "800" },

  dotsBtn: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  dots: { fontSize: 28, fontWeight: "900", color: "#0f172a", marginTop: -2 },

  sep: { height: 18 },

  empty: { paddingTop: 60, alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  emptySub: { marginTop: 6, color: "#64748b", fontWeight: "700" },
});