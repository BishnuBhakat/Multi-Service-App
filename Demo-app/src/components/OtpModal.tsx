import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from "react-native";

/* ---------- TYPES ---------- */
type OtpModalProps = {
  visible: boolean;
  onVerify: (otp: string) => void;
  onClose: () => void;
  phone?: string; // optional (for showing number if needed)
};

/* ---------- COMPONENT ---------- */
export default function OtpModal({
  visible,
  onVerify,
  onClose,
  phone,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length < 4) return;
    onVerify(otp);
    setOtp(""); // clear after verify
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>OTP Verification</Text>

          {/* show phone number (optional) */}
          {phone && (
            <Text style={styles.subtitle}>
              Enter the OTP sent to {phone}
            </Text>
          )}

          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            placeholder="Enter 6 digit OTP"
            placeholderTextColor="#9ca3af"
          />

          <Pressable style={styles.btn} onPress={handleVerify}>
            <Text style={styles.btnText}>Verify OTP</Text>
          </Pressable>

          <Pressable onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    width: "85%",
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
    color: "#0f172a",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 12,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 4,
    backgroundColor: "#f9fafb",
  },

  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },

  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  cancel: {
    marginTop: 14,
    textAlign: "center",
    color: "#ef4444",
    fontWeight: "700",
  },
});
