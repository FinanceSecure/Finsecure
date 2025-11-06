import { StyleSheet, Text, View } from "react-native";

interface ChartLegendItemProps {
  color: string;
  name: string;
}

export function ChartLegendItem({ color, name }: ChartLegendItemProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.colorBox, { backgroundColor: color }]} />
      <Text style={styles.legendItem}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5
  },
  colorBox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6
  },
  legendText: {
    fontSize: 12,
    color: "#333"
  }
})
