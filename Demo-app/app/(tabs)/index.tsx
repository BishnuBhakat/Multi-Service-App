import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderNav from "../../components/HeaderNav";
import { OFFERS } from "../data/offersData";
import { TRENDING } from "../data/trendingData";
import { RANDOM_ITEMS } from "../data/randomItemsData";
import { getAddresses } from "@/src/services/addressService";

/* ================= TYPES ================= */

type DeliveryAddress = {
  _id?: string;
  fullName: string;
  phone?: string;
  house?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode: string;
};

const SELECTED_KEY = "selected_address";

/* ================= COMPONENT ================= */

export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [deliveryAddress, setDeliveryAddress] =
    useState<DeliveryAddress | null>(null);

  /* ================= LOAD ADDRESS ================= */

  const loadAddress = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(SELECTED_KEY);

      if (saved) {
        const parsed: DeliveryAddress = JSON.parse(saved);
        setDeliveryAddress(parsed);
        return;
      }

      const res = await getAddresses();

      if (res?.success && res.addresses?.length > 0) {
        const last: DeliveryAddress = res.addresses[0];

        setDeliveryAddress(last);

        await AsyncStorage.setItem(
          SELECTED_KEY,
          JSON.stringify(last)
        );
      }
    } catch (err) {
      console.log("Address load error:", err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAddress();
    }, [loadAddress])
  );

  /* ================= NAVIGATION ================= */

  const goExploreMore = () => router.push("/(tabs)/explore-more");
  const goTrending = () => router.push("/(tabs)/trending");
  const goTopDeals = () => router.push("/(tabs)/top-deals");

  const goGlobalSearch = () =>
    router.push({
      pathname: "/(tabs)/search",
      params: { q: searchText },
    });

  /* ================= UI ================= */

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <HeaderNav />

      {/* ADDRESS */}
      <View style={styles.topBlock}>
        <Pressable
          style={styles.addressWrap}
          onPress={() => router.push("/(tabs)/addresses")}
        >
          <Text style={styles.addressLabel}>Deliver to</Text>
          <Text style={styles.addressText}>
            {deliveryAddress
              ? `${deliveryAddress.fullName}, ${deliveryAddress.pincode}`
              : "Add delivery address"}
          </Text>
        </Pressable>
      </View>

      {/* SEARCH */}
      <View style={styles.sticky}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search any product"
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={goGlobalSearch}
            />
          </View>

          <Pressable onPress={goGlobalSearch} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </Pressable>
        </View>
      </View>

      {/* OFFERS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {OFFERS.map((img, i) => (
          <Image key={i} source={{ uri: img }} style={styles.banner} />
        ))}
      </ScrollView>

      {/* TRENDING */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending for You</Text>
          <Pressable onPress={goTrending}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        <FlatList
          data={TRENDING}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.trendingCard}
              onPress={goTrending}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.trendingImg}
              />
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* EXPLORE MORE */}
      <Pressable onPress={goExploreMore} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore More</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        {RANDOM_ITEMS.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Image
              source={{ uri: item.image }}
              style={styles.listImg}
            />
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          </View>
        ))}
      </Pressable>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  topBlock: {
    backgroundColor: "#d1d1f6",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  addressWrap: {
    backgroundColor: "#e2e2f7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  addressLabel: { fontSize: 12, fontWeight: "500" },
  addressText: { fontSize: 14, fontWeight: "600" },

  sticky: { backgroundColor: "#d1d1f6" },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingBottom: 10,
    gap: 15,
  },

  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e2e2f7",
    borderRadius: 100,
    paddingHorizontal: 12,
    height: 46,
  },

  searchIcon: { fontSize: 18, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 18 },

  searchBtn: {
    backgroundColor: "#e2e2f7",
    paddingHorizontal: 18,
    borderRadius: 999,
    height: 46,
    justifyContent: "center",
  },

  searchBtnText: { fontSize: 18, fontWeight: "600" },

  carousel: { backgroundColor: "#d1d1f6" },
  banner: { width: 310, height: 200, borderRadius: 10, marginRight: 15 },

  section: { backgroundColor: "#d1d1f6", paddingHorizontal: 7 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 15,
  },

  sectionTitle: { fontSize: 18, fontWeight: "900" },
  viewAll: { color: "#8989be", fontWeight: "900" },

  trendingCard: {
    backgroundColor: "#e2e2f7",
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
  },

  trendingImg: { width: 100, height: 100, borderRadius: 12 },

  listItem: {
    flexDirection: "row",
    backgroundColor: "#8989be",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },

  listImg: { width: 70, height: 70, borderRadius: 12, marginRight: 12 },

  itemName: { fontWeight: "700" },
  itemPrice: { fontWeight: "900", marginTop: 4 },
});
