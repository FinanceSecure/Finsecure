import { InputField } from "@/components/InputField";
import LoadingAnimation from "@/components/LoadingAnimation";
import { Colors } from "@/constants/theme";
import { AuthService, TokenService } from "@/services/authService";
import { AuthResponse } from "@/types/AuthTypes";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const handleCadastroRedirect = () => router.push("/auth/cadastrar");
  const handleLogin = async () => {
    if (!email || !senha)
      return Alert.alert("Erro", "Por favor, preencha todos os campos.");

    setIsLoading(true);
    try {
      const result: AuthResponse = await AuthService.login(email, senha);
      if (!result.token)
        throw new Error("Token não recebido.");

      await TokenService.setToken(result.token);

      Alert.alert("Bem sucedido!", result.mensagem || "Login realizado com sucesso.");
      router.push("/dashboard");
    } catch (error: any) {
      Alert.alert("Erro ao realizar login", error.message || "Ocorreu um erro inesperado");
      setIsLoading(false)
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
          secureTextEntry={hidePassword}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setHidePassword(!hidePassword)}
          disabled={isLoading}
        >
          <Ionicons
            name={hidePassword ? "eye-off" : "eye"}
            size={24}
            color={Colors.icon}
          />
        </TouchableOpacity>
      </View>
      <LoadingAnimation
        isLoading={isLoading}
        onPress={handleLogin}
        buttonText="Entrar"
      />
      <View style={styles.linkArea}>
        <Text style={styles.textLinkArea}> Não tem uma conta? </Text>
        <TouchableOpacity onPress={handleCadastroRedirect} disabled={isLoading}>
          <Text style={styles.link}> Cadastre-se </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    color: Colors.white,
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
  linkArea: {
    flexDirection: "row",
    marginTop: 20,
  },
  textLinkArea: {
    color: Colors.text,
  },
  link: {
    color: Colors.link,
    fontWeight: "bold",
  },
});
