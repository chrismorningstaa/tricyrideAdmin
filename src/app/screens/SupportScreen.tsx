import React, { useState, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SupportTicket } from "../../types/rootTabsList";

// Mock data for development
const mockTickets: SupportTicket[] = [
  {
    id: "1001",
    userId: "D123",
    userType: "driver",
    subject: "App crashes during navigation",
    description:
      "The app crashes whenever I start navigation to a pickup location.",
    status: "open",
    priority: "high",
    dateCreated: "2025-05-09T10:30:00",
    lastUpdated: "2025-05-09T10:30:00",
  },
  {
    id: "1002",
    userId: "R456",
    userType: "rider",
    subject: "Incorrect fare calculation",
    description:
      "I was charged more than the estimated fare without explanation.",
    status: "in-progress",
    priority: "medium",
    dateCreated: "2025-05-08T15:45:00",
    lastUpdated: "2025-05-09T09:15:00",
  },
  {
    id: "1003",
    userId: "D789",
    userType: "driver",
    subject: "Payment not received",
    description:
      "I completed a trip yesterday but haven't received payment yet.",
    status: "open",
    priority: "high",
    dateCreated: "2025-05-08T18:20:00",
    lastUpdated: "2025-05-08T18:20:00",
  },
  {
    id: "1004",
    userId: "R234",
    userType: "rider",
    subject: "Driver was rude",
    description:
      "The driver was extremely rude and made inappropriate comments.",
    status: "in-progress",
    priority: "medium",
    dateCreated: "2025-05-07T12:10:00",
    lastUpdated: "2025-05-08T14:30:00",
  },
  {
    id: "1005",
    userId: "D345",
    userType: "driver",
    subject: "Can't update profile photo",
    description:
      "I've been trying to update my profile photo but keep getting an error.",
    status: "resolved",
    priority: "low",
    dateCreated: "2025-05-06T09:05:00",
    lastUpdated: "2025-05-07T11:45:00",
  },
  {
    id: "1006",
    userId: "R567",
    userType: "rider",
    subject: "Refund request",
    description: "I was double-charged for a trip last week and need a refund.",
    status: "resolved",
    priority: "medium",
    dateCreated: "2025-05-05T16:40:00",
    lastUpdated: "2025-05-06T13:20:00",
  },
];

