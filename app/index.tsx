import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const auth = "/auth"
  return (
    <View style={styles.container}>
      <Link style={styles.link} href={`${auth}/login`}>Login</Link>
      {/* <Link style={styles.link} href={`${auth}/cadastrar`}>Cadastrar</Link> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#130421ff',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
  link: {
    color: '#c3d0dfff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
