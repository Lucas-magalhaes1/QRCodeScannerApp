import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Ícones para o botão de compartilhar

export default function Historico() {
  const router = useRouter();
  const [qrListArray, setQrListArray] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadQrList = async () => {
      try {
        const storedList = await AsyncStorage.getItem("qrList");
        if (storedList) {
          const sortedList = JSON.parse(storedList).sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setQrListArray(sortedList);
        }
      } catch (error) {
        console.error("Erro ao carregar o histórico", error);
      }
    };
    loadQrList();
  }, []);

  const limparHistorico = async () => {
    try {
      await AsyncStorage.removeItem("qrList");
      setQrListArray([]);
    } catch (error) {
      console.error("Erro ao limpar o histórico", error);
    }
  };

  const compartilharQR = async (url) => {
    try {
      await Share.share({
        message: `Confira este QR Code: ${url}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar", error);
    }
  };

  const renderItem = ({ item }) => {
    const url = item.url || item;
    const timestamp = item.timestamp || "Sem data registrada";

    return (
      <View style={[styles.listItem, darkMode && styles.listItemDark]}>
        <View style={styles.linkContainer}>
          <Text
            style={[
              styles.listText,
              darkMode ? styles.listTextDark : styles.listTextLight,
            ]}
            onPress={() => Linking.openURL(url)}
          >
            {url}
          </Text>

          {/* Botão de Compartilhar */}
          <TouchableOpacity onPress={() => compartilharQR(url)} style={styles.shareButton}>
            <Ionicons name="share-social" size={22} color={darkMode ? "#4FA3E3" : "#007AFF"} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.timestamp, darkMode && styles.timestampDark]}>
          {timestamp}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.historyContainer, darkMode && styles.historyContainerDark]}>
      <Text style={[styles.historyTitle, darkMode && styles.historyTitleDark]}>
        Histórico de QR Codes
      </Text>

      <Text style={[styles.counterText, darkMode && styles.counterTextDark]}>
        Total de QR Codes: {qrListArray.length}
      </Text>

      <FlatList
        data={qrListArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={[styles.emptyText, darkMode && styles.emptyTextDark]}>
            Nenhum QR Code escaneado ainda.
          </Text>
        }
      />

      {/* Botões de Voltar e Mudar Tema reposicionados para baixo */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, darkMode && styles.themeButtonDark]}
          onPress={() => setDarkMode(!darkMode)}
        >
          <Text style={styles.themeButtonText}>
            {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.clearButton} onPress={limparHistorico}>
        <Text style={styles.clearButtonText}>🗑️ Limpar Histórico</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  historyContainerDark: {
    backgroundColor: "#121212",
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  historyTitleDark: {
    color: "#fff",
  },
  counterText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  counterTextDark: {
    color: "#ccc",
  },
  listItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  listItemDark: {
    backgroundColor: "#333",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listText: {
    fontSize: 16,
    color: "#007AFF",
    textDecorationLine: "underline",
    flex: 1,
  },
  listTextDark: {
    color: "#4FA3E3",
  },
  listTextLight: {
    color: "#007AFF",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  timestampDark: {
    color: "#ccc",
  },
  shareButton: {
    padding: 5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
  emptyTextDark: {
    color: "#bbb",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  themeButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  themeButtonDark: {
    backgroundColor: "#888",
  },
  themeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  clearButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
