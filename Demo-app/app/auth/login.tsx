import { View, Text, TextInput, Pressable, Alert ,StyleSheet} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { API_BASE_URL } from "@/src/config/api";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ========== SEND OTP ========== */
  const sendOtp = async () => {
    if (!phone) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/login/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err) {
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  /* ========== VERIFY OTP ========== */
  const verifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/login/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp }),
        }
      );

      const data = await res.json();

      if (data.token) {
        // ✅ store JWT + update auth state
        await login(data.token);

        // ✅ navigate to app
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (err) {
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      {otpSent && (
        <TextInput
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          style={styles.input}
        />
      )}

      {!otpSent ? (
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            pressed && styles.btnPressed,
          ]}
          onPress={sendOtp}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.verifyBtn,
            pressed && styles.btnPressed,
          ]}
          onPress={verifyOtp}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 24,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  verifyBtn: {
    backgroundColor: "#16a34a",
  },
  btnPressed: {
    opacity: 0.7,
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },
});