import { lerDadosToken } from "@/services/authService";
import { InvestimentoService } from "@/services/investimentoService";
import { SaldoService } from "@/services/saldoService";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Dashboard() {
  const [nome, setNome] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [despesas, setDespesas] = useState<number | null>(null);
  const [extrato, setExtrato] = useState<any | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const token = await AsyncStorage.getItem("@app_token");
        if (token) {
          const usuario = lerDadosToken(token);
          if (usuario) {
            const primeiroNome = usuario.nome.split(" ")[0];
            setNome(primeiroNome);
          }
        }

        const saldoAtual = await SaldoService.verificarSaldo();
        setSaldo(saldoAtual.valor);

        const extratoInv = await InvestimentoService.getExtrato("68a53c8b8599c9640a20ee99")
        setExtrato(extratoInv);
      } catch (erro) {
        setErro('Erro ao carregar os dados');
        console.error("Erro:", erro);
      }
    }
    carregarDados();
  }, []);

  return (
    <View style={styles.container}>
      {nome && (
        <Text style={styles.textUsuario}>
          Olá, {nome}
        </Text>
      )}
      <View style={styles.resumoContainer}>
        <View style={styles.card}>
          <FontAwesome name="arrow-up" size={28} color="green" />
          <Text style={styles.label}>Receitas</Text>
          <Text style={styles.valor}>R$ {saldo ?? "0"}</Text>
        </View>

        <View style={styles.card}>
          <FontAwesome name="arrow-down" size={28} color="red" />
          <Text style={styles.label}>Despesas</Text>
          <Text style={styles.valor}>R$ {despesas ?? "0"}</Text>
        </View>
      </View>

      <View style={styles.cardInvestimentos}>
        <Text style={styles.titulo}>Investimentos</Text>
        <Text style={styles.valorAtual}>R$ {extrato?.valorTotalLiquido.toFixed(2) ?? "0,00"}</Text>
        <Text style={styles.valorRendimento}>+ {extrato?.valorTotalRendimentoLiquido.toFixed(2)}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    backgroundColor: '#FFF',
  },
  textUsuario: {
    fontSize: 22,
    fontWeight: "600",
    marginHorizontal: 10,
    marginBottom: 20,
    color: "#333",
  },
  resumoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  valor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  cardInvestimentos: {
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#222",
  },
  valorAtual: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  valorRendimento: {
    fontSize: 16,
    color: "green",
    marginLeft: 145,
    marginTop: 50,
    position: "absolute"
  },
});
