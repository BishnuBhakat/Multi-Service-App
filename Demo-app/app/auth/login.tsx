import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { API_BASE_URL } from "../../src/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (data.success) setOtpSent(true);
    else alert(data.message);
  };

  const verifyOtp = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();

    if (data.token) {
      await AsyncStorage.setItem("token", data.token);
      router.replace("/(tabs)"); // 👈 logged in
    } else {
      alert(data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {!otpSent ? (
        <>
          <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} />
          <Pressable style={styles.btn} onPress={sendOtp}>
            <Text style={styles.btnText}>SEND OTP</Text>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput placeholder="Enter OTP" value={otp} onChangeText={setOtp} style={styles.input} />
          <Pressable style={styles.btn} onPress={verifyOtp}>
            <Text style={styles.btnText}>VERIFY OTP</Text>
          </Pressable>
        </>
      )}

      <Pressable onPress={() => router.push("/auth/signup")}>
        <Text style={styles.link}>Create new account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "900", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },
  link: { marginTop: 16, textAlign: "center", color: "#2563eb" },
});