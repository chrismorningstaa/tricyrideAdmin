import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AdminStats } from '../../types/rootTabsList';

// Mock data for demonstration
const mockStats: AdminStats = {
  activeDrivers: 42,
  totalDrivers: 58,
  activeRides: 8,
  totalRidesCompleted: 1245,
  totalRiders: 634,
  openTickets: 5,
  totalRevenue: 24650,
  todayRevenue: 850,
};

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<AdminStats>(mockStats);
  const navigation = useNavigation();

  // In a real app, you would fetch this data from an API
  useEffect(() => {
    // Simulating API call
    const fetchStats = async () => {
      // Replace with actual API call in production
      setStats(mockStats);
    };

    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome, Admin</Text>
          <Text style={styles.subtitle}>Tricyride Dashboard</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={24} color="#283618" />
            </View>
            <View>
              <Text style={styles.statValue}>{stats.activeDrivers}/{stats.totalDrivers}</Text>
              <Text style={styles.statLabel}>Active Drivers</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="navigate" size={24} color="#283618" />
            </View>
            <View>
              <Text style={styles.statValue}>{stats.activeRides}</Text>
              <Text style={styles.statLabel}>Active Rides</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trail-sign" size={24} color="#283618" />
            </View>
            <View>
              <Text style={styles.statValue}>{stats.totalRidesCompleted}</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="person" size={24} color="#283618" />
            </View>
            <View>
              <Text style={styles.statValue}>{stats.totalRiders}</Text>
              <Text style={styles.statLabel}>Total Riders</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.revenueCard}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.revenueStats}>
            <View style={styles.revenueStat}>
              <Text style={styles.revenueLabel}>Today</Text>
              <Text style={styles.revenueValue}>₱{stats.todayRevenue.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.revenueStat}>
              <Text style={styles.revenueLabel}>Total</Text>
              <Text style={styles.revenueValue}>₱{stats.totalRevenue.toLocaleString()}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('ManageDrivers' as never)}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="people" size={24} color="#fefae0" />
            </View>
            <Text style={styles.actionText}>Manage Drivers/Riders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('MonitorRides' as never)}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="navigate" size={24} color="#fefae0" />
            </View>
            <Text style={styles.actionText}>Monitor Rides</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Reports' as never)}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="bar-chart" size={24} color="#fefae0" />
            </View>
            <Text style={styles.actionText}>Generate Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Support' as never)}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="help-buoy" size={24} color="#fefae0" />
            </View>
            <Text style={styles.actionText}>Handle Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Accounts' as never)}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="shield" size={24} color="#fefae0" />
            </View>
            <Text style={styles.actionText}>Suspend Accounts</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <Ionicons name="warning" size={24} color="#dda15e" />
            <Text style={styles.alertTitle}>Alerts</Text>
          </View>
          <View style={styles.alertItem}>
            <Ionicons name="alert-circle" size={18} color="#606c38" />
            <Text style={styles.alertText}>{stats.openTickets} open support tickets require attention</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefae0',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#283618',
  },
  subtitle: {
    fontSize: 16,
    color: '#606c38',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    backgroundColor: '#fefae0',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
  },
  statLabel: {
    fontSize: 12,
    color: '#606c38',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
    marginBottom: 12,
    marginTop: 8,
  },
  revenueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  revenueStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  revenueStat: {
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 14,
    color: '#606c38',
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#283618',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#dda15e',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#606c38',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    backgroundColor: '#283618',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fefae0',
  },
  alertContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#dda15e',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#283618',
    marginLeft: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#606c38',
    marginLeft: 8,
  },
});