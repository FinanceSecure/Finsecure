import { useInvestimentoData } from "@/hooks/useInvestimento";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Investimento() {
  const { data, isLoading, error } = useInvestimentoData();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando...</Text>
      </View>
    )
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Erro desconhecido"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.rowback}>
        <TouchableOpacity onPress={() => router.replace(`/dashboard`)}>
          <Feather size={26} name="arrow-left" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Investimentos</Text>
        <Text style={styles.total}>
          Total: {data.valorTotalInvestido.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        </Text>
      </View>
      <FlatList
        data={data.investimentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => {
              router.push({
                pathname: `/invest/resgatar-investimento`,
                params: {
                  id: item.id,
                  nome: item.nome,
                  valor: item.valorTotalLiquido
                }
              });
            }}>
              <View style={styles.resgatarBtn}>
                <Feather size={24} name="arrow-up-circle" color={"orange"} />
              </View>
            </TouchableOpacity>

            <Text style={styles.invNome}>{item.nome}</Text>
            <Text style={styles.valor}>
              {item.valorTotalLiquido.toLocaleString("pt-BR", {
                style: "currency", currency: "BRL"
              })}
            </Text>

            <Text style={styles.lucro}>
              {item.valorTotalRendimentoLiquido.toLocaleString("pt-BR", {
                style: "decimal"
              })}
            </Text>

            <View style={{ flexDirection: "row-reverse", gap: 15 }}>
              <TouchableOpacity onPress={() => {
                router.push({
                  pathname: "/invest/adicionar-investimento",
                  params: {
                    id: item.id,
                    params: item.nome
                  }
                });
              }}>
                <Feather size={24} name="arrow-down-circle" color={"green"} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                router.push({
                  pathname: `/invest/detalhe-investimento`,
                  params: {
                    id: item.id,
                    nome: item.nome,
                    valorInvestido: item.valorTotalInvestido,
                    rendimentoBruto: item.valorTotalRendimentoBruto,
                    imposto: item.valorTotalImposto,
                    rendimentoLiquido: item.valorTotalRendimentoLiquido,
                    valorLiquido: item.valorTotalLiquido
                  }
                });
              }}>
                <Feather size={24} name="file-text" color={"blue"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20
  },
  center: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#DDDDDDFF",
    alignItems: "center"
  },
  header: {
    marginBottom: 20,
  },
  rowback: {
    marginVertical: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#EEE9",
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  invNome: {
    fontSize: 16,
    color: "#222",
    flexShrink: 1,
  },
  valor: {
    fontSize: 20,
    marginLeft: 2,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  lucro: {
    marginBottom: 35,
    fontSize: 16,
    color: "#24983fff"
  },
  resgatarBtn: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  }
});
