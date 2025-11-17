import { DespesaService } from "@/services/despesaService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DespesaForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [descricao, setDescricao] = useState(
    Array.isArray(params.descricao) ? params.descricao[0] : params.descricao ?? ""
  );

  const [valor, setValor] = useState(
    Array.isArray(params.valor) ? params.valor[0] : params.valor ?? ""
  );

  const [categoria, setCategoria] = useState(
    Array.isArray(params.categoria) ? params.categoria[0] : params.categoria ?? ""
  );

  async function salvar() {
    if (!descricao || !valor || !categoria) {
      return Alert.alert("Erro", "Preencha todos os campos.");
    }

    try {
      if (id) {
        await DespesaService.atualizarDespesa(id, {
          descricao,
          valor: Number(valor),
          categoria,
        });
      } else {
        await DespesaService.criarDespesa({
          descricao,
          valor: Number(valor),
          categoria,
        });
      }

      router.back();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.rowBack}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>{"< Voltar"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>
        {id ? "Editar Despesa" : "Nova Despesa"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={categoria}
        onChangeText={setCategoria}
      />
      <TouchableOpacity style={styles.btnSalvar} onPress={salvar}>
        <Text style={styles.textSalvar}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60
  },
  rowBack: {
    marginVertical: 20
  },
  voltar: {
    fontSize: 16,
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  btnSalvar: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textSalvar: {
    color: "#fff",
    fontSize: 16,
  },
});
