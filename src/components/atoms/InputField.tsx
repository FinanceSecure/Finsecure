import { Colors, Radius } from "@constants/theme";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View
} from "react-native";

export const InputField = (props: TextInputProps) => {
  return (
    <View style={styles.inputArea}>
      <TextInput
        style={[styles.input, props.style]}
        placeholderTextColor={Colors.placeholder}
        autoCorrect={false}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputArea: {
    width: "100%",
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 15,
    borderRadius: Radius.medium,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.input,
  },
});
