import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Privacy Policy</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.h1}>Your privacy matters</Text>
          <Text style={styles.p}>
            This Privacy Policy explains how we collect, use, share, and protect your
            information when you use our app.
          </Text>
        </View>

        <Section title="1. Information We Collect">
          <Bullet>Profile details: name, email, phone number.</Bullet>
          <Bullet>Delivery info: saved addresses for orders.</Bullet>
          <Bullet>Order & cart info: items, quantities, totals, and order history.</Bullet>
          <Bullet>Device/app data: basic logs to improve performance and fix bugs.</Bullet>
        </Section>

        <Section title="2. How We Use Your Information">
          <Bullet>To create and manage your account.</Bullet>
          <Bullet>To process orders, deliveries, returns, and support requests.</Bullet>
          <Bullet>To personalize your shopping experience.</Bullet>
          <Bullet>To improve app security and prevent fraud.</Bullet>
        </Section>

        <Section title="3. Sharing of Information">
          <Bullet>We may share info with delivery/fulfillment partners to deliver orders.</Bullet>
          <Bullet>We may share info with payment providers to complete transactions.</Bullet>
          <Bullet>
            We do not sell your personal information. We share only what is necessary.
          </Bullet>
        </Section>

        <Section title="4. Cookies & Tracking">
          <Text style={styles.p}>
            We may use similar technologies to remember preferences and improve the app.
            (If you add analytics later, mention the tool here.)
          </Text>
        </Section>

        <Section title="5. Data Security">
          <Text style={styles.p}>
            We use reasonable safeguards to protect your data. No system is 100% secure,
            but we work to keep your information safe.
          </Text>
        </Section>

        <Section title="6. Your Choices">
          <Bullet>You can edit your profile information from the Account page.</Bullet>
          <Bullet>You can update or delete saved addresses.</Bullet>
          <Bullet>You can log out anytime.</Bullet>
        </Section>

        <Section title="7. Children’s Privacy">
          <Text style={styles.p}>
            Our app is not intended for children under 13. If you believe a child has
            provided personal data, contact support.
          </Text>
        </Section>

        <Section title="8. Changes to This Policy">
          <Text style={styles.p}>
            We may update this policy from time to time. We’ll update the “Last updated”
            date when changes are made.
          </Text>
          <Text style={styles.small}>Last updated: {new Date().toDateString()}</Text>
        </Section>

        <Section title="9. Contact Us">
          <Text style={styles.p}>
            For privacy questions, contact: support@yourapp.com
          </Text>
        </Section>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.h2}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "ios" ? 10 : 14,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  backBtn: { paddingVertical: 4, paddingRight: 6 },
  back: { fontSize: 22, fontWeight: "900" },
  title: { fontSize: 20, fontWeight: "900", color: "#0f172a" },

  container: { padding: 14, paddingBottom: 24 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },

  h1: { fontSize: 18, fontWeight: "900", color: "#0f172a", marginBottom: 6 },
  h2: { fontSize: 16, fontWeight: "900", color: "#0f172a", marginBottom: 8 },

  p: { fontSize: 14, color: "#475569", fontWeight: "600", lineHeight: 20 },
  small: { marginTop: 8, fontSize: 12, color: "#64748b", fontWeight: "700" },

  bulletRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  bulletDot: { fontSize: 16, fontWeight: "900", color: "#0f172a", marginTop: 1 },
  bulletText: { flex: 1, fontSize: 14, color: "#475569", fontWeight: "600", lineHeight: 20 },
});