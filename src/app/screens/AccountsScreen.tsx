import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Driver, Rider } from '../../types/rootTabsList';

// Mock data for development
const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'John Smith',
    age: 35,
    plateNumber: 'XYZ-123',
    rating: 4.8,
    status: 'active',
    contactNumber: '+1234567890',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    totalTrips: 358,
    dateJoined: '2023-11-12',
  },
  {
    id: 'D002',
    name: 'Maria Garcia',
    age: 28,
    plateNumber: 'ABC-456',
    rating: 4.9,
    status: 'active',
    contactNumber: '+1234567891',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    totalTrips: 245,
    dateJoined: '2024-01-15',
  },
  {
    id: 'D003',
    name: 'Robert Chen',
    age: 42,
    plateNumber: 'DEF-789',
    rating: 4.5,
    status: 'inactive',
    contactNumber: '+1234567892',
    totalTrips: 189,
    dateJoined: '2023-09-22',
  },
  {
    id: 'D004',
    name: 'Sarah Johnson',
    age: 31,
    plateNumber: 'GHI-101',
    rating: 4.7,
    status: 'suspended',
    contactNumber: '+1234567893',
    profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
    totalTrips: 412,
    dateJoined: '2023-08-05',
  },
  {
    id: 'D005',
    name: 'David Kim',
    age: 37,
    plateNumber: 'JKL-112',
    rating: 4.6,
    status: 'active',
    contactNumber: '+1234567894',
    profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
    totalTrips: 278,
    dateJoined: '2023-12-10',
  },
];

const mockRiders: Rider[] = [
  {
    id: 'R001',
    name: 'Emma Wilson',
    contactNumber: '+1987654320',
    email: 'emma.wilson@example.com',
    totalTrips: 45,
    dateJoined: '2023-10-05',
    status: 'active'
  },
  {
    id: 'R002',
    name: 'James Brown',
    contactNumber: '+1987654321',
    email: 'james.brown@example.com',
    totalTrips: 32,
    dateJoined: '2023-11-18',
    status: 'active'
  },
  {
    id: 'R003',
    name: 'Olivia Martinez',
    contactNumber: '+1987654322',
    email: 'olivia.m@example.com',
    totalTrips: 67,
    dateJoined: '2023-09-30',
    status: 'suspended'
  },
  {
    id: 'R004',
    name: 'Michael Lee',
    contactNumber: '+1987654323',
    email: 'michael.lee@example.com',
    totalTrips: 23,
    dateJoined: '2024-01-22',
    status: 'active'
  },
  {
    id: 'R005',
    name: 'Sophia Taylor',
    contactNumber: '+1987654324',
    email: 'sophia.t@example.com',
    totalTrips: 12,
    dateJoined: '2024-02-14',
    status: 'active'
  },
];

type UserType = 'driver' | 'rider';
type StatusFilter = 'all' | 'active' | 'inactive' | 'suspended';

type AccountItemType = Driver | Rider;

function isDriver(item: AccountItemType): item is Driver {
  return (item as Driver).plateNumber !== undefined;
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dda15e',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#283618',
  },
  refreshButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dda15e',
    backgroundColor: '#fefae0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#606c38',
  },
  tabText: {
    color: '#606c38',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#283618',
    fontWeight: 'bold',
  },
  filterAndSearchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fefae0',
    borderBottomWidth: 1,
    borderBottomColor: '#dda15e',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dda15e',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#283618',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#283618',
    marginRight: 8,
  },
  filterScrollView: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#606c38',
    backgroundColor: '#fefae0',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#606c38',
  },
  filterText: {
    color: '#606c38',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fefae0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#283618',
  },
  accountList: {
    padding: 16,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#283618',
  },
  accountId: {
    fontSize: 14,
    color: '#606c38',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fefae0',
    fontSize: 12,
    fontWeight: '500',
  },
  accountInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 6,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#606c38',
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#dda15e',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fefae0',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#606c38',
    marginTop: 8,
  },
  actionIconButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dda15e',
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fefae0',
    borderRadius: 12,
    width: '100%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dda15e',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#283618',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 16,
    color: '#606c38',
    lineHeight: 24,
    marginBottom: 24,
  },
  confirmationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e63946',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#606c38',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  buttonText: {
    color: '#fefae0',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#606c38',
    marginRight: 4,
  },
  ratingStars: {
    flexDirection: 'row',
  },
});

