import { InvestimentoService } from "@/services/invService";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function AdicionarInvestimento() {
  const router = useRouter();
  const { id, params } = useLocalSearchParams<{ id: string; params: string }>();
  const [valorInvestido, setValorInvestido] = useState("");
  const [dataCompra, setDataCompra] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAdicionar() {
    if (!valorInvestido || !dataCompra) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await InvestimentoService.adicionarInvestimento(
        id,
        dataCompra,
        parseFloat(valorInvestido)
      );

      Alert.alert(
        "Sucesso",
        `Investimento adicionado com sucesso!`
      );
      router.replace('/invest/investimento');
    } catch (e: any) {
      alert("Erro ao adicionar investimento: " + e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace(`/invest/investimento`)}>
        <View style={styles.rowback}>
          <Feather size={30} name="arrow-left" />
          <Text style={styles.text}>Voltar</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.cardContainer}>
        <Text>Adicionar Investimento: {params}</Text>
        <Text>{params}</Text>

        <TextInput
          placeholder="Data da Compra (yyyy-mm-dd)"
          value={dataCompra}
          onChangeText={setDataCompra}
          style={styles.input}
        />

        <TextInput
          placeholder="Valor Investido (R$)"
          keyboardType="numeric"
          value={valorInvestido}
          onChangeText={setValorInvestido}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleAdicionar}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Feather name="plus" size={20} color="#FFF" />
              <Text style={styles.btnText}>Adicionar Investimento</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  rowback: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
