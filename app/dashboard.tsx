import { SaldoService } from "@/services/saldoService";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Dashboard() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const valorInvestido = 8000;

  useEffect(() => {
    async function carregarDados() {
      try {
        const saldoAtual = await SaldoService.verificarSaldo("68a4922de6185db3b2faf312");
        setSaldo(saldoAtual.valor);
      } catch (erro) {
        setErro('Erro ao carregar os dados');
        console.error("Erro:", erro);
      }
    }
    carregarDados();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.saldoContainer}>
        <Text>Saldo: </Text>
        <Text style={styles.text}>
          R$ {
          saldo !== null 
            ? saldo 
            : "Carregando..."
          }
        </Text>
      </View>
      <View>
        <View style={styles.investimentosContainer}>
          <Text style={styles.textInvestimentoTitle}>Investimentos</Text>
          <Text style={styles.textInvestimento}>
            {"Cofrinho MP (120$ do CDI):"}
          </Text>
          <Text style={styles.textInvestimento}>
            R$ {valorInvestido}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    backgroundColor: '#FFFFFF',
  },
  saldoContainer: {
    marginLeft: 30
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
  investimentosContainer: {
    marginTop: 40,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderColor: "#000"
  },
  textInvestimentoTitle: {
    fontSize: 24,
    color: "#333333",
    marginLeft: 10
  },
  textInvestimento: {
    fontSize: 22,
    marginLeft: 10,
    color: "#333"
  }
});
