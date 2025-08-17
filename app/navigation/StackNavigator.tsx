import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Cadastrar from "../auth/cadastrar";
import Login from "../auth/login";
import Dashboard from "../dashboard";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="CadastroScreen"
        component={Cadastrar}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}
