import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SaldoService } from "../../services/saldoService";

export default function RendaFixaForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEdit = !!params.valor;
  const [valor, setValor] = useState(params.valor ? String(params.valor) : "");

  async function salvar() {
    if (!valor || isNaN(Number(valor)) || Number(valor) <= 0) {
      return Alert.alert("Erro", "Informe um valor válido maior que zero.");
    }

    try {
      if (isEdit) {
        await SaldoService.editarRendaFixa(Number(valor));
      } else {
        await SaldoService.adicionarRendaFixa(Number(valor));
      }

      router.push("/receita/page");
    } catch (err) {
      Alert.alert("Erro ao salvar", "Houve um erro ao salvar a renda fixa.");
    }
  }

  useEffect(() => {
    if (params.valor) {
      setValor(params.valor.toString());
    }
  }, [params.valor]);

  return (
    <View style={styles.container}>
      <View style={styles.rowback}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather size={26} name="arrow-left" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>
        {isEdit ? "Editar Renda Fixa" : "Adicionar Renda Fixa"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={{ color: "#fff" }}>
          {isEdit ? "Salvar Alterações" : "Adicionar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20
  },
  rowback: {
    marginVertical: 20
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
    marginBottom: 20
  },
  button: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },
});
