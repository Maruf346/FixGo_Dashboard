import { useState, useMemo } from "react";
import {
  Search,
  Eye,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
  Calendar,
  FileText,
} from "lucide-react";
import { Modal } from "../components/Modal";
import { ActionMenu } from "../components/ActionMenu";

type Language = "EN" | "FR";
type SortKey = "orderId" | "date" | "budget";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [8, 16, 20];

interface PaymentRecord {
  id: string;
  orderId: string;
  date: string;
  buyer: {
    name: string;
    avatar: string;
    email: string;
  };
  paymentStatus: "Paid" | "Pending";
  worker: {
    name: string;
    avatar: string;
    email: string;
  };
  status: "Completed" | "In Progress" | "Cancelled";
  budget: number;
  platformFee: number;
  additionalFee: number;
  subTotal: number;
  transactionId: string;
  bookingId: string;
  invoiceNumber: string;
  transactionDate: string;
}

const MOCK_PAYMENTS: PaymentRecord[] = Array(20).fill(null).map((_, i) => ({
  id: `pay-${i + 1}`,
  orderId: `#ID${238976 + i}`,
  date: "Apr 24, 2022",
  buyer: {
    name: "Justin Leo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format",
    email: "justin.leo@example.com",
  },
  paymentStatus: i % 3 === 0 ? "Pending" : "Paid",
  worker: {
    name: "Alex smith",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format",
    email: "alex.smith@example.com",
  },
  status: i % 4 === 0 ? "In Progress" : i % 5 === 0 ? "Cancelled" : "Completed",
  budget: 90,
  platformFee: 4.5,
  additionalFee: 4.5,
  subTotal: 4.5,
  transactionId: `TXN-${1000 + i}`,
  bookingId: `BKG-${5000 + i}`,
  invoiceNumber: `INV-2024-${10000 + i}`,
  transactionDate: `Apr ${20 + (i % 10)}, 2022 ${10 + (i % 12)}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60} AM`,
}));

function AvatarImg({ src, name }: { src: string; name: string }) {
  return (
    <img
      src={src}
      alt={name}
      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
    />
  );
}

