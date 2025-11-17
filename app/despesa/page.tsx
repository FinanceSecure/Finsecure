import { DespesaService } from "@/services/despesaService";
import { Despesa } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function DespesaPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  async function carregar() {
    try {
      const data = await DespesaService.listarDespesas();
      setDespesas(data.detalhes.despesas || []);
    } catch (err) {
      console.log(err);
    } finally {
      setCarregando(false);
    }
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
      <TouchableOpacity onPress={() => { router.back() }}>
        <Feather name="arrow-left" size={25} />
      </TouchableOpacity>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Despesas</Text>

      <FlatList
        data={despesas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: "#eee",
              borderRadius: 10,
              marginBottom: 10,
            }}
            onPress={() =>
              router.push({
                pathname: "/despesa/form",
                params: {
                  id: item.id,
                  descricao: item.descricao,
                  valor: item.valor.toString(),
                  categoria: item.categoria,
                },
              })
            }
          >
            <Text style={{ fontSize: 16 }}>{item.descricao}</Text>
            <Text>R$ {item.valor}</Text>
            <Text style={{ color: "#555" }}>{item.categoria}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            Nenhuma despesa cadastrada.
          </Text>
        }
      />

      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 20,
        }}
        onPress={() => router.push("/despesa/form")}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Adicionar Despesa</Text>
      </TouchableOpacity>
    </View>
  );
}
