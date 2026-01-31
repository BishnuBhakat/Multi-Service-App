import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditProfile() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    email?: string;
    phone?: string;
  }>();

  const [name, setName] = useState(params.name ?? "Demo User");
  const [email, setEmail] = useState(params.email ?? "demo@gmail.com");
  const [phone, setPhone] = useState(params.phone ?? "+91 98765 43210");

  const onSave = () => {
    if (!name.trim()) return Alert.alert("Name required", "Please enter your name.");
    if (!email.trim()) return Alert.alert("Email required", "Please enter your email.");
    if (!phone.trim()) return Alert.alert("Phone required", "Please enter your phone number.");

    // ✅ Later: save to context / AsyncStorage / backend
    // For now just go back with updated values:
    router.back();

    // If you want to pass updated values back via params instead:
    // router.replace({ pathname: "/account", params: { name, email, phone } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 14 }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 14 }]}>Phone Number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Pressable style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9", padding: 14 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  backBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  backText: { fontSize: 22, fontWeight: "900" },
  title: { fontSize: 20, fontWeight: "900", color: "#0f172a" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  label: { color: "#6b7280", fontWeight: "800", marginBottom: 8 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  saveBtn: {
    marginTop: 18,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});