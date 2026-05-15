import { Colors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface SettingItemProps {
  icon: string;
  label: string;
  description: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  badge?: string;
  badgeColor?: string;
}

export const SettingItem = ({
  icon,
  label,
  description,
  onPress,
  isLoading = false,
  disabled = false,
  badge,
  badgeColor = Colors.investimento,
}: SettingItemProps) => {
  const isClickable = !!onPress && !isLoading && !disabled;

  return (
    <TouchableOpacity
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
      onPress={onPress}
      disabled={!isClickable}
      activeOpacity={isClickable ? 0.7 : 1}
    >
      <View style={styles.content}>
        <Ionicons name={icon as any} size={20} color={Colors.primary} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          isClickable && <Ionicons name="chevron-forward" size={20} color={Colors.text_muted} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.text_muted,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
});
