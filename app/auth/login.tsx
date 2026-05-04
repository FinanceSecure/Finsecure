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
      router.push("/dashboard");
    } catch (error: any) {
      Alert.alert("Erro ao realizar login", error.message || "Ocorreu um erro inesperado");
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <InputField
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
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
            size={22}
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
        <Text style={styles.textLinkArea}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={handleCadastroRedirect} disabled={isLoading}>
          <Text style={styles.link}>Cadastre-se</Text>
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
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 32,
    color: Colors.text,
    marginBottom: 40,
    fontWeight: "bold",
    textAlign: 'center',
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    position: 'relative',
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 10,
  },
  linkArea: {
    flexDirection: "row",
    marginTop: 25,
  },
  textLinkArea: {
    color: Colors.placeholder,
    fontSize: 14,
  },
  link: {
    color: Colors.link,
    fontWeight: "bold",
    fontSize: 14,
  },
});
