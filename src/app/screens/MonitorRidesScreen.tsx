import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Trip } from '../../types/rootTabsList';

// Mock data for development
const mockTrips: Trip[] = [
  {
    id: '1',
    driverId: '1',
    driverName: 'Juan Dela Cruz',
    riderId: '1',
    riderName: 'Ana Santos',
    pickupLocation: '#043 Brgy. Bagbag 1 Tanauan City, Batangas',
    dropoffLocation: 'Brgy Hall, Bagbag 2 Tanauan City',
    status: 'ongoing',
    fare: 100,
    distance: '2.5 km',
    duration: '15 min',
    startTime: '2025-05-10T09:15:00',
    endTime: undefined,
  },
  {
    id: '2',
    driverId: '2',
    driverName: 'Pedro Santos',
    riderId: '2',
    riderName: 'Ben Reyes',
    pickupLocation: 'Brgy. Bagbag 1 Tanauan City',
    dropoffLocation: '#111 Brgy. Bagbag 2 Tanauan City, Batangas',
    status: 'ongoing',
    fare: 85,
    distance: '1.8 km',
    duration: '10 min',
    startTime: '2025-05-10T09:08:00',
    endTime: undefined,
  },
  {
    id: '3',
    driverId: '3',
    driverName: 'Maria Garcia',
    riderId: '3',
    riderName: 'Clara Tan',
    pickupLocation: '#111 Brgy. Bagbag 2 Tanauan City, Batangas',
    dropoffLocation: 'Brgy. Bagbag 1 Tanauan City',
    status: 'completed',
    fare: 120,
    distance: '3.2 km',
    duration: '18 min',
    startTime: '2025-05-10T08:45:00',
    endTime: '2025-05-10T09:03:00',
  },
  {
    id: '4',
    driverId: '1',
    driverName: 'Juan Dela Cruz',
    riderId: '4',
    riderName: 'David Cruz',
    pickupLocation: 'Brgy Hall, Bagbag 2 Tanauan City',
    dropoffLocation: '#043 Brgy. Bagbag 1 Tanauan City, Batangas',
    status: 'completed',
    fare: 90,
    distance: '2.1 km',
    duration: '12 min',
    startTime: '2025-05-10T08:30:00',
    endTime: '2025-05-10T08:42:00',
  },
  {
    id: '5',
    driverId: '5',
    driverName: 'Antonio Lim',
    riderId: '2',
    riderName: 'Ben Reyes',
    pickupLocation: 'Brgy. Bagbag 1 Tanauan City',
    dropoffLocation: '#111 Brgy. Bagbag 2 Tanauan City, Batangas',
    status: 'cancelled',
    fare: 0,
    distance: '2.8 km',
    duration: '0 min',
    startTime: '2025-05-10T08:25:00',
    endTime: '2025-05-10T08:27:00',
  },
];

