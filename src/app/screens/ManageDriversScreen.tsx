import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ListRenderItemInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Driver, Rider } from "../../types/rootTabsList";

// Mock data
const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Juan Dela Cruz",
    age: 35,
    plateNumber: "ABC123",
    rating: 4.8,
    status: "active",
    contactNumber: "+639123456789",
    totalTrips: 342,
    dateJoined: "2023-05-15",
  },
  {
    id: "2",
    name: "Pedro Santos",
    age: 42,
    plateNumber: "XYZ456",
    rating: 4.5,
    status: "active",
    contactNumber: "+639234567890",
    totalTrips: 215,
    dateJoined: "2023-06-22",
  },
  {
    id: "3",
    name: "Maria Garcia",
    age: 29,
    plateNumber: "DEF789",
    rating: 4.9,
    status: "active",
    contactNumber: "+639345678901",
    totalTrips: 178,
    dateJoined: "2023-07-10",
  },
  {
    id: "4",
    name: "Jose Reyes",
    age: 38,
    plateNumber: "GHI012",
    rating: 4.2,
    status: "suspended",
    contactNumber: "+639456789012",
    totalTrips: 97,
    dateJoined: "2023-08-05",
  },
  {
    id: "5",
    name: "Antonio Lim",
    age: 45,
    plateNumber: "JKL345",
    rating: 4.7,
    status: "inactive",
    contactNumber: "+639567890123",
    totalTrips: 256,
    dateJoined: "2023-06-12",
  },
];

const mockRiders: Rider[] = [
  {
    id: "1",
    name: "Ana Santos",
    contactNumber: "+639123456789",
    email: "ana@example.com",
    totalTrips: 25,
    dateJoined: "2023-08-10",
    status: "active",
  },
  {
    id: "2",
    name: "Ben Reyes",
    contactNumber: "+639234567890",
    email: "ben@example.com",
    totalTrips: 18,
    dateJoined: "2023-09-05",
    status: "active",
  },
  {
    id: "3",
    name: "Clara Tan",
    contactNumber: "+639345678901",
    totalTrips: 32,
    dateJoined: "2023-07-22",
    status: "active",
  },
  {
    id: "4",
    name: "David Cruz",
    contactNumber: "+639456789012",
    email: "david@example.com",
    totalTrips: 7,
    dateJoined: "2023-10-15",
    status: "suspended",
  },
];

type TabType = "drivers" | "riders";
type ListItem = Driver | Rider;

