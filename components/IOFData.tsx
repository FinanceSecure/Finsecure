import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const IOFData: React.FC = () => {
  const showAlert = () => {
    Alert.alert(
      "Detalhes do IOF",
      "O IOF é um imposto federal cobrado sobre operações financeiras, é aplicado sobre o rendimento bruto dos investimentos resgatados em prazos curtos. \n\n" +
      "A alíquota varia conforme o tipo de investimento e o prazo de resgate, a máxima é de 96% para resgates no mesmo dia, diminuindo até 0% após 30 dias. \n\n" +
      "Exemplos :\n" +
      "- Resgate em até 1 dia: 96%\n" +
      "- Resgate em até 7 dias: 70%\n" +
      "- Resgate em até 15 dias: 32%\n" +
      "- Resgate em até 30 dias: 0%",
      [{ text: 'Fechar', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imposto sobre Operações Financeiras (IOF)</Text>
      <TouchableOpacity style={styles.infoBtn} onPress={showAlert}>
        <Text style={styles.infoText}>i</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  infoBtn: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 20,
    right: 20
  },
  infoText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold"
  }
})