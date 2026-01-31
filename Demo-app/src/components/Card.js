import { View, Text, Image, StyleSheet } from "react-native";

export default function Card({ title, price, image }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      {price && <Text style={styles.price}>${price}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 3
  },
  image: {
    height: 120,
    borderRadius: 10
  },
  title: {
    fontSize: 16,
    marginTop: 5
  },
  price: {
    fontWeight: "bold",
    color: "green"
  }
});
