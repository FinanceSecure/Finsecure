import { ChartLegendItem } from "@/components/ChartLegendItem";
import { Colors } from "@/constants/theme";
import { ChartDataItem } from "@/types";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from 'react-native-chart-kit';

interface ChartCardProps {
  data: ChartDataItem[];
}

const screenWidth = Dimensions.get("window").width;
const chartConfig = {
  backgroundGradientFrom: Colors.background,
  backgroundGradientTo: Colors.background,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export function ChartCard({ data }: ChartCardProps) {
  const hasData = data.length > 0;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>📊 Comparativo</Text>
      {hasData ? (
        <>
          <PieChart
            data={data}
            width={screenWidth - 50}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
          />
          <View>
            <Text>Legenda:</Text>
            <View style={styles.legendRow}>
              {data.map((item, index) => (
                <ChartLegendItem
                  key={index}
                  color={item.color}
                  name={item.legenda}
                />
              ))}
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.loadingChartText}>
          Dados insuficientes para geração do gráfico.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.card_background,
    shadowColor: Colors.card_shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.text,
  },
  loadingChartText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    marginBottom: 15
  },
  legendWrapper: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 15
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.text
  },
  legendRow: {
    flexDirection:"row",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  }
});
