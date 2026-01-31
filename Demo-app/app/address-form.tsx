import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AddressItem = {
  id: string;
  label?: "home" | "work" | "other";
  fullName: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  house: string;
  area: string;
  landmark?: string;
};

const ADDR_KEY = "saved_addresses_v1";

export default function AddressForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; id?: string }>();
  const isEdit = params.mode === "edit";

  const title = useMemo(() => (isEdit ? "Edit Address" : "Add New Address"), [isEdit]);

  const [id, setId] = useState(params.id ?? "");
  const [label, setLabel] = useState<AddressItem["label"]>("home");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [house, setHouse] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");

  useEffect(() => {
    (async () => {
      if (!isEdit || !params.id) return;
      try {
        const raw = await AsyncStorage.getItem(ADDR_KEY);
        const list: AddressItem[] = raw ? JSON.parse(raw) : [];
        const found = list.find((x) => x.id === params.id);
        if (!found) return;

        setId(found.id);
        setLabel(found.label ?? "home");
        setFullName(found.fullName ?? "");
        setPhone(found.phone ?? "");
        setPincode(found.pincode ?? "");
        setCity(found.city ?? "");
        setState(found.state ?? "");
        setHouse(found.house ?? "");
        setArea(found.area ?? "");
        setLandmark(found.landmark ?? "");
      } catch {}
    })();
  }, [isEdit, params.id]);

  const buildAddressLine = (a: AddressItem) => {
    const line1 = [a.house, a.area].filter(Boolean).join(", ");
    const line2 = [a.landmark].filter(Boolean).join(", ");
    const line3 = [a.city, a.state, a.pincode].filter(Boolean).join(", ");
    return [line1, line2, line3].filter(Boolean).join("\n");
  };

  const onSave = async () => {
    if (!fullName.trim()) return Alert.alert("Required", "Enter full name");
    if (!phone.trim()) return Alert.alert("Required", "Enter phone number");
    if (!pincode.trim()) return Alert.alert("Required", "Enter pincode");
    if (!city.trim()) return Alert.alert("Required", "Enter city");
    if (!state.trim()) return Alert.alert("Required", "Enter state");
    if (!house.trim()) return Alert.alert("Required", "Enter house / flat / building");
    if (!area.trim()) return Alert.alert("Required", "Enter area / street");

    const raw = await AsyncStorage.getItem(ADDR_KEY);
    const list: AddressItem[] = raw ? JSON.parse(raw) : [];

    const item: AddressItem = {
      id: isEdit ? id : String(Date.now()),
      label,
      fullName: fullName.trim(),
      phone: phone.trim(),
      pincode: pincode.trim(),
      city: city.trim(),
      state: state.trim(),
      house: house.trim(),
      area: area.trim(),
      landmark: landmark.trim() || undefined,
    };

    const next = isEdit ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
    await AsyncStorage.setItem(ADDR_KEY, JSON.stringify(next));
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* ✅ Scrollable form */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.label}>Address Type</Text>
          <View style={styles.pillsRow}>
            {(["home", "work", "other"] as const).map((t) => {
              const active = label === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setLabel(t)}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {t.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />

          <Text style={styles.label}>Phone</Text>
          <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />

          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput value={pincode} onChangeText={setPincode} style={styles.input} keyboardType="number-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>City</Text>
              <TextInput value={city} onChangeText={setCity} style={styles.input} />
            </View>
          </View>

          <Text style={styles.label}>State</Text>
          <TextInput value={state} onChangeText={setState} style={styles.input} />

          <Text style={styles.label}>House / Flat / Building</Text>
          <TextInput value={house} onChangeText={setHouse} style={styles.input} />

          <Text style={styles.label}>Area / Street / Locality</Text>
          <TextInput value={area} onChangeText={setArea} style={styles.input} />

          <Text style={styles.label}>Landmark (Optional)</Text>
          <TextInput value={landmark} onChangeText={setLandmark} style={styles.input} />

          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Preview</Text>
            <Text style={styles.previewText}>
              {buildAddressLine({
                id: "preview",
                label,
                fullName,
                phone,
                pincode,
                city,
                state,
                house,
                area,
                landmark,
              } as AddressItem)}
            </Text>
          </View>

          <Pressable style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>{isEdit ? "SAVE CHANGES" : "SAVE ADDRESS"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9" },
  topBar: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12, padding: 14 },
  back: { fontSize: 22, fontWeight: "900" },
  title: { fontSize: 20, fontWeight: "900", color: "#0f172a" },

  scrollContent: { padding: 14, paddingBottom: 30 },

  card: { backgroundColor: "#fff", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  label: { color: "#334155", fontWeight: "900", marginTop: 12, marginBottom: 8 },

  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  row2: { flexDirection: "row", gap: 10 },

  pillsRow: { flexDirection: "row", gap: 10 },
  pill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e5e7eb" },
  pillActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  pillText: { fontWeight: "900", color: "#0f172a", fontSize: 12 },
  pillTextActive: { color: "#fff" },

  preview: { marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e5e7eb" },
  previewTitle: { fontWeight: "900", color: "#0f172a", marginBottom: 6 },
  previewText: { color: "#475569", fontWeight: "700", lineHeight: 20 },

  saveBtn: { marginTop: 18, backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});