import { Colors } from "@/constants/theme";
import { FormatarMoeda } from "@/utils/formatters";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface SummaryCardProps {
  receita: number;
  despesa: number;
  isLoading: boolean;
}

export function SummaryCard({ receita, despesa, isLoading }: SummaryCardProps) {
  const receitaFormatada = FormatarMoeda(receita);
  const despesaFormatada = FormatarMoeda(despesa);
  const loadingText = "Carregando...";
  const router = useRouter();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.item}>
        <Feather name="arrow-up-circle" size={24} color={Colors.receita} />
        <TouchableOpacity onPress={() => router.push('/receita/page')}>
          <Text style={styles.titulo}>Receita</Text>
          <Text style={[styles.valor, { color: Colors.receita }]}>
            {isLoading ? loadingText : receitaFormatada}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.item}>
        <Feather name="arrow-up-circle" size={24} color={Colors.despesa} />
        <TouchableOpacity onPress={() => router.push('/despesa/page')}>
          <Text style={styles.titulo}>Despesa</Text>
          <Text style={[styles.valor, { color: Colors.despesa }]}>
            {isLoading ? loadingText : despesaFormatada}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: Colors.card_background,
    shadowColor: Colors.card_shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  titulo: {
    fontSize: 20,
    color: '#333',
    marginTop: 4,
    paddingHorizontal: 10
  },
  valor: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
    color: Colors.text
  },
  separator: {
    width: 1,
    height: '90%',
    backgroundColor: '#E0E0E0',
  },
});
