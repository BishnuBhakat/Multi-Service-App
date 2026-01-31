import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderNav from "../../components/HeaderNav";

const FLIPKART_BLUE = "#2874F0";

// ✅ storage key for profile
const PROFILE_KEY = "profile";

type Profile = {
  name: string;
  email: string;
  phone: string;
};

export default function Account() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    name: "Demo User",
    email: "demo@gmail.com",
    phone: "+91 98765 43210",
  });

  // ✅ Load profile whenever page is focused (after edit, it refreshes automatically)
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      (async () => {
        try {
          const raw = await AsyncStorage.getItem(PROFILE_KEY);
          if (!raw) return;

          const saved = JSON.parse(raw) as Partial<Profile>;
          if (!mounted) return;

          setProfile((prev) => ({
            name: saved.name ?? prev.name,
            email: saved.email ?? prev.email,
            phone: saved.phone ?? prev.phone,
          }));
        } catch {
          // ignore parse/storage errors
        }
      })();

      return () => {
        mounted = false;
      };
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["seenIntro", "loggedIn"]);
    router.replace("/auth/intro");
  };

  return (
    <View style={styles.screen}>
      <HeaderNav />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile.name?.trim()?.[0] ?? "D").toUpperCase()}
              {(profile.name?.trim()?.split(" ")?.[1]?.[0] ?? "U").toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.meta}>{profile.email}</Text>
            <Text style={styles.meta}>{profile.phone}</Text>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/edit-profile" as any,
                params: {
                  name: profile.name,
                  email: profile.email,
                  phone: profile.phone,
                },
              })
            }
            style={styles.editBtn}
          >
            <Text style={styles.editText}>EDIT</Text>
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          <QuickBtn
            label="Orders"
            emoji="📦"
            onPress={() => router.push("/(tabs)/orders")}
          />
          <QuickBtn
            label="Wishlist"
            emoji="❤️"
            onPress={() => router.push("/wishlist")}
          />
          <QuickBtn label="Cart" emoji="🛒" onPress={() => router.push("/cart")} />
        </View>

        {/* Section: Account Options */}
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.listCard}>
          <RowItem
            title="My Orders"
            subtitle="Track, return or buy again"
            onPress={() => router.push("/orders" as any)}
          />
          <Divider />
          <RowItem
            title="Saved Addresses"
            subtitle="Add & manage delivery addresses"
            onPress={() => router.push("/addresses" as any)}
          />
          <Divider />
          <RowItem
            title="Add New Address"
            subtitle="Create a new delivery address"
            onPress={() => router.push("/address-form" as any)}
          />
          <Divider />
          <RowItem
            title="Help Center"
            subtitle="FAQs & support"
            onPress={() => router.push("/help" as any)}
          />
        </View>

        {/* Section: More */}
        <Text style={styles.sectionTitle}>More</Text>
        <View style={styles.listCard}>
          <RowItem
            title="Notifications"
            subtitle="Offers & order updates"
            onPress={() => router.push("/notifications" as any)}
          />
          <Divider />
          <RowItem
            title="Privacy Policy"
            subtitle="Read our policy"
            onPress={() => router.push("/privacy" as any)}
          />
          <Divider />
          <RowItem
            title="Terms & Conditions"
            subtitle="Read terms of use"
            onPress={() => router.push("/terms" as any)}
          />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </Pressable>

        <Text style={styles.footerText}>App Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function QuickBtn({
  label,
  emoji,
  onPress,
}: {
  label: string;
  emoji: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickBtn,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
      android_ripple={{ color: "#e5e7eb" }}
      hitSlop={8}
    >
      <Text style={styles.quickEmoji}>{emoji}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

function RowItem({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.rowItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f1f5f9" },

  container: {
    padding: 14,
    paddingBottom: 24,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: FLIPKART_BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 18 },

  name: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  meta: { marginTop: 2, color: "#64748b", fontWeight: "700" },

  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
  },
  editText: { color: "#0f172a", fontWeight: "900", fontSize: 12 },

  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quickEmoji: { fontSize: 22 },
  quickLabel: { marginTop: 6, fontWeight: "900", color: "#0f172a" },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    color: "#334155",
    paddingHorizontal: 2,
  },

  listCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowTitle: { fontWeight: "900", color: "#0f172a", fontSize: 15 },
  rowSub: { marginTop: 3, color: "#64748b", fontWeight: "700", fontSize: 12 },
  chev: {
    fontSize: 26,
    color: "#94a3b8",
    marginLeft: 10,
    marginTop: Platform.OS === "ios" ? -2 : 0,
  },

  divider: { height: 1, backgroundColor: "#eef2f7" },

  logoutBtn: {
    marginTop: 18,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  footerText: {
    marginTop: 10,
    textAlign: "center",
    color: "#94a3b8",
    fontWeight: "800",
    fontSize: 12,
  },
});