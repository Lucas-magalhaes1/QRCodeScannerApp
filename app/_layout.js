import { Stack, Slot } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Layout() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📷 QR Code Scanner</Text>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // Um fundo mais moderno escuro
  },
  header: {
    fontSize: 26,
    textAlign: "center",
    marginVertical: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
