
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
import { useState } from "react";
import HeaderNav from "../../components/HeaderNav";
import { OFFERS } from "../data/offersData";
import { TRENDING } from "../data/trendingData";
import { RANDOM_ITEMS } from "../data/randomItemsData";
export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const goExploreMore = () => router.push("./(tabs)/explore-more");
  const goTrending = () => router.push("./(tabs)/trending");
  const goTopDeals = () => router.push("./(tabs)/top-deals");

  const goGlobalSearch = () =>
    router.push({
      pathname: "./(tabs)/search",
      params: { q: searchText },
    });

  return ( 
    
    <ScrollView  showsVerticalScrollIndicator={false}>
      <HeaderNav />
    
      {/* 🔵 ADDRESS + SEARCH (AMAZON STYLE BLOCK) */}
      <View style={{ flex:1,  }} />
      <View style={styles.topBlock}>
        {/* Address */}
        {/* Address (THINNER & NOT BOLD) */}
        <Pressable style={styles.addressWrap}>
          <Text style={styles.addressLabel}>Deliver to</Text>
          <Text style={styles.addressText}>
            DIPTI BHOWMIK, 711204
          </Text>
        </Pressable>
      </View>
     
        {/* Search (WIDER + ICON) */}
      <View style={{flex:1}} />
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
      <View style={{ flex: 1 }} />
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
      <View style={{ flex: 1 }} />
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
          contentContainerStyle={{ paddingRight: 12 }}
          renderItem={({ item }) => (
            <Pressable style={styles.trendingCard} onPress={goTrending}>
              <Image source={{ uri: item.image }} style={styles.trendingImg} />
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </Pressable>
          )}
        />
      </View>
    
      
      {/* TOP DEALS */}
      <View style={{ flex: 1 }} />
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Deals</Text>
          <Pressable onPress={goTopDeals}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        <FlatList
          data={TRENDING}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingRight: 12 }}
          renderItem={({ item }) => (
            <Pressable style={styles.trendingCard} onPress={goTopDeals}>
              <Image source={{ uri: item.image }} style={styles.trendingImg} />
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* EXPLORE MORE */}
      <View style={{ flex: 1 }} />
      <Pressable onPress={goExploreMore} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore More</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        {RANDOM_ITEMS.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Image source={{ uri: item.image }} style={styles.listImg} />
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

const styles = StyleSheet.create({
  /* 🔵 TOP BLOCK */
  topBlock: {
    backgroundColor: "#d1d1f6",
    paddingHorizontal: 0,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#d1d1f6",
    zIndex: 100,
  },

  addressWrap: {
    backgroundColor: "#e2e2f7ff",
    paddingVertical: 8,        // 👈 thinner
    paddingHorizontal: 12,
    borderRadius: 990,
    marginBottom: 4,           // 👈 less gap
    maxWidth: "100%",
  },
  addressLabel: {
    fontSize: 12,
    color: "#000000ff",
    fontWeight: "500",         // 👈 not bold
  },

  addressText: {
    fontSize: 14,
    fontWeight: "600",         // 👈 lighter than before
    color: "#000000ff",
  },
  sticky: {
    paddingTop:0 ,
  },
  searchRow: {
    backgroundColor: "#d1d1f6",
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 10,
    gap: 15,
  },
  searchInputWrap: {
    flex: 1,                   // 👈 makes search bar wider
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e2e2f7ff",
    borderRadius: 100,
    paddingHorizontal: 12,
    height: 46,
    maxWidth: "100%",
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 6,
    color: "#0055ffff",
  },

  searchInput: {
    flex: 1,
    fontSize: 18,
    height: "100%",
  },

  searchBtn: {
    backgroundColor: "#e2e2f7ff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 700,
    height: "100%",
  },

  searchBtnText: {
    color: "#8f8585ff",
    fontSize: 18,
    fontWeight: "600",
  },


  carousel: {  
      backgroundColor: "#d1d1f6",
   },
  banner: {
    width: 310,
    height: 200,
    borderRadius: 10,
    marginRight: 15,
  },

  section: { paddingHorizontal: 3, marginTop: 0, backgroundColor: "#d1d1f6" },
  sectionHeader: {
    backgroundColor: "#d1d1f6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "900",padding: 7 },
  viewAll: { color: "#8989beff", padding: 7, fontWeight: "900" },

  trendingCard: {
    backgroundColor: "#e2e2f7ff",
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
    width: "auto",
  },
  trendingImg: { width: 100, height: 100, borderRadius: 12 },

  listItem: {
    flexDirection: "row",
    backgroundColor: "#fb0606ff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  listImg: { width: 70, height: 70, borderRadius: 12, marginRight: 12 },

  itemName: { fontWeight: "700" },
  itemPrice: { fontWeight: "900", marginTop: 4 },
});
