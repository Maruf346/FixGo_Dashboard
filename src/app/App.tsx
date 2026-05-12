import { useState, useMemo, useRef, useEffect } from "react";
import { Modal, ConfirmModal } from "./components/Modal";
import { ActionMenu } from "./components/ActionMenu";
import { AuthUser, clearStoredAuth, loadStoredAuth, loginAdmin, logoutAdmin, saveAuthState } from "../services/auth";
import { getBookings, getBookingDetail } from "../services/bookings";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  HardHat,
  Wrench,
  MessageSquare,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  ChevronDown,
  TrendingUp,
  CheckSquare,
  CheckCircle,
  UserCheck,
  MoreVertical,
  Menu,
  X,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Inbox,
  User,
  Trash2,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type Language = "EN" | "FR";

type BookingStatus =
  | "requested"
  | "confirmed"
  | "cancelled"
  | "on_way"
  | "arrived"
  | "working"
  | "completed";

type PaymentStatus = "Paid" | "Pending";

interface NavItem {
  id: string;
  labelEN: string;
  labelFR: string;
  icon: React.ElementType;
}

interface StatCardData {
  id: string;
  labelEN: string;
  labelFR: string;
  value: string;
  growth: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface DashPayment {
  id: string;
  orderId: string;
  date: string;
  buyer: string;
  buyerAvatar: string;
  payment: PaymentStatus;
  worker: string;
  workerAvatar: string;
  status: "Completed" | "In Progress" | "Cancelled";
  budget: string;
  fee: string;
}

interface Booking {
  id: string;
  booking_id: string;
  client_name: string;
  client_email: string;
  artisan_name: string;
  service_name: string;
  category_name: string;
  status: BookingStatus;
  assignment_mode: "client_chosen" | "auto_assigned";
  scheduled_date: string;
  scheduled_time: string;
  total_amount: string | null;
  created_at: string;
}

interface BookingPerson {
  id: string;
  full_name: string;
  email: string;
  profile_picture: string | null;
  phone: string | null;
}

interface BookingStatusHistoryItem {
  id: string;
  status: BookingStatus;
  changed_by: BookingPerson;
  note: string | null;
  timestamp: string;
}

interface BookingChecklistItem {
  id: string;
  label: string;
  is_done: boolean;
  order: number;
  done_at: string | null;
  created_at: string;
}

interface BookingAdditionalCost {
  id: string;
  reason: string;
  amount: string;
  status: "pending" | "approved" | "rejected";
  responded_at: string | null;
  created_at: string;
}

interface BookingIssueReport {
  id: string;
  issue_type: string;
  urgency: string;
  description: string | null;
  attachment: string | null;
  is_resolved: boolean;
  resolved_at: string | null;
  reported_by: BookingPerson;
  created_at: string;
}

interface BookingDetail extends Booking {
  client: BookingPerson;
  artisan: BookingPerson;
  full_address: string | null;
  address_lat: string | null;
  address_lng: string | null;
  additional_notes: string | null;
  image: { id: string; image: string; uploaded_at: string } | null;
  base_price: string | null;
  platform_fee: string | null;
  artisan_payout: string | null;
  completion_signature: string | null;
  requested_at: string | null;
  confirmed_at: string | null;
  on_way_at: string | null;
  arrived_at: string | null;
  working_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  status_history: BookingStatusHistoryItem[];
  checklist_items: BookingChecklistItem[];
  additional_costs: BookingAdditionalCost[];
  issue_reports: BookingIssueReport[];
  updated_at: string;
}

interface Notification {
  id: string;
  title: string;
  titleFR: string;
  description: string;
  descriptionFR: string;
  timestamp: string;
  timestampFR: string;
  isRead: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", labelEN: "Dashboard", labelFR: "Tableau de bord", icon: LayoutDashboard },
  { id: "bookings", labelEN: "Bookings", labelFR: "Réservations", icon: BookOpen },
  { id: "clients", labelEN: "Clients Management", labelFR: "Gestion des clients", icon: Users },
  { id: "artisan", labelEN: "Artisan Management", labelFR: "Gestion des artisans", icon: HardHat },
  { id: "service", labelEN: "Service Management", labelFR: "Gestion des services", icon: Wrench },
  { id: "message", labelEN: "Message", labelFR: "Messages", icon: MessageSquare },
  { id: "payment", labelEN: "Payment", labelFR: "Paiement", icon: CreditCard },
  { id: "settings", labelEN: "Settings", labelFR: "Paramètres", icon: SettingsIcon },
];

const PAGE_TITLES: Record<string, { EN: string; FR: string }> = {
  dashboard: { EN: "Dashboard", FR: "Tableau de bord" },
  bookings: { EN: "Bookings", FR: "Réservations" },
  clients: { EN: "Clients Management", FR: "Gestion des clients" },
  artisan: { EN: "Artisan Management", FR: "Gestion des artisans" },
  service: { EN: "Service Management", FR: "Gestion des services" },
  message: { EN: "Message", FR: "Messages" },
  payment: { EN: "Payment", FR: "Paiement" },
  settings: { EN: "Settings", FR: "Paramètres" },
  profile: { EN: "Profile", FR: "Profil" },
};

const STAT_CARDS: StatCardData[] = [
  { id: "revenue", labelEN: "Total revenue", labelFR: "Chiffre d'affaires", value: "$400", growth: "+8.5%", icon: TrendingUp, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { id: "active", labelEN: "Active tasks", labelFR: "Tâches actives", value: "40", growth: "+8.5%", icon: CheckSquare, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  { id: "completed", labelEN: "Complete task", labelFR: "Tâches complètes", value: "20", growth: "+8.5%", icon: CheckCircle, iconBg: "bg-green-50", iconColor: "text-green-500" },
  { id: "users", labelEN: "Total users", labelFR: "Utilisateurs totaux", value: "400", growth: "+8.5%", icon: UserCheck, iconBg: "bg-purple-50", iconColor: "text-purple-500" },
];

const CHART_DATA = [
  { id: "d1", date: "06 Jan", orders: 120 }, { id: "d2", date: "07 Jan", orders: 180 }, { id: "d3", date: "08 Jan", orders: 150 },
  { id: "d4", date: "09 Jan", orders: 200 }, { id: "d5", date: "10 Jan", orders: 170 }, { id: "d6", date: "11 Jan", orders: 310 },
  { id: "d7", date: "12 Jan", orders: 245 }, { id: "d8", date: "13 Jan", orders: 190 }, { id: "d9", date: "14 Jan", orders: 220 },
  { id: "d10", date: "15 Jan", orders: 260 }, { id: "d11", date: "16 Jan", orders: 195 }, { id: "d12", date: "17 Jan", orders: 280 },
  { id: "d13", date: "18 Jan", orders: 230 }, { id: "d14", date: "19 Jan", orders: 300 }, { id: "d15", date: "20 Jan", orders: 210 },
  { id: "d16", date: "21 Jan", orders: 270 }, { id: "d17", date: "22 Jan", orders: 185 }, { id: "d18", date: "23 Jan", orders: 240 },
  { id: "d19", date: "24 Jan", orders: 290 }, { id: "d20", date: "25 Jan", orders: 320 }, { id: "d21", date: "26 Jan", orders: 250 },
  { id: "d22", date: "27 Jan", orders: 200 },
];

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const DASH_PAYMENTS: DashPayment[] = [
  { id: "1", orderId: "#ID238976", date: "Apr 24, 2022", buyer: "Justin Leo", buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format", payment: "Paid", worker: "Alex Smith", workerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format", status: "Completed", budget: "$90", fee: "$4.5" },
  { id: "2", orderId: "#ID238977", date: "Apr 24, 2022", buyer: "Sarah Miller", buyerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format", payment: "Paid", worker: "Tom Clarke", workerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format", status: "Completed", budget: "$120", fee: "$6.0" },
  { id: "3", orderId: "#ID238978", date: "Apr 25, 2022", buyer: "Maria Costa", buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format", payment: "Paid", worker: "James Wilson", workerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&auto=format", status: "In Progress", budget: "$75", fee: "$3.75" },
  { id: "4", orderId: "#ID238979", date: "Apr 25, 2022", buyer: "David Chen", buyerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&auto=format", payment: "Pending", worker: "Nina Patel", workerAvatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&auto=format", status: "In Progress", budget: "$200", fee: "$10.0" },
  { id: "5", orderId: "#ID238980", date: "Apr 26, 2022", buyer: "Lena Dubois", buyerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format", payment: "Paid", worker: "Carlos Rivera", workerAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&auto=format", status: "Completed", budget: "$150", fee: "$7.5" },
];

const ALL_BOOKINGS = [
  { id: "b1",  orderId: "#ID238976", date: "Apr 24, 2022", buyer: "Justin Leo",    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Alex Smith",   artisanAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format", service: "Plumbing",       status: "completed",  budget: "$90" },
  { id: "b2",  orderId: "#ID238977", date: "Apr 24, 2022", buyer: "Sarah Miller",  buyerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Tom Clarke",   artisanAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format", service: "Electrical",     status: "completed",  budget: "$120" },
  { id: "b3",  orderId: "#ID238978", date: "Apr 25, 2022", buyer: "Maria Costa",   buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "James Wilson", artisanAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&auto=format", service: "Carpentry",      status: "working",    budget: "$75" },
  { id: "b4",  orderId: "#ID238979", date: "Apr 25, 2022", buyer: "David Chen",    buyerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&auto=format", payment: "Pending", artisan: "Nina Patel",   artisanAvatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&auto=format", service: "Painting",       status: "on_way",     budget: "$200" },
  { id: "b5",  orderId: "#ID238980", date: "Apr 26, 2022", buyer: "Lena Dubois",   buyerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Carlos Rivera",artisanAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&auto=format", service: "AC Repair",      status: "arrived",    budget: "$150" },
  { id: "b6",  orderId: "#ID238981", date: "Apr 26, 2022", buyer: "Omar Hassan",   buyerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&auto=format", payment: "Pending", artisan: "Paul Dumont",  artisanAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=40&h=40&fit=crop&auto=format", service: "Locksmith",      status: "confirmed",  budget: "$60" },
  { id: "b7",  orderId: "#ID238982", date: "Apr 27, 2022", buyer: "Priya Nair",    buyerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format", payment: "Pending", artisan: "Sam Brooks",   artisanAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&auto=format", service: "Cleaning",       status: "requested",  budget: "$45" },
  { id: "b8",  orderId: "#ID238983", date: "Apr 27, 2022", buyer: "Jean Moreau",   buyerAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Ali Karim",    artisanAvatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=40&h=40&fit=crop&auto=format", service: "Tiling",         status: "cancelled",  budget: "$180" },
  { id: "b9",  orderId: "#ID238984", date: "Apr 28, 2022", buyer: "Emma Schulz",   buyerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Marc Leroy",   artisanAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format", service: "Roofing",        status: "completed",  budget: "$320" },
  { id: "b10", orderId: "#ID238985", date: "Apr 28, 2022", buyer: "Kevin Trần",    buyerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format", payment: "Pending", artisan: "Fatou Diallo", artisanAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format", service: "Gardening",      status: "requested",  budget: "$55" },
  { id: "b11", orderId: "#ID238986", date: "Apr 29, 2022", buyer: "Chloé Martin",  buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Ben Wallace",  artisanAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format", service: "Plumbing",       status: "working",    budget: "$110" },
  { id: "b12", orderId: "#ID238987", date: "Apr 29, 2022", buyer: "Ravi Patel",    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Layla Ahmed",  artisanAvatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&auto=format", service: "Electrical",     status: "on_way",     budget: "$95" },
  { id: "b13", orderId: "#ID238988", date: "Apr 30, 2022", buyer: "Nina Wolf",     buyerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format", payment: "Pending", artisan: "Theo Blanc",   artisanAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=40&h=40&fit=crop&auto=format", service: "Painting",       status: "confirmed",  budget: "$135" },
  { id: "b14", orderId: "#ID238989", date: "Apr 30, 2022", buyer: "Lucas Kim",     buyerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Youssef Naji", artisanAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&auto=format", service: "Carpentry",      status: "arrived",    budget: "$170" },
  { id: "b15", orderId: "#ID238990", date: "May 1, 2022",  buyer: "Amira Benali",  buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Chris Hall",   artisanAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&auto=format", service: "AC Repair",      status: "completed",  budget: "$240" },
  { id: "b16", orderId: "#ID238991", date: "May 1, 2022",  buyer: "Ethan Brown",   buyerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format", payment: "Pending", artisan: "Mia Turner",   artisanAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format", service: "Cleaning",       status: "requested",  budget: "$50" },
  { id: "b17", orderId: "#ID238992", date: "May 2, 2022",  buyer: "Sophie Blanc",  buyerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Omar Farouq",  artisanAvatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=40&h=40&fit=crop&auto=format", service: "Tiling",         status: "cancelled",  budget: "$210" },
  { id: "b18", orderId: "#ID238993", date: "May 2, 2022",  buyer: "Daniel Ortiz",  buyerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Hana Kobashi", artisanAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format", service: "Locksmith",      status: "working",    budget: "$85" },
  { id: "b19", orderId: "#ID238994", date: "May 3, 2022",  buyer: "Isabelle Roy",  buyerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format", payment: "Pending", artisan: "Kemal Yıldız", artisanAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&auto=format", service: "Roofing",        status: "confirmed",  budget: "$290" },
  { id: "b20", orderId: "#ID238995", date: "May 3, 2022",  buyer: "Aaron Müller",  buyerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&auto=format", payment: "Paid",    artisan: "Sofia Greco",  artisanAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format", service: "Gardening",      status: "completed",  budget: "$65" },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "New booking request received",
    titleFR: "Nouvelle demande de réservation reçue",
    description: "A customer has requested a plumbing service",
    descriptionFR: "Un client a demandé un service de plomberie",
    timestamp: "2 min ago",
    timestampFR: "Il y a 2 min",
    isRead: false,
    icon: BookOpen,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "n2",
    title: "Payment completed successfully",
    titleFR: "Paiement effectué avec succès",
    description: "Order #ID238976 payment received",
    descriptionFR: "Paiement de la commande #ID238976 reçu",
    timestamp: "1 hour ago",
    timestampFR: "Il y a 1 heure",
    isRead: false,
    icon: CreditCard,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "n3",
    title: "Artisan verification pending",
    titleFR: "Vérification artisan en attente",
    description: "New artisan account requires approval",
    descriptionFR: "Nouveau compte artisan nécessite une approbation",
    timestamp: "3 hours ago",
    timestampFR: "Il y a 3 heures",
    isRead: false,
    icon: UserCheck,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    id: "n4",
    title: "Client account deactivated",
    titleFR: "Compte client désactivé",
    description: "User requested account deactivation",
    descriptionFR: "L'utilisateur a demandé la désactivation du compte",
    timestamp: "Yesterday",
    timestampFR: "Hier",
    isRead: true,
    icon: AlertCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    id: "n5",
    title: "Service completed",
    titleFR: "Service terminé",
    description: "Electrical service marked as completed",
    descriptionFR: "Service électrique marqué comme terminé",
    timestamp: "Yesterday",
    timestampFR: "Hier",
    isRead: true,
    icon: CheckCircle,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function AvatarImg({ src, name, size = 32, className = "" }: { src: string | null | undefined; name: string; size?: number; className?: string }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return src ? (
    <img
      src={src}
      alt={name}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 ${className}`}
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0 ${className}`}
    >
      {initial}
    </div>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "Paid" ? "bg-green-50 text-green-600 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
      {status}
    </span>
  );
}

function DashStatusBadge({ status }: { status: DashPayment["status"] }) {
  const map: Record<DashPayment["status"], string> = {
    Completed: "bg-green-50 text-green-600 border border-green-200",
    "In Progress": "bg-blue-50 text-blue-600 border border-blue-200",
    Cancelled: "bg-red-50 text-red-600 border border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; labelFR: string; cls: string }> = {
  requested:  { label: "Requested",   labelFR: "Demandé",         cls: "bg-amber-50 text-amber-600 border border-amber-200" },
  confirmed:  { label: "Confirmed",   labelFR: "Confirmé",        cls: "bg-blue-50 text-blue-600 border border-blue-200" },
  cancelled:  { label: "Cancelled",   labelFR: "Annulé",          cls: "bg-red-50 text-red-600 border border-red-200" },
  on_way:     { label: "On The Way",  labelFR: "En route",        cls: "bg-violet-50 text-violet-600 border border-violet-200" },
  arrived:    { label: "Arrived",     labelFR: "Arrivé",          cls: "bg-teal-50 text-teal-600 border border-teal-200" },
  working:    { label: "Working",     labelFR: "En cours",        cls: "bg-orange-50 text-orange-600 border border-orange-200" },
  completed:  { label: "Completed",   labelFR: "Terminé",         cls: "bg-green-50 text-green-600 border border-green-200" },
};

function BookingStatusBadge({ status, lang }: { status: BookingStatus; lang: Language }) {
  const cfg = BOOKING_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cfg.cls}`}>
      {lang === "EN" ? cfg.label : cfg.labelFR}
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  lang: Language;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function Sidebar({ activeNav, onNavChange, lang, open, onClose, onLogout }: SidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col bg-card border-r border-border
          w-[260px] transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(145deg, #1b457c, #5286ca)" }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-none mb-0.5">Admin Dashboard</p>
              <p className="text-lg font-bold text-primary leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>FIXGO</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavChange(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-150 group ${isActive ? "text-white shadow-sm" : "text-[#002213] hover:bg-muted"}`}
                style={isActive ? { background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" } : undefined}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-[#002213] group-hover:text-primary"} />
                <span style={{ fontFamily: "Poppins, sans-serif" }}>{lang === "EN" ? item.labelEN : item.labelFR}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#002213] hover:bg-red-50 hover:text-red-600 transition-colors group">
            <LogOut size={18} className="group-hover:text-red-500" />
            <span style={{ fontFamily: "Poppins, sans-serif" }}>{lang === "EN" ? "Logout" : "Déconnexion"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

interface NavbarProps {
  lang: Language;
  onLangChange: (l: Language) => void;
  activeNav: string;
  onMenuOpen: () => void;
  onNavChange: (id: string) => void;
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
  onNotificationDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onLogout: () => void;
  user: AuthUser | null;
}

function Navbar({ lang, onLangChange, activeNav, onMenuOpen, onNavChange, notifications, onNotificationRead, onNotificationDelete, onMarkAllRead, onClearAll, onLogout, user }: NavbarProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const allRead = notifications.length > 0 && notifications.every((n) => n.isRead);
  const profileName = user?.full_name?.trim() || user?.email || (lang === "EN" ? "Admin" : "Admin");
  const profileRole = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : (lang === "EN" ? "Admin" : "Admin");
  const profileImage = user?.profile_picture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuOpen} className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-[#595959]" style={{ fontFamily: "Inter, sans-serif" }}>
          {PAGE_TITLES[activeNav]?.[lang] ?? "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-10 h-10 bg-card rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm"
          >
            <Bell size={18} className="text-[#111827]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-red-500 border-2 border-white text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-foreground">
                  {lang === "EN" ? "Notifications" : "Notifications"}
                </h3>
                <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
                  {!allRead && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {lang === "EN" ? "Mark All Read" : "Tout marquer comme lu"}
                    </button>
                  )}
                  {allRead && (
                    <button
                      onClick={onClearAll}
                      className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      {lang === "EN" ? "Clear All" : "Tout effacer"}
                    </button>
                  )}
                </div>
              )}

              {/* Notification List */}
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Inbox size={48} className="text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {lang === "EN" ? "No notifications" : "Aucune notification"}
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead) onNotificationRead(notif.id);
                        }}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer transition-colors ${
                          notif.isRead ? "bg-card hover:bg-muted/30" : "bg-blue-50/50 hover:bg-blue-50"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full ${notif.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={18} className={notif.iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`text-sm ${notif.isRead ? "text-foreground" : "font-semibold text-foreground"}`}>
                              {lang === "EN" ? notif.title : notif.titleFR}
                            </p>
                            {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {lang === "EN" ? notif.description : notif.descriptionFR}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {lang === "EN" ? notif.timestamp : notif.timestampFR}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNotificationDelete(notif.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:block h-6 w-px bg-border" />

        <div className="relative hidden sm:block">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-[#646464]"
          >
            <span className="text-base leading-none">{lang === "EN" ? "🇬🇧" : "🇫🇷"}</span>
            <span>{lang === "EN" ? "English" : "Français"}</span>
            <ChevronDown size={14} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50">
              {(["EN", "FR"] as Language[]).map((l) => (
                <button key={l} onClick={() => { onLangChange(l); setLangOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors ${lang === l ? "text-primary font-semibold" : "text-foreground"}`}>
                  <span>{l === "EN" ? "🇬🇧" : "🇫🇷"}</span>
                  <span>{l === "EN" ? "English" : "Français"}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
          >
            <img
              src={profileImage}
              alt={profileName}
              className="w-9 h-9 rounded-full object-cover border-2 border-border"
            />
            <div className="hidden md:block">
              <p className="text-sm font-bold text-[#111827] leading-tight">{profileName}</p>
              <p className="text-xs text-muted-foreground leading-tight">{profileRole}</p>
            </div>
            <ChevronDown size={14} className={`hidden md:block text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl border border-border shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onNavChange("profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-b border-border"
              >
                <User size={16} className="text-muted-foreground" />
                <span>{lang === "EN" ? "View Profile" : "Voir le profil"}</span>
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span>{lang === "EN" ? "Logout" : "Déconnexion"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg">
      <p>${payload[0].value}</p>
      <p className="text-white/70 text-[10px]">{label}</p>
    </div>
  );
}

function OrderChart({ lang }: { lang: Language }) {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [monthOpen, setMonthOpen] = useState(false);
  const months = lang === "EN" ? MONTHS_EN : MONTHS_FR;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-foreground">{lang === "EN" ? "Order" : "Commandes"}</h2>
        <div className="relative">
          <button onClick={() => setMonthOpen(!monthOpen)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            {months[selectedMonth]}
            <ChevronDown size={12} className={`transition-transform ${monthOpen ? "rotate-180" : ""}`} />
          </button>
          {monthOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50 max-h-48 overflow-y-auto">
              {months.map((m, i) => (
                <button key={i} onClick={() => { setSelectedMonth(i); setMonthOpen(false); }} className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors ${selectedMonth === i ? "text-primary font-semibold" : "text-foreground"}`}>{m}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ width: '100%', height: '224px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis key="xaxis" dataKey="date" tick={{ fontSize: 10, fill: "#718096" }} axisLine={false} tickLine={false} interval={3} />
            <YAxis key="yaxis" tick={{ fontSize: 10, fill: "#718096" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip key="tooltip" content={<CustomTooltip />} cursor={{ stroke: "#5286ca", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Line key="line-orders" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#1b457c", strokeWidth: 2, stroke: "white" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentPayments({ lang }: { lang: Language }) {
  const cols = {
    orderId: lang === "EN" ? "All Orders" : "Toutes les commandes",
    date: lang === "EN" ? "Date" : "Date",
    buyer: lang === "EN" ? "Buyer" : "Acheteur",
    payment: lang === "EN" ? "Payment" : "Paiement",
    worker: lang === "EN" ? "Worker" : "Artisan",
    status: lang === "EN" ? "Status" : "Statut",
    budget: lang === "EN" ? "Budget" : "Budget",
    fee: lang === "EN" ? "Platform Fee" : "Frais plateforme",
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">{lang === "EN" ? "Recent Payments" : "Paiements récents"}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {Object.values(cols).map((col) => (
                <th key={col} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{col}</th>
              ))}
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {DASH_PAYMENTS.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-primary whitespace-nowrap">{p.orderId}</td>
                <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{p.date}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <AvatarImg src={p.buyerAvatar} name={p.buyer} />
                    <span className="font-medium text-foreground">{p.buyer}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5"><PaymentBadge status={p.payment} /></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <AvatarImg src={p.workerAvatar} name={p.worker} />
                    <span className="font-medium text-foreground">{p.worker}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5"><DashStatusBadge status={p.status} /></td>
                <td className="px-5 py-3.5 font-semibold text-foreground whitespace-nowrap">{p.budget}</td>
                <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{p.fee}</td>
                <td className="px-3 py-3.5">
                  <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <MoreVertical size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardPage({ lang }: { lang: Language }) {
  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="bg-card rounded-2xl p-5 shadow-sm border border-border flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{lang === "EN" ? card.labelEN : card.labelFR}</p>
                  <p className="text-3xl font-bold text-foreground leading-none">{card.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon size={20} className={card.iconColor} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                  <TrendingUp size={12} />{card.growth}
                </span>
                <span className="text-xs text-muted-foreground">{lang === "EN" ? "Up from yesterday" : "Hausse depuis hier"}</span>
              </div>
            </div>
          );
        })}
      </div>
      <OrderChart lang={lang} />
      <RecentPayments lang={lang} />
      <div className="h-4" />
    </main>
  );
}

// ─── Bookings page ────────────────────────────────────────────────────────────

type SortKey = "booking_id" | "scheduled_date" | "total_amount";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [8, 16, 20];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <ArrowUpDown
      size={12}
      className={`inline ml-1 transition-colors ${active ? "text-primary" : "text-muted-foreground/50"}`}
    />
  );
}

function BookingsPage({ lang }: { lang: Language }) {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("booking_id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingListError, setBookingListError] = useState<string | null>(null);

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [loadingBookingDetail, setLoadingBookingDetail] = useState(false);
  const [bookingDetailError, setBookingDetailError] = useState<string | null>(null);

  const t = {
    search:     lang === "EN" ? "Search bookings by id, client, artisan…" : "Rechercher réservations par id, client, artisan…",
    allOrders:  lang === "EN" ? "All Orders" : "Toutes les commandes",
    bookingId:  lang === "EN" ? "Booking ID" : "ID de réservation",
    service:    lang === "EN" ? "Service" : "Service",
    date:       lang === "EN" ? "Date" : "Date",
    buyer:      lang === "EN" ? "Client" : "Client",
    worker:     lang === "EN" ? "Artisan" : "Artisan",
    status:     lang === "EN" ? "Status" : "Statut",
    totalAmount: lang === "EN" ? "Total Amount" : "Montant total",
    showResult: lang === "EN" ? "Show result:" : "Résultats :",
    empty:      lang === "EN" ? "No bookings found" : "Aucune réservation trouvée",
    emptySub:   lang === "EN" ? "Try adjusting your search or check back later." : "Essayez d'affiner votre recherche.",
    of:         lang === "EN" ? "of" : "sur",
    loading:    lang === "EN" ? "Loading bookings…" : "Chargement des réservations…",
    noDetails:  lang === "EN" ? "Booking details unavailable." : "Détails de réservation non disponibles.",
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchQuery(search.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true);
      setBookingListError(null);

      const orderingMap: Record<SortKey, string> = {
        booking_id: "booking_id",
        scheduled_date: "scheduled_date",
        total_amount: "total_amount",
      };

      try {
        const data = await getBookings({
          page,
          page_size: pageSize,
          search: searchQuery || undefined,
          ordering: sortDir === "asc" ? orderingMap[sortKey] : `-${orderingMap[sortKey]}`,
        });

        setBookings(data.results);
        setBookingCount(data.count);
      } catch (error) {
        setBookingListError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [page, pageSize, searchQuery, sortKey, sortDir]);

  const openBookingDetail = async (id: string) => {
    setSelectedBookingId(id);
    setSelectedBooking(null);
    setBookingDetailError(null);
    setLoadingBookingDetail(true);

    try {
      const detail = await getBookingDetail(id);
      setSelectedBooking(detail);
    } catch (error) {
      setBookingDetailError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoadingBookingDetail(false);
    }
  };

  const closeBookingDetail = () => {
    setSelectedBooking(null);
    setSelectedBookingId(null);
    setBookingDetailError(null);
    setLoadingBookingDetail(false);
  };

  const totalPages = Math.max(1, Math.ceil(bookingCount / pageSize));
  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  const bookingRows = bookings;

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("booking_id")}>{t.bookingId}<SortIcon active={sortKey === "booking_id"} dir={sortDir} /></th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.service}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("scheduled_date")}>{t.date}<SortIcon active={sortKey === "scheduled_date"} dir={sortDir} /></th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.buyer}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.worker}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.status}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("total_amount")}>{t.totalAmount}<SortIcon active={sortKey === "total_amount"} dir={sortDir} /></th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {loadingBookings ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-sm text-muted-foreground">{t.loading}</td>
                </tr>
              ) : bookingListError ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-sm text-red-600">{bookingListError}</td>
                </tr>
              ) : bookingRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <EmptyState lang={lang} />
                  </td>
                </tr>
              ) : (
                bookingRows.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => openBookingDetail(b.id)}
                    className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                      <td className="px-5 py-3.5 font-medium text-primary whitespace-nowrap">{b.booking_id}</td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{b.service_name}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground whitespace-nowrap">{b.scheduled_date}</td>
                    <td className="px-5 py-3.5 text-sm text-foreground">
                      <div className="flex items-center gap-3">
                        <AvatarImg src={(b as any).client_picture ?? null} name={b.client_name} size={32} />
                        <span>{b.client_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground">
                      <div className="flex items-center gap-3">
                        <AvatarImg src={(b as any).artisan_picture ?? null} name={b.artisan_name} size={32} />
                        <span>{b.artisan_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><BookingStatusBadge status={b.status} lang={lang} /></td>
                    <td className="px-5 py-3.5 font-semibold text-foreground whitespace-nowrap">{b.total_amount ?? "N/A"}</td>
                    <td className="px-3 py-3.5">
                      <ActionMenu
                        items={[
                          {
                            label: lang === "EN" ? "View Details" : "Voir les détails",
                            icon: <Eye size={14} />,
                            onClick: () => openBookingDetail(b.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {loadingBookings ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">{t.loading}</div>
          ) : bookingListError ? (
            <div className="px-5 py-10 text-center text-sm text-red-600">{bookingListError}</div>
          ) : bookingRows.length === 0 ? (
            <div className="px-5 py-16 text-center"><EmptyState lang={lang} /></div>
          ) : (
            bookingRows.map((b) => (
              <div
                key={b.id}
                onClick={() => openBookingDetail(b.id)}
                className="px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{b.booking_id}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><CalendarDays size={11} />{b.scheduled_date}</p>
                  </div>
                  <BookingStatusBadge status={b.status} lang={lang} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.service}</p>
                    <p className="text-sm font-medium text-foreground truncate">{b.service_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.buyer}</p>
                    <p className="text-sm font-medium text-foreground truncate">{b.client_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.worker}</p>
                    <p className="text-sm font-medium text-foreground truncate">{b.artisan_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.totalAmount}</p>
                    <p className="text-sm font-medium text-foreground">{b.total_amount ?? "N/A"}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {bookingRows.length > 0 && (
          <div className="px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t.showResult}</span>
              <div className="relative">
                <button
                  onClick={() => setPageSizeOpen(!pageSizeOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {pageSize}
                  <ChevronDown size={12} className={`transition-transform ${pageSizeOpen ? "rotate-180" : ""}`} />
                </button>
                {pageSizeOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-20 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50">
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setPageSize(s); setPage(1); setPageSizeOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${pageSize === s ? "text-primary font-semibold" : "text-foreground"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>

              {pageNumbers.map((pn, i) =>
                pn === "…" ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground">…</span>
                ) : (
                  <button
                    key={pn}
                    onClick={() => setPage(pn as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === pn ? "text-white shadow-sm" : "border border-border text-muted-foreground hover:bg-muted"}`}
                    style={page === pn ? { background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" } : undefined}
                  >
                    {pn}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-4" />

      <Modal
        isOpen={!!selectedBookingId}
        onClose={closeBookingDetail}
        title={lang === "EN" ? "Booking Details" : "Détails de la réservation"}
        size="xl"
      >
        {loadingBookingDetail ? (
          <div className="py-10 text-center text-sm text-muted-foreground">{t.loading}</div>
        ) : bookingDetailError ? (
          <div className="py-10 text-center text-sm text-red-600">{bookingDetailError}</div>
        ) : !selectedBooking ? (
          <div className="py-10 text-center text-sm text-muted-foreground">{t.noDetails}</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t.bookingId}</p>
                <p className="text-lg font-semibold text-foreground">{selectedBooking.booking_id}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedBooking.created_at ? new Date(selectedBooking.created_at).toLocaleString() : "N/A"}</p>
              </div>
              <BookingStatusBadge status={selectedBooking.status} lang={lang} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">{lang === "EN" ? "Client" : "Client"}</h4>
                <div className="flex items-center gap-3">
                  <AvatarImg src={selectedBooking.client.profile_picture} name={selectedBooking.client.full_name} size={52} />
                  <div>
                    <p className="font-semibold text-foreground">{selectedBooking.client.full_name || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.client.email || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.client.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">{lang === "EN" ? "Artisan" : "Artisan"}</h4>
                <div className="flex items-center gap-3">
                  <AvatarImg src={selectedBooking.artisan?.profile_picture || "https://via.placeholder.com/52"} name={selectedBooking.artisan?.full_name || "N/A"} size={52} />
                  <div>
                    <p className="font-semibold text-foreground">{selectedBooking.artisan?.full_name || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.artisan?.email || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.artisan?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{lang === "EN" ? "Service & Schedule" : "Service et planning"}</h4>
                <div className="grid gap-3">
                  <DetailRow label={lang === "EN" ? "Service" : "Service"} value={selectedBooking.service_name || "N/A"} />
                  <DetailRow label={lang === "EN" ? "Category" : "Catégorie"} value={selectedBooking.category_name || "N/A"} />
                  <DetailRow label={lang === "EN" ? "Assignment" : "Affectation"} value={selectedBooking.assignment_mode.replace("_", " ") || "N/A"} />
                  <DetailRow label={lang === "EN" ? "Scheduled Date" : "Date prévue"} value={selectedBooking.scheduled_date || "N/A"} />
                  <DetailRow label={lang === "EN" ? "Scheduled Time" : "Heure prévue"} value={selectedBooking.scheduled_time || "N/A"} />
                  <DetailRow label={lang === "EN" ? "Location" : "Adresse"} value={selectedBooking.full_address || "N/A"} />
                  <DetailRow label={lang === "EN" ? "Notes" : "Notes"} value={selectedBooking.additional_notes || "N/A"} />
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{lang === "EN" ? "Financials" : "Finances"}</h4>
                <DetailRow label={lang === "EN" ? "Base Price" : "Prix de base"} value={selectedBooking.base_price || "N/A"} />
                <DetailRow label={lang === "EN" ? "Total Amount" : "Montant total"} value={selectedBooking.total_amount || "N/A"} />
                <DetailRow label={lang === "EN" ? "Platform Fee" : "Frais plateforme"} value={selectedBooking.platform_fee || "N/A"} />
                <DetailRow label={lang === "EN" ? "Artisan Payout" : "Paiement artisan"} value={selectedBooking.artisan_payout || "N/A"} />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{lang === "EN" ? "Completion Signature" : "Signature de fin"}</p>
                  {selectedBooking.completion_signature ? (
                    <img src={selectedBooking.completion_signature} alt="Completion Signature" className="w-full h-48 object-contain rounded-2xl border border-border bg-white" />
                  ) : (
                    <div className="w-full h-48 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-sm text-muted-foreground">
                      {lang === "EN" ? "No signature available" : "Aucune signature disponible"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{lang === "EN" ? "Booking Timeline" : "Chronologie"}</h4>
                <DetailRow label={lang === "EN" ? "Requested" : "Demandé"} value={selectedBooking.requested_at || "N/A"} />
                <DetailRow label={lang === "EN" ? "Confirmed" : "Confirmé"} value={selectedBooking.confirmed_at || "N/A"} />
                <DetailRow label={lang === "EN" ? "On The Way" : "En route"} value={selectedBooking.on_way_at || "N/A"} />
                <DetailRow label={lang === "EN" ? "Arrived" : "Arrivé"} value={selectedBooking.arrived_at || "N/A"} />
                <DetailRow label={lang === "EN" ? "Working" : "En cours"} value={selectedBooking.working_at || "N/A"} />
                <DetailRow label={lang === "EN" ? "Completed" : "Terminé"} value={selectedBooking.completed_at || "N/A"} />
                <DetailRow label={lang === "EN" ? "Cancelled" : "Annulé"} value={selectedBooking.cancelled_at || "N/A"} />
                <DetailRow label={lang === "EN" ? "Cancellation Reason" : "Raison de l'annulation"} value={selectedBooking.cancellation_reason || "N/A"} />
              </div>

              <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{lang === "EN" ? "Cancel Info" : "Info annulation"}</h4>
                <DetailRow label={lang === "EN" ? "Cancelled By" : "Annulé par"} value={selectedBooking.cancelled_by || "N/A"} />
                <DetailRow label={lang === "EN" ? "Updated At" : "Mis à jour le"} value={selectedBooking.updated_at || "N/A"} />
              </div>
            </div>

            <TabularSection
              lang={lang}
              title={lang === "EN" ? "Status History" : "Historique des statuts"}
              headers={[lang === "EN" ? "Status" : "Statut", lang === "EN" ? "Changed By" : "Modifié par", lang === "EN" ? "Note" : "Note", lang === "EN" ? "Timestamp" : "Horodatage"]}
              rows={selectedBooking.status_history.map((item) => [
                item.status,
                item.changed_by.full_name || item.changed_by.email || "N/A",
                item.note || "N/A",
                item.timestamp || "N/A",
              ])}
            />

            <TabularSection
              lang={lang}
              title={lang === "EN" ? "Checklist Items" : "Liste de contrôle"}
              headers={[lang === "EN" ? "Item" : "Élément", lang === "EN" ? "Done" : "Fait", lang === "EN" ? "Done At" : "Fait le", lang === "EN" ? "Created At" : "Créé le"]}
              rows={selectedBooking.checklist_items.map((item) => [
                item.label || "N/A",
                item.is_done ? (lang === "EN" ? "Yes" : "Oui") : (lang === "EN" ? "No" : "Non"),
                item.done_at || "N/A",
                item.created_at || "N/A",
              ])}
            />

            <TabularSection
              lang={lang}
              title={lang === "EN" ? "Additional Costs" : "Coûts supplémentaires"}
              headers={[lang === "EN" ? "Reason" : "Raison", lang === "EN" ? "Amount" : "Montant", lang === "EN" ? "Status" : "Statut", lang === "EN" ? "Responded At" : "Répondu le"]}
              rows={selectedBooking.additional_costs.map((item) => [
                item.reason || "N/A",
                item.amount || "N/A",
                item.status,
                item.responded_at || "N/A",
              ])}
            />

            <TabularSection
              lang={lang}
              title={lang === "EN" ? "Issue Reports" : "Rapports de problèmes"}
              headers={[lang === "EN" ? "Issue Type" : "Type de problème", lang === "EN" ? "Urgency" : "Urgence", lang === "EN" ? "Description" : "Description", lang === "EN" ? "Reporter" : "Signaleur"]}
              rows={selectedBooking.issue_reports.map((item) => [
                item.issue_type || "N/A",
                item.urgency || "N/A",
                item.description || "N/A",
                item.reported_by.full_name || item.reported_by.email || "N/A",
              ])}
            />
          </div>
        )}
      </Modal>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="min-w-[120px] text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function TabularSection({ lang, title, headers, rows }: { lang: Language; title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="overflow-x-auto rounded-2xl border border-border bg-muted/30">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/20">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-3 py-4 text-sm text-muted-foreground text-center">{lang === "EN" ? "No records available" : "Aucun enregistrement disponible"}</td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="border-t border-border">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 text-sm text-foreground">{cell}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ lang }: { lang: Language }) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <Inbox size={24} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground text-center">
          {lang === "EN" ? "No bookings found" : "Aucune réservation trouvée"}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {lang === "EN" ? "Try adjusting your search or check back later." : "Essayez d'affiner votre recherche."}
        </p>
      </div>
    </div>
  );
}

// ─── Import management pages ─────────────────────────────────────────────────

import ClientsManagement from "./pages/ClientsManagement";
import ArtisanManagement from "./pages/ArtisanManagement";
import ServiceManagement from "./pages/ServiceManagement";
import Messages from "./pages/Messages";
import Payment from "./pages/Payment";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

// ─── Placeholder for unbuilt pages ───────────────────────────────────────────

function ComingSoon({ lang, navId }: { lang: Language; navId: string }) {
  const title = PAGE_TITLES[navId]?.[lang] ?? navId;
  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
          <LayoutDashboard size={28} className="text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{lang === "EN" ? "This page is coming soon." : "Cette page arrive bientôt."}</p>
      </div>
    </main>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const storedAuth = useMemo(() => loadStoredAuth(), []);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(storedAuth.accessToken && storedAuth.user));
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => storedAuth.user);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [lang, setLang] = useState<Language>("EN");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Previous mock login handler kept for future reference:
  // const handleLogin = (email: string, password: string) => {
  //   console.log("User logged in:", email);
  //   setIsAuthenticated(true);
  // };

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const data = await loginAdmin(email, password);
      saveAuthState(
        {
          accessToken: data.tokens.access,
          refreshToken: data.tokens.refresh,
          user: data.user,
        },
        rememberMe
      );

      setCurrentUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError(lang === "EN" ? "Login failed. Please try again." : "Échec de la connexion. Veuillez réessayer.");
      }
      console.error("Login error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleNotificationDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  // Previous mock logout handler preserved for future reference:
  // const handleLogoutConfirm = () => {
  //   console.log("User logged out");
  //   setIsAuthenticated(false);
  //   setActiveNav("dashboard"); // Reset to dashboard for next login
  //   setNotifications(INITIAL_NOTIFICATIONS); // Reset notifications
  //   setSidebarOpen(false);
  //   setShowLogoutConfirm(false);
  // };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);

    const { refreshToken, accessToken } = loadStoredAuth();

    try {
      if (accessToken && refreshToken) {
        await logoutAdmin(refreshToken, accessToken);
      }
    } catch (error) {
      console.warn("Logout API failed:", error);
    } finally {
      clearStoredAuth();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveNav("dashboard"); // Reset to dashboard for next login
      setNotifications(INITIAL_NOTIFICATIONS); // Reset notifications
      setSidebarOpen(false);
    }
  };

  function renderPage() {
    if (activeNav === "dashboard") return <DashboardPage lang={lang} />;
    if (activeNav === "bookings")  return <BookingsPage lang={lang} />;
    if (activeNav === "clients")   return <ClientsManagement lang={lang} />;
    if (activeNav === "artisan")   return <ArtisanManagement lang={lang} />;
    if (activeNav === "service")   return <ServiceManagement lang={lang} />;
    if (activeNav === "message")   return <Messages lang={lang} />;
    if (activeNav === "payment")   return <Payment lang={lang} />;
    if (activeNav === "settings")  return <Settings lang={lang} />;
    if (activeNav === "profile")   return <Profile lang={lang} user={currentUser} />;
    return <ComingSoon lang={lang} navId={activeNav} />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login lang={lang} onLangChange={setLang} onLogin={handleLogin} loading={authLoading} error={authError} />;
  }

  // Show dashboard if authenticated
  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        lang={lang}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          lang={lang}
          onLangChange={setLang}
          activeNav={activeNav}
          onMenuOpen={() => setSidebarOpen(true)}
          onNavChange={setActiveNav}
          notifications={notifications}
          onNotificationRead={handleNotificationRead}
          onNotificationDelete={handleNotificationDelete}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAll}
          onLogout={() => setShowLogoutConfirm(true)}
          user={currentUser}
        />
        {renderPage()}
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title={lang === "EN" ? "Confirm Logout" : "Confirmer la déconnexion"}
        message={
          lang === "EN"
            ? "Are you sure you want to logout? You will need to login again to access the dashboard."
            : "Êtes-vous sûr de vouloir vous déconnecter? Vous devrez vous reconnecter pour accéder au tableau de bord."
        }
        confirmText={lang === "EN" ? "Logout" : "Déconnexion"}
        cancelText={lang === "EN" ? "Cancel" : "Annuler"}
        type="warning"
      />
    </div>
  );
}
