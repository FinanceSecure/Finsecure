import { InputField } from "@/components/InputField";
import { AuthService } from "@/services/authService";
import { AuthResponse } from "@/types/AuthTypes";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const result: AuthResponse = await AuthService.login(email, senha);
      if (!result.token) {
        throw new Error("Token não recebido.");
      }
      Alert.alert("Bem sucedido!", result.mensagem || "Login realizado com sucesso.");
      console.log("Redirecionando para o dashboard...");
      router.push("/dashboard");
    } catch (error: any) {
      Alert.alert("Erro ao realizar login", error.message || "Ocorreu um erro inesperado");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <InputField
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordInput}>
        <InputField
          placeholder="Digite sua senha"
          placeholderTextColor={"#888"}
          secureTextEntry={hidePassword}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Ionicons
            name={hidePassword ? "eye-off" : "eye"}
            size={24}
            color="#444111"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <View style={styles.linkArea}>
        <Text style={styles.textLinkArea}> Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/cadastrar")}>
          <Text style={styles.link}> Cadastre-se </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: "#333",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#121212",
    borderRadius: 5,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flexDirection: "row",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  },
});
