import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  secure?: boolean;
}

export const InputField = ({ secure = false, ...props }: InputFieldProps) => {
  return (
    <View style={styles.inputArea}>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.placeholder}
        secureTextEntry={secure}
        autoCorrect={false}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputArea: {
    width: "100%",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border || "#1A1D23",
    paddingHorizontal: 15,
    borderRadius: 12,
    marginVertical: 8,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card_background,
    elevation: 0,
    shadowOpacity: 0,
  },
});
