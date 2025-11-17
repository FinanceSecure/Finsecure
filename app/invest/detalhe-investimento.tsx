import { InvestimentoService } from "@/services/invService";
import { FormatarMoeda } from "@/utils/formatters";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function DetalheInvestimento() {
  const { id, nome } = useLocalSearchParams();
  const [extrato, setExtrato] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await InvestimentoService.buscarInvestimentoPorTipo(id as string);
        setExtrato(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="red" />
      </View>
    )
  }

  const {
    valorTotalInvestido,
    rendimentoBruto,
    imposto,
    rendimentoLiquido,
    valorLiquido
  } = extrato;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <View style={styles.rowback}>
          <Feather size={30} name="arrow-left" color={"red"} />
        </View>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.titulo}>
          {nome || "Investimento"}
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Valor aplicado:</Text>
          <Text style={styles.valor}>
            {FormatarMoeda(valorTotalInvestido)}
          </Text>
        </View>

        <View style={styles.divisor} />

        <View style={styles.section}>
          <Text style={styles.label}>Rendimento Bruto:</Text>
          <Text style={styles.valorBruto}>
            {FormatarMoeda(rendimentoBruto)}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Imposto:</Text>
          <Text style={styles.texto}>{FormatarMoeda(imposto)}</Text>
        </View>

        <View style={styles.divisor} />

        <View style={styles.section}>
          <Text style={styles.label}>Rendimento Líquido:</Text>
          <Text style={styles.valorLiquido}>
            {FormatarMoeda(rendimentoLiquido)}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Total Líquido:</Text>
          <Text style={styles.valorFinal}>
            {FormatarMoeda(valorLiquido)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowback: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
    color: "#222",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  texto: {
    fontSize: 14,
    color: "#333",
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  valorBruto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d9534f",
  },
  valorLiquido: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e8b57",
  },
  valorFinal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  divisor: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
});
