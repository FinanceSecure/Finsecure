import { StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Dashboard!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
});
