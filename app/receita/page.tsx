import { RendaVariavelItem } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SaldoService } from "../../services/saldoService";

export default function ReceitaPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [rendaFixa, setRendaFixa] = useState<any>(null);
  const [outros, setOutros] = useState<RendaVariavelItem[]>([]);

  async function carregar() {
    try {
      const receitas = await SaldoService.verificarReceitas();
      const RF = await SaldoService.verificarRendaFixa();

      setRendaFixa(RF?.rendaFixa ?? RF ?? null);
      setOutros(receitas?.detalhes?.outros || []);
    } catch (err) {
      console.log(err);
    } finally {
      setCarregando(false);
    }
  }

  async function removerRendaFixa() {
    await SaldoService.deletarRendaFixa();
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="arrow-left" size={25} />
      </TouchableOpacity>

      <FlatList
        data={outros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/receita/RVariavelForm",
                params: {
                  id: item.id,
                  descricao: item.descricao,
                  valor: String(item.valor),
                },
              })
            }
          >
            <Text style={{ fontSize: 16 }}>{item.descricao}</Text>
            <Text>R$ {Number(item.valor).toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>
              Receitas
            </Text>

            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text>Renda Fixa: {rendaFixa?.valor ?? rendaFixa ?? 0}</Text>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  {!rendaFixa && (
                    <TouchableOpacity
                      onPress={() => router.push("/receita/RFixaForm")}
                    >
                      <Feather name="plus" size={20} color="green" />
                    </TouchableOpacity>
                  )}

                  {rendaFixa && (
                    <>
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/receita/RFixaForm",
                            params: {
                              valor: String(
                                rendaFixa?.valor ?? rendaFixa
                              ),
                            },
                          })
                        }
                      >
                        <Feather name="edit" size={20} color="blue" />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={removerRendaFixa}>
                        <Feather name="trash" size={20} color="red" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.linha_divisoria} />

            <View style={styles.rowBetween}>
              <Text style={{ fontSize: 18 }}>
                Rendas Variáveis
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/receita/RVariavelForm")}
              >
                <Feather name="plus" size={20} color="green" />
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            Nenhuma renda variável cadastrada.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = {
  card: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  linha_divisoria: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 15,
  }
};
