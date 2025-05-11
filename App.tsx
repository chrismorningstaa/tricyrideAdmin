import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import AdminDashboardScreen from './src/app/screens/AdminDashboardScreen';
import ManageDriversScreen from './src/app/screens/ManageDriversScreen';
import MonitorRidesScreen from './src/app/screens/MonitorRidesScreen';
import ReportsScreen from './src/app/screens/ReportsScreen';
import SupportScreen from './src/app/screens/SupportScreen';
import AccountsScreen from './src/app/screens/AccountsScreen';

import { RootTabParamList } from './src/types/rootTabsList';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#283618',
            tabBarInactiveTintColor: '#606c38',
            tabBarStyle: {
              backgroundColor: '#fefae0',
              borderTopColor: '#dda15e',
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 5,
              paddingTop: 5,
            },
            headerStyle: {
              backgroundColor: '#fefae0',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#dda15e',
            },
            headerTitleStyle: {
              color: '#283618',
              fontWeight: 'bold',
            },
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={AdminDashboardScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
              title: 'Home',
            }}
          />
          <Tab.Screen
            name="ManageDrivers"
            component={ManageDriversScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people" color={color} size={size} />
              ),
              title: 'Drivers',
            }}
          />
          <Tab.Screen
            name="MonitorRides"
            component={MonitorRidesScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="navigate" color={color} size={size} />
              ),
              title: 'Rides',
            }}
          />
          <Tab.Screen
            name="Reports"
            component={ReportsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bar-chart" color={color} size={size} />
              ),
              title: 'Reports',
            }}
          />
          <Tab.Screen
            name="Support"
            component={SupportScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="help-buoy" color={color} size={size} />
              ),
              title: 'Support',
            }}
          />
          <Tab.Screen
            name="Accounts"
            component={AccountsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="shield" color={color} size={size} />
              ),
              title: 'Accounts',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}