export default function AccountsScreen() {
  const [userType, setUserType] = useState<UserType>('driver');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Driver | Rider | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'suspend' | 'activate' | 'delete' | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDrivers(mockDrivers);
      setRiders(mockRiders);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAccounts();
  };

 const filteredAccounts: AccountItemType[] = userType === 'driver' 
    ? drivers.filter(driver => {
        const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
        const matchesSearch = 
          driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesStatus && matchesSearch;
      })
    : riders.filter(rider => {
        const matchesStatus = statusFilter === 'all' || rider.status === statusFilter;
        const matchesSearch = 
          rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rider.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (rider.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        
        return matchesStatus && matchesSearch;
      });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#606c38';
      case 'inactive': return '#dda15e';
      case 'suspended': return '#e63946';
      default: return '#606c38';
    }
  };

  const handleAction = (account: Driver | Rider, action: 'suspend' | 'activate' | 'delete') => {
    setSelectedAccount(account);
    setModalAction(action);
    setIsModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedAccount || !modalAction) return;
    
    // In a real app, this would be an API call
    if (modalAction === 'delete') {
      if (userType === 'driver') {
        const updatedDrivers = drivers.filter(d => d.id !== selectedAccount.id);
        setDrivers(updatedDrivers);
      } else {
        const updatedRiders = riders.filter(r => r.id !== selectedAccount.id);
        setRiders(updatedRiders);
      }
      Alert.alert('Account Deleted', `The account has been deleted successfully.`);
    } else {
      const newStatus = modalAction === 'suspend' ? 'suspended' : 'active';
      
      if (userType === 'driver') {
        const updatedDrivers = drivers.map(d => 
          d.id === selectedAccount.id ? { ...d, status: newStatus as 'active' | 'inactive' | 'suspended' } : d
        );
        setDrivers(updatedDrivers);
      } else {
        const updatedRiders = riders.map(r => 
          r.id === selectedAccount.id ? { ...r, status: newStatus as 'active' | 'suspended' } : r
        );
        setRiders(updatedRiders);
      }
      
      Alert.alert(
        `Account ${modalAction === 'suspend' ? 'Suspended' : 'Activated'}`,
        `The account has been ${modalAction === 'suspend' ? 'suspended' : 'activated'} successfully.`
      );
    }
    
    setIsModalVisible(false);
    setSelectedAccount(null);
    setModalAction(null);
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={`star-${i}`} name="star" size={14} color="#dda15e" />);
      } else if (i === fullStars && halfStar) {
        stars.push(<Ionicons key={`star-half-${i}`} name="star-half" size={14} color="#dda15e" />);
      } else {
        stars.push(<Ionicons key={`star-outline-${i}`} name="star-outline" size={14} color="#dda15e" />);
      }
    }
    
    return stars;
  };

  const renderAccountItem = ({ item }: { item: AccountItemType }) => {
    if (isDriver(item)) {
      // Render driver item
      return (
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View>
              <Text style={styles.accountName}>{item.name}</Text>
              <Text style={styles.accountId}>{item.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          
          <View style={styles.accountInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="car" size={16} color="#606c38" />
              </View>
              <Text style={styles.infoText}>Plate: {item.plateNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call" size={16} color="#606c38" />
              </View>
              <Text style={styles.infoText}>{item.contactNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="navigate" size={16} color="#606c38" />
              </View>
              <Text style={styles.infoText}>{item.totalTrips} trips completed</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={16} color="#606c38" />
              </View>
              <Text style={styles.infoText}>Joined: {formatDate(item.dateJoined)}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="star" size={16} color="#606c38" />
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                <View style={styles.ratingStars}>
                  {renderRatingStars(item.rating)}
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.accountActions}>
            {item.status !== 'suspended' ? (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#e63946' }]}
                onPress={() => handleAction(item, 'suspend')}
              >
                <Ionicons name="ban" size={14} color="#fefae0" />
                <Text style={styles.actionButtonText}>Suspend</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#606c38' }]}
                onPress={() => handleAction(item, 'activate')}
              >
                <Ionicons name="checkmark-circle" size={14} color="#fefae0" />
                <Text style={styles.actionButtonText}>Activate</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#283618' }]}
              onPress={() => handleAction(item, 'delete')}
            >
              <Ionicons name="trash" size={14} color="#fefae0" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // Render rider item
      return (
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View>
              <Text style={styles.accountName}>{item.name}</Text>
              <Text style={styles.accountId}>{item.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          
          <View style={styles.accountInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call" size={16} color="#606c38" />
              </View>
              <Text style={styles.infoText}>{item.contactNumber}</Text>
            </View>
            {item.email && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="mail" size={16} color="#606c38" />
                </View>
                <Text style={styles.infoText}>{item.email}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="navigate" size={16} color="#606c38" />
              </View>
              <Text style={styles.infoText}>{item.totalTrips} trips completed</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={16} color="#606c38" />
              </View>
              <Text style={styles.infoText}>Joined: {formatDate(item.dateJoined)}</Text>
            </View>
          </View>
          
          <View style={styles.accountActions}>
            {item.status !== 'suspended' ? (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#e63946' }]}
                onPress={() => handleAction(item, 'suspend')}
              >
                <Ionicons name="ban" size={14} color="#fefae0" />
                <Text style={styles.actionButtonText}>Suspend</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#606c38' }]}
                onPress={() => handleAction(item, 'activate')}
              >
                <Ionicons name="checkmark-circle" size={14} color="#fefae0" />
                <Text style={styles.actionButtonText}>Activate</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#283618' }]}
              onPress={() => handleAction(item, 'delete')}
            >
              <Ionicons name="trash" size={14} color="#fefae0" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

 return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Manage Accounts</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={22} color="#283618" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, userType === 'driver' && styles.activeTab]}
          onPress={() => setUserType('driver')}
        >
          <Text style={[styles.tabText, userType === 'driver' && styles.activeTabText]}>Drivers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, userType === 'rider' && styles.activeTab]}
          onPress={() => setUserType('rider')}
        >
          <Text style={[styles.tabText, userType === 'rider' && styles.activeTabText]}>Riders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterAndSearchContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#606c38" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${userType === 'driver' ? 'drivers' : 'riders'}...`}
            placeholderTextColor="#a8a29e"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#606c38" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
            <TouchableOpacity 
              style={[styles.filterButton, statusFilter === 'all' && styles.activeFilter]}
              onPress={() => setStatusFilter('all')}
            >
              <Text style={[styles.filterText, statusFilter === 'all' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, statusFilter === 'active' && styles.activeFilter]}
              onPress={() => setStatusFilter('active')}
            >
              <Text style={[styles.filterText, statusFilter === 'active' && styles.activeFilterText]}>Active</Text>
            </TouchableOpacity>
            {userType === 'driver' && (
              <TouchableOpacity 
                style={[styles.filterButton, statusFilter === 'inactive' && styles.activeFilter]}
                onPress={() => setStatusFilter('inactive')}
              >
                <Text style={[styles.filterText, statusFilter === 'inactive' && styles.activeFilterText]}>Inactive</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.filterButton, statusFilter === 'suspended' && styles.activeFilter]}
              onPress={() => setStatusFilter('suspended')}
            >
              <Text style={[styles.filterText, statusFilter === 'suspended' && styles.activeFilterText]}>Suspended</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#606c38" />
          <Text style={styles.loadingText}>Loading accounts...</Text>
        </View>
      ) : filteredAccounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={50} color="#dda15e" />
          <Text style={styles.emptyText}>No accounts found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAccounts}
          renderItem={renderAccountItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.accountList}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalAction === 'delete' ? 'Delete Account' : 
                 modalAction === 'suspend' ? 'Suspend Account' : 'Activate Account'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#283618" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.confirmationText}>
              {modalAction === 'delete' 
                ? `Are you sure you want to permanently delete the account for ${selectedAccount?.name}? This action cannot be undone.`
                : modalAction === 'suspend'
                ? `Are you sure you want to suspend the account for ${selectedAccount?.name}? They will not be able to use the application until reactivated.`
                : `Are you sure you want to activate the account for ${selectedAccount?.name}? They will regain full access to the application.`
              }
            </Text>
            
            <View style={styles.confirmationActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close-circle" size={18} color="#fefae0" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.confirmButton, 
                  { backgroundColor: modalAction === 'activate' ? '#606c38' : '#e63946' }
                ]}
                onPress={confirmAction}
              >
                <Ionicons 
                  name={modalAction === 'delete' ? 'trash' : modalAction === 'suspend' ? 'ban' : 'checkmark-circle'} 
                  size={18} 
                  color="#fefae0" 
                />
                <Text style={styles.buttonText}>
                  {modalAction === 'delete' ? 'Delete' : modalAction === 'suspend' ? 'Suspend' : 'Activate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}