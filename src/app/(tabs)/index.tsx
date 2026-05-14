import { Colors } from '@constants/theme';
import { TokenService } from '@data/services/authService';
import { DashboardData, FinanceService } from '@data/services/financeService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [userName, setUserName] = useState('Usuário');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    try {
      const userData = await TokenService.getUserToken();
      if (userData) {
        setUserName(userData.name.split(' ')[0]);
      }
      const summary = await FinanceService.getDashboardSummary();
      setData(summary);
    } catch (error) {
      console.log("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = async () => {
    await TokenService.removeToken();
    router.replace('/auth/login');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            tintColor={Colors.primary}
          />
        }>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {userName}!</Text>
            <Text style={styles.brand}>FinSecure 🛡️</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={Colors.logout} />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo Total</Text>
          <Text style={styles.balanceValue}>
            R$ {data?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.miniCard, { borderColor: Colors.receita + '40' }]}>
            <Text style={styles.miniLabel}>Receitas</Text>
            <Text style={[styles.cardValue, { color: Colors.receita }]}>
              R$ {data?.incomes.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.miniCard, { borderColor: Colors.despesa + '40' }]}>
            <Text style={styles.miniLabel}>Despesas</Text>
            <Text style={[styles.cardValue, { color: Colors.despesa }]}>
              R$ {data?.expenses.toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.investCard}
          onPress={() => {
            router.push("/investments");
          }}
          activeOpacity={0.7}
        >
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.investLabel}>Total Investido</Text>
              <Text style={[styles.investValue, { color: Colors.investimento }]}>
                R$ {data?.totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.investimento} />
          </View>
          <Text style={styles.investActionText}>Toque para ver opções e simular</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Últimas Transações</Text>

        {data?.recentTransactions.map((item, index) => (
          <View key={index} style={styles.transactionCard}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.transTitle}>{item.title}</Text>
                <Text style={styles.transDate}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[
                styles.transAmount,
                { color: item.type === 'INCOME' ? Colors.receita : Colors.despesa }
              ]}>
                {item.type === 'INCOME' ? '+ ' : '- '}
                R$ {Math.abs(item.amount).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("./addTransaction")}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 25
  },
  greeting: {
    color: Colors.text_muted,
    fontSize: 16
  },
  brand: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 22
  },
  logoutButton: {
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: 10
  },
  balanceContainer: {
    marginBottom: 30
  },
  balanceLabel: {
    color: Colors.text_muted,
    fontSize: 14
  },
  balanceValue: {
    color: Colors.text,
    fontSize: 38,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  miniCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1
  },
  miniLabel: {
    color: Colors.text_muted,
    fontSize: 12,
    marginBottom: 4
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  investCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: Colors.investimento,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  investLabel: {
    color: Colors.text_muted,
    fontSize: 14
  },
  investValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4
  },
  investActionText: {
    color: Colors.text_muted,
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic'
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15
  },
  transactionCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  transTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '500'
  },
  transDate: {
    color: Colors.text_muted,
    fontSize: 12,
    marginTop: 4
  },
  transAmount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: Colors.button,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65
  }
});
