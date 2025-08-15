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
        placeholderTextColor={"#888"}
        secureTextEntry={secure}
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
    borderColor: "#ccc",
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 16,
  },
});