export default function ManageDriversScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("drivers");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Driver | Rider | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "suspended"
  >("all");

  const filteredDrivers = mockDrivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRiders = mockRiders.filter((rider) => {
    const matchesSearch =
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesStatus =
      statusFilter === "all" ? true : rider.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleItemPress = (item: Driver | Rider) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const isDriver = (item: ListItem): item is Driver => {
    return "plateNumber" in item;
  };

  const renderItem = ({ item }: ListRenderItemInfo<ListItem>) => {
    if (isDriver(item)) {
      return (
        <TouchableOpacity
          style={styles.itemCard}
          onPress={() => handleItemPress(item)}
        >
          <View style={styles.itemHeader}>
            <View style={styles.profileContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileInitial}>{item.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>Plate: {item.plateNumber}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                item.status === "active"
                  ? styles.statusActive
                  : item.status === "inactive"
                  ? styles.statusInactive
                  : styles.statusSuspended,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.itemDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="star" size={16} color="#dda15e" />
              <Text style={styles.detailText}>{item.rating}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="navigate" size={16} color="#606c38" />
              <Text style={styles.detailText}>{item.totalTrips} trips</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="call" size={16} color="#606c38" />
              <Text style={styles.detailText}>{item.contactNumber}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.itemCard}
          onPress={() => handleItemPress(item)}
        >
          <View style={styles.itemHeader}>
            <View style={styles.profileContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileInitial}>{item.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>
                  {item.email || "No email"}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                item.status === "active"
                  ? styles.statusActive
                  : styles.statusSuspended,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.itemDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="navigate" size={16} color="#606c38" />
              <Text style={styles.detailText}>{item.totalTrips} trips</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="call" size={16} color="#606c38" />
              <Text style={styles.detailText}>{item.contactNumber}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={16} color="#606c38" />
              <Text style={styles.detailText}>
                Joined: {new Date(item.dateJoined).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderDetailModal = () => {
    if (!selectedItem) return null;

    const isDriverItem = isDriver(selectedItem);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isDriverItem ? "Driver Details" : "Rider Details"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#283618" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
              <View style={styles.largeProfleImage}>
                <Text style={styles.largeProfileInitial}>
                  {selectedItem.name.charAt(0)}
                </Text>
              </View>
              <Text style={styles.modalName}>{selectedItem.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  selectedItem.status === "active"
                    ? styles.statusActive
                    : selectedItem.status === "inactive"
                    ? styles.statusInactive
                    : styles.statusSuspended,
                ]}
              >
                <Text style={styles.statusText}>{selectedItem.status}</Text>
              </View>
            </View>

            <View style={styles.detailsSection}>
              {isDriverItem && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Plate Number:</Text>
                    <Text style={styles.detailValue}>
                      {selectedItem.plateNumber}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Age:</Text>
                    <Text style={styles.detailValue}>{selectedItem.age}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Rating:</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.detailValue}>
                        {selectedItem.rating}
                      </Text>
                      <Ionicons name="star" size={16} color="#dda15e" />
                    </View>
                  </View>
                </>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact:</Text>
                <Text style={styles.detailValue}>
                  {selectedItem.contactNumber}
                </Text>
              </View>

              {"email" in selectedItem && selectedItem.email && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>
                    {selectedItem.email as string}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Trips:</Text>
                <Text style={styles.detailValue}>
                  {selectedItem.totalTrips}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Joined:</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedItem.dateJoined).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.suspendButton]}
                onPress={() => {
                  // Handle suspend logic
                  setModalVisible(false);
                }}
              >
                <Ionicons name="ban" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>
                  {selectedItem.status === "suspended"
                    ? "Unsuspend"
                    : "Suspend"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.contactButton]}
                onPress={() => {
                  // Handle contact logic
                  setModalVisible(false);
                }}
              >
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const data: ListItem[] =
    activeTab === "drivers" ? filteredDrivers : filteredRiders;

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "drivers" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("drivers")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "drivers" && styles.activeTabText,
            ]}
          >
            Drivers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "riders" && styles.activeTab]}
          onPress={() => setActiveTab("riders")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "riders" && styles.activeTabText,
            ]}
          >
            Riders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#606c38"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={
            activeTab === "drivers" ? "Search drivers..." : "Search riders..."
          }
          placeholderTextColor="#606c38"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by status:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "all" && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === "all" && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "active" && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter("active")}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === "active" && styles.activeFilterText,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "inactive" && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter("inactive")}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === "inactive" && styles.activeFilterText,
              ]}
            >
              Inactive
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "suspended" && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter("suspended")}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === "suspended" && styles.activeFilterText,
              ]}
            >
              Suspended
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Driver/Rider list using a properly typed FlatList */}
      <FlatList<ListItem>
        contentContainerStyle={styles.listContainer}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail modal */}
      {renderDetailModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefae0",
  },
  tabContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fefae0",
    borderBottomWidth: 1,
    borderBottomColor: "#dda15e",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#283618",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#606c38",
  },
  activeTabText: {
    color: "#283618",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
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
    color: "#283618",
  },
  filterContainer: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  filterLabel: {
    color: "#283618",
    fontWeight: "500",
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dda15e",
  },
  activeFilter: {
    backgroundColor: "#dda15e",
  },
  filterText: {
    color: "#606c38",
    fontSize: 12,
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "500",
  },
  listContainer: {
    padding: 12,
    paddingBottom: 24,
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dda15e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInitial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemName: {
    color: "#283618",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemDetail: {
    color: "#606c38",
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: "#94af76",
  },
  statusInactive: {
    backgroundColor: "#aaa",
  },
  statusSuspended: {
    backgroundColor: "#e07a5f",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 4,
    color: "#606c38",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fefae0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#283618",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  largeProfleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dda15e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  largeProfileInitial: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  modalName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#283618",
    marginBottom: 8,
  },
  detailsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    color: "#606c38",
    fontSize: 14,
  },
  detailValue: {
    color: "#283618",
    fontSize: 14,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "45%",
  },
  suspendButton: {
    backgroundColor: "#e07a5f",
  },
  contactButton: {
    backgroundColor: "#606c38",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
