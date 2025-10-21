import { lerDadosToken } from "@/services/authService";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function DashboardEmpresa() {
  const [isLoading, setIsLoading] = useState(true);
  const [nome, setNome] = useState<string>("");
  const [error, setError] = useState("");
  const [receita, setReceita] = useState<number>(0);
  const [despesas, setDespesas] = useState<number>(73000);
  const [investimento, setInvestimento] = useState<number>(2700);
  const [dividendos, setDividendos] = useState<number>(18.9);
  const [lucroOperacional, setLucroOperacional] = useState<number>(receita - despesas);
  const [lucroFinal, setLucroFinal] = useState<number>(lucroOperacional - investimento + dividendos);

  useEffect(() => {
    async function carregarDados() {
      const token = await AsyncStorage.getItem("@app_token");
      if (token) {
        const usuario = lerDadosToken(token);
        if (usuario) {
          const primeiroNome = usuario.nome.split(" ")[0];
          setNome(primeiroNome);
          setLucroOperacional(receita - despesas);
          setLucroFinal(lucroOperacional - investimento + dividendos);
        }
      } else {
        setError("Token não encontrado");
      }
      setIsLoading(false);
    }
    carregarDados();
  }, [receita, despesas, investimento, dividendos]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Olá, {nome}!</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <FontAwesome name="arrow-up" size={28} color="green" />
          <Text style={styles.label}>Receitas</Text>
          <Text style={styles.valor}>R$ {receita.toLocaleString()}</Text>
        </View>

        <View style={styles.card}>
          <FontAwesome name="arrow-down" size={28} color="red" />
          <Text style={styles.label}>Despesas</Text>
          <Text style={styles.valor}>R$ {despesas.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.cardGrande}>
        <Text style={styles.titulo}>Lucro Operacional</Text>
        <Text style={styles.valorGrande}>R$ {lucroOperacional.toLocaleString()}</Text>
      </View>

      <View style={styles.card}>
        <FontAwesome name="line-chart" size={28} color="#007bff" />
        <Text style={styles.label}>Investimentos Aplicados</Text>
        <Text style={styles.valor}>R$ {investimento.toLocaleString()}</Text>
      </View>

      <View style={styles.card}>
        <FontAwesome name="money" size={28} color="green" />
        <Text style={styles.label}>Dividendos Recebidos</Text>
        <Text style={styles.valorRendimento}>
          + R$ {dividendos.toFixed(2)}
        </Text>
      </View>

      <View style={styles.cardGrande}>
        <Text style={styles.titulo}>Lucro Final Disponível</Text>
        <Text style={styles.valorGrande}>R$ {lucroFinal.toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    color: "#333",
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    margin: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardGrande: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  valor: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },
  valorGrande: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginTop: 10,
  },
  valorRendimento: {
    fontSize: 18,
    color: "green",
    marginTop: 5,
    fontWeight: "600",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
