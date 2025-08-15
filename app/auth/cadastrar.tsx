import { InputField } from "@/components/InputField";
import { AuthService } from "@/services/authService";
import { AuthResponse } from "@/types/AuthTypes";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const result: AuthResponse = await AuthService.cadastrar(email, senha);
      if (!result.token) {
        throw new Error("Token não recebido.");
      }
      Alert.alert("Bem sucedido!", result.mensagem || "Cadastro realizado com sucesso.");
      console.log("Redirecionando para o login...");
      router.push("/auth/login");
    } catch (error: any) {
      Alert.alert("Erro ao realizar cadastro", error.message || "Ocorreu um erro inesperado");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <InputField
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <InputField
        placeholder="Seobrenome"
        value={sobrenome}
        onChangeText={setSobrenome}
      />
      <InputField
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        placeholder="Digite sua senha"
        placeholderTextColor={"#888"}
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <View style={styles.linkArea}>
        <Text style={styles.textLinkArea}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.link}> Faça login </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  button: {
    backgroundColor: "#007BFF",
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  linkArea: {
    flexDirection: "row",
    marginTop: 20,
  },
  textLinkArea: {
    color: "#333333",
  },
  link: {
    color: "#0066cc",
    fontWeight: "bold",
  }
});
