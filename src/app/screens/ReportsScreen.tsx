import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ReportData } from '../../types/rootTabsList';

// Mock data for development
const mockReportData: ReportData = {
  totalTrips: 1248,
  totalDrivers: 32,
  totalRiders: 185,
  totalRevenue: 96750.50,
  averageRating: 4.8,
  tripsByDay: [
    { date: '2025-05-04', count: 42 },
    { date: '2025-05-05', count: 38 },
    { date: '2025-05-06', count: 45 },
    { date: '2025-05-07', count: 52 },
    { date: '2025-05-08', count: 48 },
    { date: '2025-05-09', count: 60 },
    { date: '2025-05-10', count: 38 },
  ],
  revenueByDay: [
    { date: '2025-05-04', amount: 3150.75 },
    { date: '2025-05-05', amount: 2870.25 },
    { date: '2025-05-06', amount: 3450.00 },
    { date: '2025-05-07', amount: 4025.50 },
    { date: '2025-05-08', amount: 3680.25 },
    { date: '2025-05-09', amount: 4720.50 },
    { date: '2025-05-10', amount: 2950.75 },
  ],
};

type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';
type ReportType = 'summary' | 'trips' | 'revenue' | 'drivers';

export default function ReportsScreen() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('weekly');
  const [reportType, setReportType] = useState<ReportType>('summary');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReportData(mockReportData);
      setLoading(false);
    }, 1000);
  };

  const generateReport = () => {
    setGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      // In a real app, this would trigger a download or email
      alert(`${reportType} report for ${reportPeriod} period has been generated successfully!`);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  // Chart visualization component for trips by day
  const TripsChart = ({ data }: { data: { date: string; count: number }[] }) => {
    const maxCount = Math.max(...data.map(item => item.count));
    
    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartItem}>
            <Text style={styles.chartLabel}>{formatDate(item.date)}</Text>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { height: (item.count / maxCount) * 150, backgroundColor: '#dda15e' }
                ]} 
              />
            </View>
            <Text style={styles.chartValue}>{item.count}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Chart visualization component for revenue by day
  const RevenueChart = ({ data }: { data: { date: string; amount: number }[] }) => {
    const maxAmount = Math.max(...data.map(item => item.amount));
    
    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartItem}>
            <Text style={styles.chartLabel}>{formatDate(item.date)}</Text>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { height: (item.amount / maxAmount) * 150, backgroundColor: '#606c38' }
                ]} 
              />
            </View>
            <Text style={styles.chartValue}>{formatCurrency(item.amount).substring(0, 6)}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#606c38" />
        <Text style={styles.loadingText}>Loading report data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchReportData}>
          <Ionicons name="refresh" size={22} color="#283618" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Report Period:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, reportPeriod === 'daily' && styles.activeFilter]}
            onPress={() => setReportPeriod('daily')}
          >
            <Text style={[styles.filterText, reportPeriod === 'daily' && styles.activeFilterText]}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, reportPeriod === 'weekly' && styles.activeFilter]}
            onPress={() => setReportPeriod('weekly')}
          >
            <Text style={[styles.filterText, reportPeriod === 'weekly' && styles.activeFilterText]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, reportPeriod === 'monthly' && styles.activeFilter]}
            onPress={() => setReportPeriod('monthly')}
          >
            <Text style={[styles.filterText, reportPeriod === 'monthly' && styles.activeFilterText]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, reportPeriod === 'custom' && styles.activeFilter]}
            onPress={() => setReportPeriod('custom')}
          >
            <Text style={[styles.filterText, reportPeriod === 'custom' && styles.activeFilterText]}>Custom</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.reportTypeContainer}>
        <Text style={styles.filterLabel}>Report Type:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, reportType === 'summary' && styles.activeFilter]}
            onPress={() => setReportType('summary')}
          >
            <Text style={[styles.filterText, reportType === 'summary' && styles.activeFilterText]}>Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, reportType === 'trips' && styles.activeFilter]}
            onPress={() => setReportType('trips')}
          >
            <Text style={[styles.filterText, reportType === 'trips' && styles.activeFilterText]}>Trips</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, reportType === 'revenue' && styles.activeFilter]}
            onPress={() => setReportType('revenue')}
          >
            <Text style={[styles.filterText, reportType === 'revenue' && styles.activeFilterText]}>Revenue</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, reportType === 'drivers' && styles.activeFilter]}
            onPress={() => setReportType('drivers')}
          >
            <Text style={[styles.filterText, reportType === 'drivers' && styles.activeFilterText]}>Drivers</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.reportContainer}>
        {reportData && (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Trips</Text>
                <Text style={styles.statValue}>{reportData.totalTrips}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Drivers</Text>
                <Text style={styles.statValue}>{reportData.totalDrivers}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Riders</Text>
                <Text style={styles.statValue}>{reportData.totalRiders}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Revenue</Text>
                <Text style={styles.statValue}>{formatCurrency(reportData.totalRevenue)}</Text>
              </View>
            </View>

            {reportType === 'summary' && (
              <>
                <View style={styles.chartSection}>
                  <Text style={styles.sectionTitle}>Trips Overview</Text>
                  <TripsChart data={reportData.tripsByDay} />
                </View>
                <View style={styles.chartSection}>
                  <Text style={styles.sectionTitle}>Revenue Overview</Text>
                  <RevenueChart data={reportData.revenueByDay} />
                </View>
                <View style={styles.ratingSection}>
                  <Text style={styles.sectionTitle}>Average Rating</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingValue}>{reportData.averageRating}</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <Ionicons 
                          key={index}
                          name={index < Math.floor(reportData.averageRating) ? "star" : 
                               index === Math.floor(reportData.averageRating) && 
                               reportData.averageRating % 1 > 0 ? "star-half" : "star-outline"}
                          size={24}
                          color="#dda15e"
                          style={styles.starIcon}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </>
            )}

            {reportType === 'trips' && (
              <View style={styles.detailedReportSection}>
                <Text style={styles.sectionTitle}>Trip Details</Text>
                <TripsChart data={reportData.tripsByDay} />
                <View style={styles.dataSummary}>
                  <Text style={styles.summaryText}>
                    Weekly trips: {reportData.tripsByDay.reduce((total, day) => total + day.count, 0)}
                  </Text>
                  <Text style={styles.summaryText}>
                    Daily average: {(reportData.tripsByDay.reduce((total, day) => total + day.count, 0) / reportData.tripsByDay.length).toFixed(1)}
                  </Text>
                  <Text style={styles.summaryText}>
                    Highest day: {formatDate(reportData.tripsByDay.reduce((max, day) => max.count > day.count ? max : day, reportData.tripsByDay[0]).date)}
                  </Text>
                </View>
              </View>
            )}

            {reportType === 'revenue' && (
              <View style={styles.detailedReportSection}>
                <Text style={styles.sectionTitle}>Revenue Details</Text>
                <RevenueChart data={reportData.revenueByDay} />
                <View style={styles.dataSummary}>
                  <Text style={styles.summaryText}>
                    Weekly revenue: {formatCurrency(reportData.revenueByDay.reduce((total, day) => total + day.amount, 0))}
                  </Text>
                  <Text style={styles.summaryText}>
                    Daily average: {formatCurrency(reportData.revenueByDay.reduce((total, day) => total + day.amount, 0) / reportData.revenueByDay.length)}
                  </Text>
                  <Text style={styles.summaryText}>
                    Highest day: {formatDate(reportData.revenueByDay.reduce((max, day) => max.amount > day.amount ? max : day, reportData.revenueByDay[0]).date)}
                  </Text>
                </View>
              </View>
            )}

            {reportType === 'drivers' && (
              <View style={styles.detailedReportSection}>
                <Text style={styles.sectionTitle}>Driver Performance</Text>
                <View style={styles.driverStats}>
                  <View style={styles.driverStatRow}>
                    <View style={styles.driverStatItem}>
                      <Text style={styles.driverStatLabel}>Active Drivers</Text>
                      <Text style={styles.driverStatValue}>{reportData.totalDrivers}</Text>
                    </View>
                    <View style={styles.driverStatItem}>
                      <Text style={styles.driverStatLabel}>Avg Rating</Text>
                      <Text style={styles.driverStatValue}>{reportData.averageRating}</Text>
                    </View>
                  </View>
                  <View style={styles.driverStatRow}>
                    <View style={styles.driverStatItem}>
                      <Text style={styles.driverStatLabel}>Trips per Driver</Text>
                      <Text style={styles.driverStatValue}>
                        {(reportData.totalTrips / reportData.totalDrivers).toFixed(1)}
                      </Text>
                    </View>
                    <View style={styles.driverStatItem}>
                      <Text style={styles.driverStatLabel}>Revenue per Driver</Text>
                      <Text style={styles.driverStatValue}>
                        {formatCurrency(reportData.totalRevenue / reportData.totalDrivers)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.generateButton}
        onPress={generateReport}
        disabled={generating}
      >
        {generating ? (
          <ActivityIndicator size="small" color="#fefae0" />
        ) : (
          <>
            <Ionicons name="download-outline" size={22} color="#fefae0" />
            <Text style={styles.generateButtonText}>Generate Report</Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefae0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefae0',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#283618',
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reportTypeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#606c38',
    backgroundColor: '#fefae0',
  },
  activeFilter: {
    backgroundColor: '#606c38',
  },
  filterText: {
    color: '#606c38',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fefae0',
  },
  reportContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#dda15e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#fefae0',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fefae0',
  },
  chartSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#283618',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
  },
  chartLabel: {
    fontSize: 12,
    color: '#606c38',
    marginTop: 8,
    textAlign: 'center',
  },
  chartValue: {
    fontSize: 12,
    color: '#283618',
    fontWeight: '500',
    marginTop: 4,
  },
  barContainer: {
    height: 150,
    justifyContent: 'flex-end',
    width: 20,
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  ratingSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 16,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#283618',
    marginRight: 16,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: 2,
  },
  detailedReportSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dataSummary: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 14,
    color: '#283618',
    marginBottom: 6,
  },
  driverStats: {
    marginTop: 8,
  },
  driverStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  driverStatItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  driverStatLabel: {
    fontSize: 14,
    color: '#606c38',
    marginBottom: 4,
  },
  driverStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#606c38',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generateButtonText: {
    color: '#fefae0',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});