type FilterStatus = "all" | "open" | "in-progress" | "resolved";
type FilterPriority = "all" | "low" | "medium" | "high";
type FilterUserType = "all" | "driver" | "rider";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefae0",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dda15e",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#283618",
  },
  refreshButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#dda15e",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#283618",
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterScrollView: {
    paddingBottom: 8,
  },
  filterGroup: {
    marginRight: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#283618",
    marginBottom: 6,
  },
  filterButtons: {
    flexDirection: "row",
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#606c38",
    backgroundColor: "#fefae0",
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: "#606c38",
  },
  filterText: {
    color: "#606c38",
    fontSize: 14,
  },
  activeFilterText: {
    color: "#fefae0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#283618",
  },
  ticketList: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketIdContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#606c38",
    marginRight: 8,
  },
  userTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userTypeText: {
    color: "#fefae0",
    fontSize: 12,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fefae0",
    fontSize: 12,
    fontWeight: "500",
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: "600",
    color: "#283618",
    marginBottom: 6,
  },
  ticketDescription: {
    fontSize: 14,
    color: "#606c38",
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: "#fefae0",
    fontSize: 12,
    fontWeight: "500",
  },
  ticketDate: {
    fontSize: 12,
    color: "#606c38",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#283618",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#606c38",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fefae0",
    borderRadius: 12,
    width: "100%",
    maxHeight: "90%",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dda15e",
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#283618",
  },
  ticketDetailSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#606c38",
  },
  detailValue: {
    fontSize: 14,
    color: "#283618",
  },
  messageSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#606c38",
    marginBottom: 4,
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#283618",
    marginBottom: 16,
  },
  messageContent: {
    fontSize: 14,
    color: "#283618",
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  actionButtonText: {
    color: "#fefae0",
    fontWeight: "600",
    marginLeft: 8,
  },
  responseContainer: {
    paddingBottom: 16,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#283618",
    marginBottom: 4,
  },
  responseSubtitle: {
    fontSize: 14,
    color: "#606c38",
    marginBottom: 16,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#606c38",
    marginBottom: 8,
  },
  responseInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dda15e",
    padding: 12,
    fontSize: 14,
    color: "#283618",
    textAlignVertical: "top",
    marginBottom: 16,
    minHeight: 120,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#606c38",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: "#fefae0",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default function SupportScreen() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("all");
  const [userTypeFilter, setUserTypeFilter] = useState<FilterUserType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesUserType =
      userTypeFilter === "all" || ticket.userType === userTypeFilter;
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesUserType && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#e63946";
      case "medium":
        return "#dda15e";
      case "low":
        return "#606c38";
      default:
        return "#606c38";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#e63946";
      case "in-progress":
        return "#dda15e";
      case "resolved":
        return "#606c38";
      default:
        return "#606c38";
    }
  };

  const updateTicketStatus = (
    ticket: SupportTicket,
    newStatus: "open" | "in-progress" | "resolved"
  ) => {
    // In a real app, this would be an API call
    const updatedTicket = {
      ...ticket,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    };
    const updatedTickets = tickets.map((t) =>
      t.id === ticket.id ? updatedTicket : t
    );

    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);

    Alert.alert("Status Updated", `Ticket status updated to ${newStatus}`, [
      { text: "OK" },
    ]);
  };

  const submitResponse = () => {
    if (responseText.trim() === "") {
      Alert.alert("Error", "Response cannot be empty");
      return;
    }

    setIsSubmittingResponse(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmittingResponse(false);
      setIsResponseModalVisible(false);
      setResponseText("");

      if (selectedTicket) {
        updateTicketStatus(selectedTicket, "in-progress");
      }

      Alert.alert("Response Sent", "Your response has been sent successfully", [
        { text: "OK" },
      ]);
    }, 1000);
  };

  const renderTicketItem = ({ item }: { item: SupportTicket }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => {
        setSelectedTicket(item);
        setIsModalVisible(true);
      }}
    >
      <View style={styles.ticketHeader}>
        <View style={styles.ticketIdContainer}>
          <Text style={styles.ticketId}>#{item.id}</Text>
          <View
            style={[
              styles.userTypeBadge,
              {
                backgroundColor:
                  item.userType === "driver" ? "#283618" : "#dda15e",
              },
            ]}
          >
            <Text style={styles.userTypeText}>{item.userType}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.ticketSubject}>{item.subject}</Text>
      <Text style={styles.ticketDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.ticketFooter}>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        >
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
        <Text style={styles.ticketDate}>{formatDate(item.dateCreated)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Support</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={22} color="#283618" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#606c38"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tickets..."
          placeholderTextColor="#a8a29e"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#606c38" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollView}
        >
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
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
                  statusFilter === "open" && styles.activeFilter,
                ]}
                onPress={() => setStatusFilter("open")}
              >
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === "open" && styles.activeFilterText,
                  ]}
                >
                  Open
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  statusFilter === "in-progress" && styles.activeFilter,
                ]}
                onPress={() => setStatusFilter("in-progress")}
              >
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === "in-progress" && styles.activeFilterText,
                  ]}
                >
                  In Progress
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  statusFilter === "resolved" && styles.activeFilter,
                ]}
                onPress={() => setStatusFilter("resolved")}
              >
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === "resolved" && styles.activeFilterText,
                  ]}
                >
                  Resolved
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Priority:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  priorityFilter === "all" && styles.activeFilter,
                ]}
                onPress={() => setPriorityFilter("all")}
              >
                <Text
                  style={[
                    styles.filterText,
                    priorityFilter === "all" && styles.activeFilterText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  priorityFilter === "low" && styles.activeFilter,
                ]}
                onPress={() => setPriorityFilter("low")}
              >
                <Text
                  style={[
                    styles.filterText,
                    priorityFilter === "low" && styles.activeFilterText,
                  ]}
                >
                  Low
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  priorityFilter === "medium" && styles.activeFilter,
                ]}
                onPress={() => setPriorityFilter("medium")}
              >
                <Text
                  style={[
                    styles.filterText,
                    priorityFilter === "medium" && styles.activeFilterText,
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  priorityFilter === "high" && styles.activeFilter,
                ]}
                onPress={() => setPriorityFilter("high")}
              >
                <Text
                  style={[
                    styles.filterText,
                    priorityFilter === "high" && styles.activeFilterText,
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>User Type:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  userTypeFilter === "all" && styles.activeFilter,
                ]}
                onPress={() => setUserTypeFilter("all")}
              >
                <Text
                  style={[
                    styles.filterText,
                    userTypeFilter === "all" && styles.activeFilterText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  userTypeFilter === "driver" && styles.activeFilter,
                ]}
                onPress={() => setUserTypeFilter("driver")}
              >
                <Text
                  style={[
                    styles.filterText,
                    userTypeFilter === "driver" && styles.activeFilterText,
                  ]}
                >
                  Driver
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  userTypeFilter === "rider" && styles.activeFilter,
                ]}
                onPress={() => setUserTypeFilter("rider")}
              >
                <Text
                  style={[
                    styles.filterText,
                    userTypeFilter === "rider" && styles.activeFilterText,
                  ]}
                >
                  Rider
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#606c38" />
          <Text style={styles.loadingText}>Loading tickets...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicketItem}
          contentContainerStyle={styles.ticketList}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="ticket-outline" size={50} color="#dda15e" />
              <Text style={styles.emptyText}>No tickets found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your filters
              </Text>
            </View>
          }
        />
      )}

      {/* Ticket Detail Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ticket Details</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#283618" />
              </TouchableOpacity>
            </View>

            {selectedTicket && (
              <>
                <View style={styles.ticketDetailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ID:</Text>
                    <Text style={styles.detailValue}>#{selectedTicket.id}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>User:</Text>
                    <View
                      style={[
                        styles.userTypeBadge,
                        {
                          backgroundColor:
                            selectedTicket.userType === "driver"
                              ? "#283618"
                              : "#dda15e",
                        },
                      ]}
                    >
                      <Text style={styles.userTypeText}>
                        {selectedTicket.userId} ({selectedTicket.userType})
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(
                            selectedTicket.status
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {selectedTicket.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Priority:</Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor: getPriorityColor(
                            selectedTicket.priority
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.priorityText}>
                        {selectedTicket.priority}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Created:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedTicket.dateCreated)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Updated:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedTicket.lastUpdated)}
                    </Text>
                  </View>
                </View>

                <View style={styles.messageSection}>
                  <Text style={styles.messageTitle}>Subject</Text>
                  <Text style={styles.messageSubject}>
                    {selectedTicket.subject}
                  </Text>
                  <Text style={styles.messageTitle}>Description</Text>
                  <Text style={styles.messageContent}>
                    {selectedTicket.description}
                  </Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: "#dda15e" },
                    ]}
                    onPress={() => {
                      setIsModalVisible(false);
                      setIsResponseModalVisible(true);
                    }}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={20}
                      color="#fefae0"
                    />
                    <Text style={styles.actionButtonText}>Respond</Text>
                  </TouchableOpacity>

                  {selectedTicket.status !== "resolved" ? (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#606c38" },
                      ]}
                      onPress={() =>
                        updateTicketStatus(selectedTicket, "resolved")
                      }
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color="#fefae0"
                      />
                      <Text style={styles.actionButtonText}>Mark Resolved</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: "#e63946" },
                      ]}
                      onPress={() => updateTicketStatus(selectedTicket, "open")}
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={20}
                        color="#fefae0"
                      />
                      <Text style={styles.actionButtonText}>Reopen</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={isResponseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsResponseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Respond to Ticket</Text>
              <TouchableOpacity
                onPress={() => setIsResponseModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#283618" />
              </TouchableOpacity>
            </View>

            {selectedTicket && (
              <ScrollView>
                <View style={styles.responseContainer}>
                  <Text style={styles.responseTitle}>
                    Responding to Ticket #{selectedTicket.id}
                  </Text>
                  <Text style={styles.responseSubtitle}>
                    {selectedTicket.subject}
                  </Text>

                  <Text style={styles.responseLabel}>Your Response:</Text>
                  <TextInput
                    style={styles.responseInput}
                    placeholder="Type your response here..."
                    placeholderTextColor="#a8a29e"
                    value={responseText}
                    onChangeText={setResponseText}
                    multiline
                    numberOfLines={5}
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitResponse}
                    disabled={isSubmittingResponse}
                  >
                    {isSubmittingResponse ? (
                      <ActivityIndicator size="small" color="#fefae0" />
                    ) : (
                      <>
                        <Ionicons name="send" size={20} color="#fefae0" />
                        <Text style={styles.submitButtonText}>
                          Send Response
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
