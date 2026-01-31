
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, useRouter, usePathname } from "expo-router";

export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();

  const Item = ({
    label,
    icon,
    route,
  }: {
    label: string;
    icon: string;
    route: Href;
  }) => {
    const active = pathname === route;

    return (
      <Pressable onPress={() => router.push(route)} style={styles.item}>
        {/* ICON WRAPPER */}
        <View style={[styles.iconWrap, active && styles.activeIconWrap]}>
          <Text style={[styles.icon, active && styles.activeIcon]}>
            {icon}
          </Text>
        </View>

        <Text style={[styles.label, active && styles.activeLabel]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.nav}>
          <Item label="Home" icon="🏠" route="/" />
          <Item label="Clothing" icon="👕" route="/clothingMain" />
          <Item label="Grocery" icon="🛒" route="/groceryMain" />
          <Item label="Electronics" icon="📱" route="/electronicsMain" />
          <Item label="Jewellery" icon="💍" route="/jewelleryMain" />
          <Item label="Hotels" icon="🏢" route="/hotelsMain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 0,
    backgroundColor: "#d1d1f6",
  },

  nav: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderColor: "#d1d1f6",
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },

  /* 🔵 ICON CONTAINER (Flipkart style) */
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 10,
  
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconWrap: {
    backgroundColor: "#4067bc",
  },

  icon: {
    fontSize: 22,
  },

  activeIcon: {
    color: "#fff",
  },

  label: {
    fontSize: 12,
    marginTop: 6,
    color: "#6b7280",
    fontWeight: "600",
  },

  activeLabel: {
    color: "#2563eb",
    fontWeight: "800",
  },
});