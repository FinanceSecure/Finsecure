import { Colors } from "@/constants/theme";
import { FormatarMoeda } from "@/utils/formatters";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface InvestimentoCardProps {
  valorTotalInvestido: number;
  lucroLiquido: number;
  isLoading: boolean;
}

export function InvestimentoCard({
  valorTotalInvestido,
  lucroLiquido,
  isLoading
}: InvestimentoCardProps) {
  const totalFormatado = FormatarMoeda(valorTotalInvestido);
  const lucroFormatado = FormatarMoeda(lucroLiquido);
  const loadingText = FormatarMoeda(0);

  return (
    <View style={styles.investimentoContainer}>
      <View style={styles.iconInvestimento}>
        <Feather name="trending-up" size={26} color="#4CAF50" />
        <Text style={styles.titulo}>Investimentos</Text>
        <View style={styles.valorInvestimentoContainer}>
          <Text style={styles.lucroLiquido}>
            {isLoading ? "..." : `${lucroFormatado}`}
          </Text>
          <Text style={styles.valorTotal}>
            {isLoading ? "..." : `${totalFormatado}`}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  investimentoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: Colors.card_background,
    shadowColor: Colors.card_shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconInvestimento: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 20,
    marginBottom: 20
  },
  titulo: {
    fontSize: 20,
    color: '#333',
    marginLeft: 10,
  },
  valorInvestimentoContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "relative",
    paddingRight: 55,
  },
  lucroLiquido: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 14,
    color: Colors.receita,
    fontWeight: "500",
  },
  valorTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    color: Colors.text
  },
});
