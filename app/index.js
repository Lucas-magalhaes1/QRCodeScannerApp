import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Ícones para melhorar o design

export default function Index() {
  const router = useRouter();
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState("");
  const [qrList, setQrList] = useState([]);

  useEffect(() => {
    const loadQrList = async () => {
      try {
        const storedList = await AsyncStorage.getItem("qrList");
        if (storedList) {
          setQrList(JSON.parse(storedList));
        }
      } catch (error) {
        console.error("Erro ao carregar o histórico", error);
      }
    };
    loadQrList();
  }, []);

  if (!permission) {
    return <View></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Permita que o app utilize a câmera.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((atual) => (atual === "back" ? "front" : "back"));
  }

  const handleCamera = async ({ data }) => {
    setScanned(true);
    setQrData(data);

    const newEntry = { url: data, timestamp: new Date().toLocaleString() };

    try {
      const storedList = await AsyncStorage.getItem("qrList");
      const prevList = storedList ? JSON.parse(storedList) : [];

      const updatedList = [...prevList, newEntry];
      await AsyncStorage.setItem("qrList", JSON.stringify(updatedList));

      setQrList(updatedList);
    } catch (error) {
      console.error("Erro ao salvar no histórico", error);
    }

    Alert.alert("QR Code Escaneado!", `Conteúdo: ${data}`);
  };

  const irParaHistorico = () => {
    router.push("/historico");
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleCamera}
      />

      {/* Botão discreto para inverter a câmera */}
      <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
        <Ionicons name="camera-reverse" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.controles}>
        {scanned && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.buttonText}>📷 Escanear Novamente</Text>
            </TouchableOpacity>

            {/* Exibir botão de histórico apenas se houver histórico salvo */}
            {qrList.length > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.historyButton]}
                onPress={irParaHistorico}
              >
                <Text style={styles.buttonText}>📜 Ver Histórico</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {qrData !== "" && (
        <View style={styles.result}>
          <Text style={styles.resultText}>{qrData}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Fundo escuro moderno
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 6,
    width: "100%",
  },
  flipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 30,
  },
  controles: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    width: "80%",
  },
  secondaryButton: {
    backgroundColor: "#4CAF50",
  },
  historyButton: {
    backgroundColor: "#FFA500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  result: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
  },
});

