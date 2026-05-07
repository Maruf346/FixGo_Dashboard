import { useState, useMemo } from "react";
import {
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Eye,
  UserX,
  Trash2,
} from "lucide-react";
import { Modal, ConfirmModal } from "../components/Modal";
import { ActionMenu } from "../components/ActionMenu";

type Language = "EN" | "FR";
type SortKey = "name" | "totalOrders" | "completed" | "cancelled";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [8, 16, 20];

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  completed: number;
  cancelled: number;
  location: string;
  avatar: string;
  memberSince: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: "c1",  name: "Justin Leo",    email: "alexsmith@gmail.com",    phone: "+1 887 049 8937", totalOrders: 50, completed: 40, cancelled: 10, location: "Montreal, Quebec",      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format", memberSince: "Jan 2022" },
  { id: "c2",  name: "Sarah Miller",  email: "sarah.miller@gmail.com", phone: "+1 514 223 4567", totalOrders: 32, completed: 28, cancelled: 4,  location: "Toronto, ON",           avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format", memberSince: "Feb 2022" },
  { id: "c3",  name: "Maria Costa",   email: "maria.costa@gmail.com",  phone: "+1 416 789 1234", totalOrders: 45, completed: 38, cancelled: 7,  location: "Vancouver, BC",         avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format", memberSince: "Mar 2022" },
  { id: "c4",  name: "David Chen",    email: "david.chen@gmail.com",   phone: "+1 604 567 8901", totalOrders: 28, completed: 25, cancelled: 3,  location: "Calgary, AB",           avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&auto=format", memberSince: "Jan 2022" },
  { id: "c5",  name: "Lena Dubois",   email: "lena.dubois@gmail.com",  phone: "+1 403 234 5678", totalOrders: 55, completed: 48, cancelled: 7,  location: "Ottawa, ON",            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format", memberSince: "Apr 2022" },
  { id: "c6",  name: "Omar Hassan",   email: "omar.hassan@gmail.com",  phone: "+1 613 456 7890", totalOrders: 22, completed: 20, cancelled: 2,  location: "Edmonton, AB",          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&auto=format", memberSince: "Feb 2022" },
  { id: "c7",  name: "Priya Nair",    email: "priya.nair@gmail.com",   phone: "+1 780 123 4567", totalOrders: 38, completed: 32, cancelled: 6,  location: "Winnipeg, MB",          avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&auto=format", memberSince: "Mar 2022" },
  { id: "c8",  name: "Jean Moreau",   email: "jean.moreau@gmail.com",  phone: "+1 204 890 1234", totalOrders: 42, completed: 36, cancelled: 6,  location: "Quebec City, QC",       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format", memberSince: "Jan 2022" },
  { id: "c9",  name: "Emma Schulz",   email: "emma.schulz@gmail.com",  phone: "+1 418 567 8901", totalOrders: 31, completed: 27, cancelled: 4,  location: "Halifax, NS",           avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&auto=format", memberSince: "Apr 2022" },
  { id: "c10", name: "Kevin Trần",    email: "kevin.tran@gmail.com",   phone: "+1 902 234 5678", totalOrders: 26, completed: 22, cancelled: 4,  location: "Victoria, BC",          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format", memberSince: "Feb 2022" },
  { id: "c11", name: "Chloé Martin",  email: "chloe.martin@gmail.com", phone: "+1 250 456 7890", totalOrders: 48, completed: 42, cancelled: 6,  location: "Saskatoon, SK",         avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format", memberSince: "Mar 2022" },
  { id: "c12", name: "Ravi Patel",    email: "ravi.patel@gmail.com",   phone: "+1 306 123 4567", totalOrders: 35, completed: 30, cancelled: 5,  location: "Regina, SK",            avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=40&h=40&fit=crop&auto=format", memberSince: "Jan 2022" },
  { id: "c13", name: "Nina Wolf",     email: "nina.wolf@gmail.com",    phone: "+1 306 890 1234", totalOrders: 29, completed: 26, cancelled: 3,  location: "St. John's, NL",        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&auto=format", memberSince: "Apr 2022" },
  { id: "c14", name: "Lucas Kim",     email: "lucas.kim@gmail.com",    phone: "+1 709 567 8901", totalOrders: 52, completed: 46, cancelled: 6,  location: "Charlottetown, PE",     avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format", memberSince: "Feb 2022" },
  { id: "c15", name: "Amira Benali",  email: "amira.benali@gmail.com", phone: "+1 902 234 5678", totalOrders: 41, completed: 36, cancelled: 5,  location: "Fredericton, NB",       avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format", memberSince: "Mar 2022" },
  { id: "c16", name: "Ethan Brown",   email: "ethan.brown@gmail.com",  phone: "+1 506 456 7890", totalOrders: 33, completed: 29, cancelled: 4,  location: "Yellowknife, NT",       avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&auto=format", memberSince: "Jan 2022" },
  { id: "c17", name: "Sophie Blanc",  email: "sophie.blanc@gmail.com", phone: "+1 867 123 4567", totalOrders: 37, completed: 32, cancelled: 5,  location: "Whitehorse, YT",        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format", memberSince: "Apr 2022" },
  { id: "c18", name: "Daniel Ortiz",  email: "daniel.ortiz@gmail.com", phone: "+1 867 890 1234", totalOrders: 44, completed: 38, cancelled: 6,  location: "Iqaluit, NU",           avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&auto=format", memberSince: "Feb 2022" },
  { id: "c19", name: "Isabelle Roy",  email: "isabelle.roy@gmail.com", phone: "+1 867 567 8901", totalOrders: 46, completed: 40, cancelled: 6,  location: "Moncton, NB",           avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format", memberSince: "Mar 2022" },
  { id: "c20", name: "Aaron Müller",  email: "aaron.muller@gmail.com", phone: "+1 506 234 5678", totalOrders: 39, completed: 34, cancelled: 5,  location: "Thunder Bay, ON",       avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&auto=format", memberSince: "Jan 2022" },
];

function AvatarImg({ src, name }: { src: string; name: string }) {
  return <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" />;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return <ArrowUpDown size={12} className={`inline ml-1 transition-colors ${active ? "text-primary" : "text-muted-foreground/50"}`} />;
}

function EmptyState({ lang }: { lang: Language }) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <Inbox size={24} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground text-center">
          {lang === "EN" ? "No clients found" : "Aucun client trouvé"}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {lang === "EN" ? "Try adjusting your search or check back later." : "Essayez d'affiner votre recherche."}
        </p>
      </div>
    </div>
  );
}

export default function ClientsManagement({ lang }: { lang: Language }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deactivateClient, setDeactivateClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);

  const t = {
    search:       lang === "EN" ? "Search clients by name, email, location…" : "Rechercher par nom, email, localisation…",
    name:         lang === "EN" ? "Name" : "Nom",
    email:        lang === "EN" ? "Email" : "Email",
    phone:        lang === "EN" ? "Phone number" : "Téléphone",
    totalOrders:  lang === "EN" ? "Total Orders" : "Commandes totales",
    completed:    lang === "EN" ? "Completed" : "Complétées",
    cancelled:    lang === "EN" ? "Cancelled" : "Annulées",
    location:     lang === "EN" ? "Location" : "Localisation",
    showResult:   lang === "EN" ? "Show result:" : "Résultats :",
    orders:       lang === "EN" ? "orders" : "commandes",
    completedTxt: lang === "EN" ? "completed" : "complétées",
    cancelledTxt: lang === "EN" ? "cancelled" : "annulées",
    actions:      lang === "EN" ? "Actions" : "Actions",
    viewDetails:  lang === "EN" ? "View Details" : "Voir détails",
    deactivate:   lang === "EN" ? "Deactivate" : "Désactiver",
    delete:       lang === "EN" ? "Delete" : "Supprimer",
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_CLIENTS.filter(c =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    ).sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "totalOrders") cmp = a.totalOrders - b.totalOrders;
      else if (sortKey === "completed") cmp = a.completed - b.completed;
      else if (sortKey === "cancelled") cmp = a.cancelled - b.cancelled;
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
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Search bar */}
        <div className="px-5 py-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("name")}>
                  {t.name}<SortIcon active={sortKey === "name"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.email}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.phone}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("totalOrders")}>
                  {t.totalOrders}<SortIcon active={sortKey === "totalOrders"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("completed")}>
                  {t.completed}<SortIcon active={sortKey === "completed"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("cancelled")}>
                  {t.cancelled}<SortIcon active={sortKey === "cancelled"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.location}</th>
                <th className="px-3 py-3">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <EmptyState lang={lang} />
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedClient(c)}
                    className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <AvatarImg src={c.avatar} name={c.name} />
                        <span className="font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.email}</td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{c.phone}</td>
                    <td className="px-5 py-3.5 text-foreground">{c.totalOrders} {t.orders}</td>
                    <td className="px-5 py-3.5 text-foreground">{c.completed} {t.completedTxt}</td>
                    <td className="px-5 py-3.5 text-foreground">{c.cancelled} {t.cancelledTxt}</td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{c.location}</td>
                    <td className="px-3 py-3.5">
                      <ActionMenu
                        items={[
                          {
                            label: t.viewDetails,
                            icon: <Eye size={14} />,
                            onClick: () => setSelectedClient(c),
                          },
                          {
                            label: t.deactivate,
                            icon: <UserX size={14} />,
                            onClick: () => setDeactivateClient(c),
                            className: "text-orange-600",
                          },
                          {
                            label: t.delete,
                            icon: <Trash2 size={14} />,
                            onClick: () => setDeleteClient(c),
                            className: "text-red-600",
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

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-border">
          {paginated.length === 0 ? (
            <div className="px-5 py-16 text-center"><EmptyState lang={lang} /></div>
          ) : (
            paginated.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedClient(c)}
                className="px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AvatarImg src={c.avatar} name={c.name} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.email}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.phone}</p>
                    <p className="text-xs text-foreground">{c.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.location}</p>
                    <p className="text-xs text-foreground truncate">{c.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.totalOrders}</p>
                    <p className="text-sm font-bold text-foreground">{c.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.completed}</p>
                    <p className="text-sm font-bold text-green-600">{c.completed}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.cancelled}</p>
                    <p className="text-sm font-bold text-red-600">{c.cancelled}</p>
                  </div>
                </div>
              </div>
            ))
          )}
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
                  <ChevronDown size={12} className={`transition-transform ${pageSizeOpen ? "rotate-180" : ""}`} />
                </button>
                {pageSizeOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-20 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50">
                    {PAGE_SIZE_OPTIONS.map(s => (
                      <button key={s} onClick={() => { setPageSize(s); setPage(1); setPageSizeOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${pageSize === s ? "text-primary font-semibold" : "text-foreground"}`}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
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

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title={lang === "EN" ? "Client Details" : "Détails du client"}
          size="lg"
        >
          <div className="space-y-6">
            {/* Client Header */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <img src={selectedClient.avatar} alt={selectedClient.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedClient.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
              </div>
            </div>

            {/* Client Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {lang === "EN" ? "Total Bookings" : "Réservations totales"}
                </p>
                <p className="text-2xl font-bold text-foreground">{selectedClient.totalOrders}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 mb-1">
                  {lang === "EN" ? "Completed" : "Complétées"}
                </p>
                <p className="text-2xl font-bold text-green-600">{selectedClient.completed}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-xs text-red-700 mb-1">
                  {lang === "EN" ? "Cancelled" : "Annulées"}
                </p>
                <p className="text-2xl font-bold text-red-600">{selectedClient.cancelled}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 mb-1">
                  {lang === "EN" ? "Member Since" : "Membre depuis"}
                </p>
                <p className="text-lg font-bold text-blue-600">{selectedClient.memberSince}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Location" : "Emplacement"}
                </h4>
                <p className="text-sm text-muted-foreground">{selectedClient.location}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Current Status" : "Statut actuel"}
                </h4>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-200">
                  {lang === "EN" ? "Active" : "Actif"}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Payment History" : "Historique des paiements"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {lang === "EN"
                    ? "All payments completed on time. Excellent payment record."
                    : "Tous les paiements effectués à temps. Excellent historique de paiement."}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Deactivate Confirmation Modal */}
      {deactivateClient && (
        <ConfirmModal
          isOpen={!!deactivateClient}
          onClose={() => setDeactivateClient(null)}
          onConfirm={() => {
            console.log("Deactivating client:", deactivateClient.id);
          }}
          title={lang === "EN" ? "Deactivate Client" : "Désactiver le client"}
          message={
            lang === "EN"
              ? `Are you sure you want to deactivate ${deactivateClient.name}? They will not be able to make new bookings.`
              : `Êtes-vous sûr de vouloir désactiver ${deactivateClient.name}? Ils ne pourront plus effectuer de nouvelles réservations.`
          }
          confirmText={lang === "EN" ? "Deactivate" : "Désactiver"}
          cancelText={lang === "EN" ? "Cancel" : "Annuler"}
          type="warning"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteClient && (
        <ConfirmModal
          isOpen={!!deleteClient}
          onClose={() => setDeleteClient(null)}
          onConfirm={() => {
            console.log("Deleting client:", deleteClient.id);
          }}
          title={lang === "EN" ? "Delete Client" : "Supprimer le client"}
          message={
            lang === "EN"
              ? `Are you sure you want to permanently delete ${deleteClient.name}? This action cannot be undone and all client data will be lost.`
              : `Êtes-vous sûr de vouloir supprimer définitivement ${deleteClient.name}? Cette action est irréversible et toutes les données du client seront perdues.`
          }
          confirmText={lang === "EN" ? "Delete Permanently" : "Supprimer définitivement"}
          cancelText={lang === "EN" ? "Cancel" : "Annuler"}
          type="danger"
        />
      )}
    </main>
  );
}
