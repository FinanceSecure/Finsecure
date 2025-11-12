import { InvestimentoService } from "@/services/invService";
import { Feather } from "@expo/vector-icons";
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


export default function ResgatarInvestimento() {
  const router = useRouter();
  const { id, nome, valor } = useLocalSearchParams<{
    id: string;
    nome: string;
    valor: string;
  }>();
  const [valorResgate, setValorResgate] = useState("");

  async function handleResgate() {
    try {
      if (!valorResgate || parseFloat(valorResgate) <= 0) {
        alert("Insira um valor de válido para resgate.");
        return;
      }

      await InvestimentoService.resgatarInvestimento(
        id,
        parseFloat(valorResgate)
      );
      router.replace('/invest/investimento');
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace(`/invest/investimento`)}>
        <View style={styles.rowback}>
          <Feather size={30} name="arrow-left" />
          <Text style={styles.text}>Voltar</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.cardContainer}>
        <Text >{nome}</Text>
        <Text >
          Valor disponível: {Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Valor a resgatar"
          keyboardType="numeric"
          value={valorResgate}
          onChangeText={setValorResgate}
        />
        <TouchableOpacity style={styles.btn} onPress={handleResgate}>
          <Text style={styles.btnText}>Resgatar Investimento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 16,
    backgroundColor: '#fff'
  },
  rowback: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  btn: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginTop: 20
  }
});
