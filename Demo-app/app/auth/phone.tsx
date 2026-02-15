import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/src/config/api";

export default function PhoneAuth() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* SEND OTP */
  const sendOtp = async () => {
    if (phone.length !== 10)
      return Alert.alert("Invalid", "Enter a valid 10 digit mobile number");

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        Alert.alert("OTP Sent", "Check your server console for OTP");
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch {
      Alert.alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */
//     const verifyOtp = async () => {
//     const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
//         method: "POST",
//         headers: {
//         "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//         phone,
//         otp,
//         }),
//     });

//     const data = await res.json();

//     if (!data.token) {
//         alert("Invalid OTP");
//         return;
//     }

// await AsyncStorage.setItem("token", data.token);

// /* IMPORTANT: wait for storage to flush */
// const savedToken = await AsyncStorage.getItem("token");

// if (!savedToken) {
//   Alert.alert("Auth Error", "Login failed. Please try again.");
//   return;
// }

// if (data.isNewUser) {
//   router.replace("/auth/profile");
// } else {
//   router.replace("/(tabs)");
// }

//     };




const verifyOtp = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        otp,
      }),
    });

    const data = await res.json();

    if (!data.token) {
      alert("Invalid OTP");
      return;
    }

    /* ===== SAVE TOKEN ===== */
    await AsyncStorage.setItem("token", data.token);

    /* ===== DEBUG: PRINT TOKEN ===== */
    console.log("=================================");
    console.log("USER AUTHENTICATED ✅");
    console.log("PHONE:", phone);
    console.log("JWT TOKEN:", data.token);
    console.log("NEW USER:", data.isNewUser);
    console.log("=================================");

    /* verify storage */
    const savedToken = await AsyncStorage.getItem("token");
    console.log("TOKEN FROM STORAGE:", savedToken);

    /* ===== ROUTE ===== */
    if (data.isNewUser) {
      router.replace("/auth/profile");
    } else {
      router.replace("/(tabs)");
    }

  } catch (err) {
    console.log("VERIFY OTP ERROR:", err);
    Alert.alert("Network Error", "Unable to login");
  }
};





  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>
        Enter your mobile number to continue
      </Text>

      <TextInput
        placeholder="Enter Mobile Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      {otpSent && (
        <TextInput
          placeholder="Enter OTP"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
        />
      )}

      <Pressable
        style={styles.button}
        onPress={otpSent ? verifyOtp : sendOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {otpSent ? "Verify OTP" : "Send OTP"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 10,
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#64748b",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