export default function MonitorRidesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  // In a real app, this would fetch data from an API
  const fetchTrips = async () => {
    // Simulate API call
    setRefreshing(true);
    setTimeout(() => {
      setTrips(mockTrips);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    fetchTrips();
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         trip.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTripPress = (trip: Trip) => {
    setSelectedTrip(selectedTrip?.id === trip.id ? null : trip);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity 
      style={[styles.tripCard, selectedTrip?.id === item.id && styles.selectedCard]} 
      onPress={() => handleTripPress(item)}
    >
      <View style={styles.tripHeader}>
        <View>
          <Text style={styles.tripId}>Trip #{item.id}</Text>
          <Text style={styles.timestamp}>
            {formatTime(item.startTime)}
            {item.endTime ? 
              ` - ${formatTime(item.endTime)}` : 
              ' (In Progress)'}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          item.status === 'ongoing' ? styles.statusOngoing : 
          item.status === 'completed' ? styles.statusCompleted : 
          styles.statusCancelled
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.tripDetails}>
        <View style={styles.personDetail}>
          <Ionicons name="car" size={16} color="#606c38" />
          <Text style={styles.personText}>{item.driverName}</Text>
        </View>
        <View style={styles.personDetail}>
          <Ionicons name="person" size={16} color="#606c38" />
          <Text style={styles.personText}>{item.riderName}</Text>
        </View>
      </View>
      
      <View style={styles.locationContainer}>
        <View style={styles.locationDetail}>
          <View style={styles.locationIcon}>
            <Ionicons name="radio-button-on" size={14} color="#283618" />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>{item.pickupLocation}</Text>
        </View>
        <View style={styles.locationDivider} />
        <View style={styles.locationDetail}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={14} color="#dda15e" />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>{item.dropoffLocation}</Text>
        </View>
      </View>
      
      {selectedTrip?.id === item.id && (
        <View style={styles.expandedDetails}>
          <View style={styles.tripInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{item.distance}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{item.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fare</Text>
              <Text style={styles.infoValue}>₱{item.fare.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            {item.status === 'ongoing' && (
              <>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call" size={16} color="#fff" />
                  <Text style={styles.actionText}>Contact Driver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.trackButton]}>
                  <Ionicons name="locate" size={16} color="#fff" />
                  <Text style={styles.actionText}>Track</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={[styles.actionButton, styles.detailsButton]}>
              <Ionicons name="information-circle" size={16} color="#fff" />
              <Text style={styles.actionText}>Full Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Monitor Rides</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={22} color="#283618" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#606c38" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search rides..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#606c38"
        />
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by status:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, statusFilter === 'all' && styles.activeFilter]}
            onPress={() => setStatusFilter('all')}
          >
            <Text style={[styles.filterText, statusFilter === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, statusFilter === 'ongoing' && styles.activeFilter]}
            onPress={() => setStatusFilter('ongoing')}
          >
            <Text style={[styles.filterText, statusFilter === 'ongoing' && styles.activeFilterText]}>Ongoing</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, statusFilter === 'completed' && styles.activeFilter]}
            onPress={() => setStatusFilter('completed')}
          >
            <Text style={[styles.filterText, statusFilter === 'completed' && styles.activeFilterText]}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, statusFilter === 'cancelled' && styles.activeFilter]}
            onPress={() => setStatusFilter('cancelled')}
          >
            <Text style={[styles.filterText, statusFilter === 'cancelled' && styles.activeFilterText]}>Cancelled</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{trips.filter(t => t.status === 'ongoing').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{trips.filter(t => t.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{trips.filter(t => t.status === 'cancelled').length}</Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>
      </View>
      
      <FlatList
        data={filteredTrips}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#606c38']}
            tintColor="#606c38"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={60} color="#dda15e" />
            <Text style={styles.emptyText}>No rides found</Text>
            <Text style={styles.emptySubText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'Try changing your search or filters' 
                : 'All rides will appear here'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefae0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#283618',
  },
  refreshButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#283618',
  },
  filterContainer: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  filterLabel: {
    color: '#283618',
    fontWeight: '500',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dda15e',
  },
  activeFilter: {
    backgroundColor: '#dda15e',
  },
  filterText: {
    color: '#606c38',
    fontSize: 12,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  statItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#283618',
  },
  statLabel: {
    fontSize: 12,
    color: '#606c38',
    marginTop: 4,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 24,
  },
  tripCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCard: {
    borderColor: '#dda15e',
    borderWidth: 1,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripId: {
    fontWeight: 'bold',
    color: '#283618',
    fontSize: 16,
  },
  timestamp: {
    color: '#606c38',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusOngoing: {
    backgroundColor: '#3498db',
  },
  statusCompleted: {
    backgroundColor: '#94af76',
  },
  statusCancelled: {
    backgroundColor: '#e07a5f',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  personDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personText: {
    marginLeft: 6,
    color: '#283618',
    fontSize: 14,
  },
  locationContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  locationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  locationIcon: {
    width: 20,
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    color: '#606c38',
    fontSize: 13,
  },
  locationDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 6,
    marginLeft: 20,
  },
  expandedDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#606c38',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#283618',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#606c38',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  trackButton: {
    backgroundColor: '#dda15e',
  },
  detailsButton: {
    backgroundColor: '#283618',
  },
  actionText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#606c38',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});