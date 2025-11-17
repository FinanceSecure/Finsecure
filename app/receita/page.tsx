import { RendaVariavelItem } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SaldoService } from "../../services/saldoService";

export default function ReceitaPage() {
  const [rendaFixa, setRendaFixa] = useState<any>(null);
  const [receitas, setReceitas] = useState<any>(null);
  const router = useRouter();

  async function carregarValores() {
    try {
      const receitasAPI = await SaldoService.verificarReceitas();
      const RF = await SaldoService.verificarRendaFixa();

      setRendaFixa(RF?.rendaFixa ?? RF ?? null);
      setReceitas(receitasAPI);
    } catch (err) {
      console.error("Erro ao carregar valores:", err);
      Alert.alert("Erro", "Não foi possível carregar os valores.");
    }
  }

  async function removerRendaFixa() {
    await SaldoService.deletarRendaFixa();
    carregarValores();
  }

  useEffect(() => {
    carregarValores();
  }, []);

  const outros: RendaVariavelItem[] =
    (receitas?.detalhes?.outros as RendaVariavelItem[]) || [];

  return (
    <View style={styles.container}>
      <View style={styles.rowback}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather size={26} name="arrow-left" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Receita</Text>
      <View style={styles.receitaCard}>
        <View style={styles.rowBetween}>
          <Text>Renda Fixa: {receitas?.rendaFixa ?? 0}</Text>
          <View style={styles.actionsRow}>
            {!rendaFixa && (
              <TouchableOpacity onPress={() => router.push("/receita/RFixaForm")}>
                <Feather name="plus" size={20} color="green" />
              </TouchableOpacity>
            )}
            {rendaFixa && (
              <>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/receita/RFixaForm",
                      params: { valor: String(rendaFixa?.valor ?? rendaFixa) },
                    })
                  }
                >
                  <Feather name="edit" size={22} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={removerRendaFixa}>
                  <Feather name="trash" size={22} color="red" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.divisor} />

      <View style={styles.receitaCard}>
        <View style={styles.rowBetween}>
          <Text>Renda Variável: {receitas?.rendaVariavel ?? 0}</Text>

          <TouchableOpacity
            onPress={() => router.push("/receita/RVariavelForm")}
            style={{ padding: 4 }}
          >
            <Feather name="plus" size={20} color="green" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginTop: 12 }}>
          {outros.length === 0 && (
            <Text style={{ color: "#666" }}>Nenhuma renda variável cadastrada.</Text>
          )}
          {outros.map((item: RendaVariavelItem) => (
            <View key={item.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardDesc}>{item.descricao}</Text>
                <Text style={styles.cardValor}>R$ {Number(item.valor).toFixed(2)}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/receita/RVariavelForm",
                      params: {
                        id: item.id,
                        valor: String(item.valor),
                        descricao: item.descricao,
                      },
                    })
                  }
                  style={styles.iconButton}
                >
                  <Feather name="edit" size={20} color="blue" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  rowback: {
    marginVertical: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receitaCard: {
    backgroundColor: "#EEE9",
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 15,
  },
  divisor: {
    height: 1,
    backgroundColor: "#eee9",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  cardDesc: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  cardValor: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardActions: {
    marginLeft: 12,
    flexDirection: "row",
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
});
