import { ReceitaService } from "@/services/receitaService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function RVariavelForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const desc = Array.isArray(params.descricao) ? params.descricao[0] : params.descricao;
  const val = Array.isArray(params.valor) ? params.valor[0] : params.valor;

  const [descricao, setDescricao] = useState(desc ?? "");
  const [valor, setValor] = useState(val ?? "");

  async function salvar() {
    if (!valor || !descricao) {
      return Alert.alert("Erro", "Preencha todos os campos.");
    }

    try {
      if (id) {
        await ReceitaService.atualizarRendaVariavel({
          id,
          descricao,
          valor: Number(valor),
        });
      } else {
        await ReceitaService.criarRendaVariavel({
          descricao,
          valor: Number(valor),
        });
      }

      router.back();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.voltar}>{"< Voltar"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {id ? "Editar Renda Variável" : "Nova Renda Variável"}
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