function PaymentBadge({ status }: { status: "Paid" | "Pending" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === "Paid"
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-amber-50 text-amber-600 border border-amber-200"
      }`}
    >
      {status}
    </span>
  );
}

function StatusBadge({ status }: { status: "Completed" | "In Progress" | "Cancelled" }) {
  const colors = {
    Completed: "bg-purple-50 text-purple-600 border border-purple-200",
    "In Progress": "bg-blue-50 text-blue-600 border border-blue-200",
    Cancelled: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <ArrowUpDown
      size={12}
      className={`inline ml-1 transition-colors ${active ? "text-primary" : "text-muted-foreground/50"}`}
    />
  );
}

export default function Payment({ lang }: { lang: Language }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("orderId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  const t = {
    title: lang === "EN" ? "Recent Payments" : "Paiements récents",
    search: lang === "EN" ? "Search" : "Rechercher",
    allOrders: lang === "EN" ? "All Orders" : "Toutes les commandes",
    date: lang === "EN" ? "Date" : "Date",
    buyer: lang === "EN" ? "Buyer" : "Acheteur",
    payment: lang === "EN" ? "Payment" : "Paiement",
    worker: lang === "EN" ? "Worker" : "Artisan",
    status: lang === "EN" ? "Status" : "Statut",
    budget: lang === "EN" ? "Buget" : "Budget",
    platformFee: lang === "EN" ? "Platform Fee" : "Frais plateforme",
    additionalFee: lang === "EN" ? "Additional Fee" : "Frais supplémentaires",
    subTotal: lang === "EN" ? "Sub Total" : "Sous-total",
    showResult: lang === "EN" ? "Show result:" : "Résultats :",
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_PAYMENTS.filter(
      (p) =>
        !q ||
        p.orderId.toLowerCase().includes(q) ||
        p.buyer.name.toLowerCase().includes(q) ||
        p.worker.name.toLowerCase().includes(q)
    ).sort((a, b) => {
      let cmp = 0;
      if (sortKey === "orderId") cmp = a.orderId.localeCompare(b.orderId);
      else if (sortKey === "date") cmp = a.date.localeCompare(b.date);
      else if (sortKey === "budget") cmp = a.budget - b.budget;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++)
        pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Search & Title */}
        <div className="px-5 py-4 border-b border-border space-y-4">
          <div className="relative max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
            />
          </div>
          <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("orderId")}>
                  {t.allOrders}
                  <SortIcon active={sortKey === "orderId"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("date")}>
                  {t.date}
                  <SortIcon active={sortKey === "date"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t.buyer}
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t.payment}
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t.worker}
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t.status}
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("budget")}>
                  {t.budget}
                  <SortIcon active={sortKey === "budget"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  {t.platformFee}
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  {t.additionalFee}
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  {t.subTotal}
                </th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((payment) => (
                <tr
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-medium text-primary whitespace-nowrap">
                    {payment.orderId}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                    {payment.date}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <AvatarImg src={payment.buyer.avatar} name={payment.buyer.name} />
                      <span className="font-medium text-foreground">{payment.buyer.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <PaymentBadge status={payment.paymentStatus} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <AvatarImg src={payment.worker.avatar} name={payment.worker.name} />
                      <span className="font-medium text-foreground">{payment.worker.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-foreground whitespace-nowrap">
                    ${payment.budget}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                    ${payment.platformFee}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                    ${payment.additionalFee}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-foreground whitespace-nowrap">
                    ${payment.subTotal}
                  </td>
                  <td className="px-3 py-3.5">
                    <ActionMenu
                      items={[
                        {
                          label: lang === "EN" ? "View Details" : "Voir les détails",
                          icon: <Eye size={14} />,
                          onClick: () => setSelectedPayment(payment),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t.showResult}</span>
              <div className="relative">
                <button
                  onClick={() => setPageSizeOpen(!pageSizeOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {pageSize}
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${pageSizeOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {pageSizeOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-20 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50">
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setPageSize(s);
                          setPage(1);
                          setPageSizeOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                          pageSize === s ? "text-primary font-semibold" : "text-foreground"
                        }`}
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
                  <span
                    key={`ellipsis-${i}`}
                    className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={pn}
                    onClick={() => setPage(pn as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      page === pn
                        ? "text-white shadow-sm"
                        : "border border-border text-muted-foreground hover:bg-muted"
                    }`}
                    style={
                      page === pn
                        ? { background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }
                        : undefined
                    }
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

      {/* Payment Details Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title={lang === "EN" ? "Payment Details" : "Détails du paiement"}
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            {/* Transaction Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">{selectedPayment.transactionId}</h3>
                <p className="text-sm text-muted-foreground">
                  {lang === "EN" ? "Transaction Date" : "Date de transaction"}: {selectedPayment.transactionDate}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <PaymentBadge status={selectedPayment.paymentStatus} />
                <StatusBadge status={selectedPayment.status} />
              </div>
            </div>

            {/* IDs Section */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {lang === "EN" ? "Order ID" : "ID de commande"}
                </p>
                <p className="text-sm font-semibold text-primary">{selectedPayment.orderId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {lang === "EN" ? "Booking ID" : "ID de réservation"}
                </p>
                <p className="text-sm font-semibold text-foreground">{selectedPayment.bookingId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {lang === "EN" ? "Transaction ID" : "ID de transaction"}
                </p>
                <p className="text-sm font-semibold text-foreground">{selectedPayment.transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {lang === "EN" ? "Invoice Number" : "Numéro de facture"}
                </p>
                <p className="text-sm font-semibold text-foreground">{selectedPayment.invoiceNumber}</p>
              </div>
            </div>

            {/* Customer & Artisan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  {lang === "EN" ? "Customer" : "Client"}
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedPayment.buyer.avatar}
                    alt={selectedPayment.buyer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{selectedPayment.buyer.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPayment.buyer.email}</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  {lang === "EN" ? "Artisan" : "Artisan"}
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedPayment.worker.avatar}
                    alt={selectedPayment.worker.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{selectedPayment.worker.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPayment.worker.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {lang === "EN" ? "Payment Breakdown" : "Détail du paiement"}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-foreground">
                      {lang === "EN" ? "Budget Amount" : "Montant du budget"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">${selectedPayment.budget}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-foreground">
                      {lang === "EN" ? "Platform Fee" : "Frais de plateforme"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">${selectedPayment.platformFee}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-foreground">
                      {lang === "EN" ? "Additional Fee" : "Frais supplémentaires"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">${selectedPayment.additionalFee}</span>
                </div>

                <div className="flex items-center justify-between py-3 bg-primary/5 rounded-lg px-4 mt-2">
                  <span className="text-base font-semibold text-foreground">
                    {lang === "EN" ? "Sub Total" : "Sous-total"}
                  </span>
                  <span className="text-lg font-bold text-primary">${selectedPayment.subTotal}</span>
                </div>
              </div>
            </div>

            {/* Transaction Date/Time */}
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-600 mb-0.5">
                  {lang === "EN" ? "Transaction Date & Time" : "Date et heure de transaction"}
                </p>
                <p className="text-sm font-semibold text-blue-700">{selectedPayment.transactionDate}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div className="h-4" />
    </main>
  );
}
