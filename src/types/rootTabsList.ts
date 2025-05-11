export type RootTabParamList = {
  Dashboard: undefined;
  ManageDrivers: undefined;
  MonitorRides: undefined;
  Reports: undefined;
  Support: undefined;
  Accounts: undefined;
};

export interface Driver {
  id: string;
  name: string;
  age: number;
  plateNumber: string;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
  contactNumber: string;
  profileImage?: string;
  totalTrips: number;
  dateJoined: string;
  email?: string;
}

export interface Rider {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  totalTrips: number;
  dateJoined: string;
  status: 'active' | 'suspended';
}

export interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  riderId: string;
  riderName: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'ongoing' | 'completed' | 'cancelled';
  fare: number;
  distance: string;
  duration: string;
  startTime: string;
  endTime?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userType: 'driver' | 'rider';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  dateCreated: string;
  lastUpdated: string;
}

export interface ReportData {
  totalTrips: number;
  totalDrivers: number;
  totalRiders: number;
  totalRevenue: number;
  averageRating: number;
  tripsByDay: { date: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
}

export interface AdminStats {
  activeDrivers: number;
  totalDrivers: number;
  activeRides: number;
  totalRidesCompleted: number;
  totalRiders: number;
  openTickets: number;
  totalRevenue: number;
  todayRevenue: number;
}