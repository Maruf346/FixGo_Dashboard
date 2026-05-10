import { useState, useEffect, useMemo } from "react";
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
  UserCheck,
} from "lucide-react";
import { Modal, ConfirmModal } from "../components/Modal";
import { ActionMenu } from "../components/ActionMenu";
import { getClients, getClientDetail, toggleUserActive, deleteUser, Client, ClientDetail } from "../../services/clients";

type Language = "EN" | "FR";
type SortKey = "full_name" | "total_orders_count" | "completed_orders_count" | "cancelled_orders_count";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [8, 16, 20];

interface ClientWithLocation extends Client {
  locationDisplay: string;
}

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
  const [clients, setClients] = useState<ClientWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("full_name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [deactivateClient, setDeactivateClient] = useState<ClientWithLocation | null>(null);
  const [deleteClient, setDeleteClient] = useState<ClientWithLocation | null>(null);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordering = sortDir === "asc" ? sortKey : `-${sortKey}`;
      const response = await getClients({
        page,
        page_size: pageSize,
        search: search || undefined,
        ordering,
      });
      const clientsWithLocation = response.results.map((client: Client) => ({
        ...client,
        locationDisplay: `${client.location.city || ""}, ${client.location.state || ""}, ${client.location.country || ""}`.replace(/^, |, $/, "").replace(/, , /g, ", "),
      }));
      setClients(clientsWithLocation);
      setTotalCount(response.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, pageSize, sortKey, sortDir, search]);

  const fetchClientDetail = async (clientId: string) => {
    try {
      const detail = await getClientDetail(clientId);
      setSelectedClient(detail);
    } catch (err) {
      console.error("Failed to fetch client detail:", err);
    }
  };

  useEffect(() => {
    if (selectedClient && typeof selectedClient === 'object' && 'id' in selectedClient && !('booking_history' in selectedClient)) {
      fetchClientDetail(selectedClient.id);
    }
  }, [selectedClient]);

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
    activate:     lang === "EN" ? "Activate" : "Activer",
    delete:       lang === "EN" ? "Delete" : "Supprimer",
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = clients;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginated = clients;

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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              {lang === "EN" ? "Loading clients..." : "Chargement des clients..."}
            </span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchClients}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {lang === "EN" ? "Try Again" : "Réessayer"}
              </button>
            </div>
          </div>
        )}

        {/* Desktop table */}
        {!loading && !error && (
          <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("full_name")}>
                  {t.name}<SortIcon active={sortKey === "full_name"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.email}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.phone}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("total_orders_count")}>
                  {t.totalOrders}<SortIcon active={sortKey === "total_orders_count"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("completed_orders_count")}>
                  {t.completed}<SortIcon active={sortKey === "completed_orders_count"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("cancelled_orders_count")}>
                  {t.cancelled}<SortIcon active={sortKey === "cancelled_orders_count"} dir={sortDir} />
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
                        <AvatarImg src={c.profile_picture || ""} name={c.full_name} />
                        <span className="font-medium text-foreground">{c.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.email}</td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{c.phone}</td>
                    <td className="px-5 py-3.5 text-foreground">{c.total_orders_count} {t.orders}</td>
                    <td className="px-5 py-3.5 text-foreground">{c.completed_orders_count} {t.completedTxt}</td>
                    <td className="px-5 py-3.5 text-foreground">{c.cancelled_orders_count} {t.cancelledTxt}</td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{c.locationDisplay}</td>
                    <td className="px-3 py-3.5">
                      <ActionMenu
                        items={[
                          {
                            label: t.viewDetails,
                            icon: <Eye size={14} />,
                            onClick: () => setSelectedClient(c),
                          },
                          {
                            label: c.is_active ? t.deactivate : t.activate,
                            icon: c.is_active ? <UserX size={14} /> : <UserCheck size={14} />,
                            onClick: () => setDeactivateClient(c),
                            className: c.is_active ? "text-orange-600" : "text-green-600",
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

        )}

        {/* Mobile card list */}
        {!loading && !error && (
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
                <div className="flex items-center gap-2">
                  <AvatarImg src={c.profile_picture || ""} name={c.full_name} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.phone}</p>
                    <p className="text-xs text-foreground">{c.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.location}</p>
                    <p className="text-xs text-foreground truncate">{c.locationDisplay}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.totalOrders}</p>
                    <p className="text-sm font-bold text-foreground">{c.total_orders_count}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.completed}</p>
                    <p className="text-sm font-bold text-green-600">{c.completed_orders_count}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.cancelled}</p>
                    <p className="text-sm font-bold text-red-600">{c.cancelled_orders_count}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        )}

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
              <img src={selectedClient.profile_picture || ""} alt={selectedClient.full_name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedClient.full_name}</h3>
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
                <p className="text-2xl font-bold text-foreground">{selectedClient.total_orders_count}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 mb-1">
                  {lang === "EN" ? "Completed" : "Complétées"}
                </p>
                <p className="text-2xl font-bold text-green-600">{selectedClient.completed_orders_count}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-xs text-red-700 mb-1">
                  {lang === "EN" ? "Cancelled" : "Annulées"}
                </p>
                <p className="text-2xl font-bold text-red-600">{selectedClient.cancelled_orders_count}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 mb-1">
                  {lang === "EN" ? "Member Since" : "Membre depuis"}
                </p>
                <p className="text-lg font-bold text-blue-600">{new Date(selectedClient.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Location" : "Emplacement"}
                </h4>
                <p className="text-sm text-muted-foreground">{`${selectedClient.location.address_line}, ${selectedClient.location.city}, ${selectedClient.location.state}, ${selectedClient.location.country}`}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Current Status" : "Statut actuel"}
                </h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedClient.is_active
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {selectedClient.is_active ? (lang === "EN" ? "Active" : "Actif") : (lang === "EN" ? "Inactive" : "Inactif")}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === "EN" ? "Booking History" : "Historique des réservations"}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-border rounded-lg">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">{lang === "EN" ? "Date" : "Date"}</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">{lang === "EN" ? "Service" : "Service"}</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">{lang === "EN" ? "Status" : "Statut"}</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">{lang === "EN" ? "Amount" : "Montant"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClient.booking_history?.map((booking, index) => (
                        <tr key={index} className="border-t border-border">
                          <td className="px-3 py-2 text-sm">{new Date(booking.scheduled_date).toLocaleDateString()}</td>
                          <td className="px-3 py-2 text-sm">{booking.service_name}</td>
                          <td className="px-3 py-2 text-sm">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed' ? 'bg-green-50 text-green-600' :
                              booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                              'bg-yellow-50 text-yellow-600'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm font-medium">${booking.total_amount || 'N/A'}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={4} className="px-3 py-4 text-center text-sm text-muted-foreground">
                            {lang === "EN" ? "No booking history available" : "Aucun historique de réservation disponible"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Toggle Active Confirmation Modal */}
      {deactivateClient && (
        <ConfirmModal
          isOpen={!!deactivateClient}
          onClose={() => setDeactivateClient(null)}
          onConfirm={async () => {
            try {
              setToggling(true);
              await toggleUserActive(deactivateClient.id);
              setDeactivateClient(null);
              fetchClients(); // Refresh the list
            } catch (err) {
              console.error("Failed to toggle user active:", err);
            } finally {
              setToggling(false);
            }
          }}
          title={deactivateClient.is_active ? (lang === "EN" ? "Deactivate Client" : "Désactiver le client") : (lang === "EN" ? "Activate Client" : "Activer le client")}
          message={
            deactivateClient.is_active
              ? (lang === "EN"
                  ? `Are you sure you want to deactivate ${deactivateClient.full_name}? They will not be able to make new bookings.`
                  : `Êtes-vous sûr de vouloir désactiver ${deactivateClient.full_name}? Ils ne pourront plus effectuer de nouvelles réservations.`)
              : (lang === "EN"
                  ? `Are you sure you want to activate ${deactivateClient.full_name}? They will be able to make new bookings again.`
                  : `Êtes-vous sûr de vouloir activer ${deactivateClient.full_name}? Ils pourront à nouveau effectuer de nouvelles réservations.`)
          }
          confirmText={deactivateClient.is_active ? (lang === "EN" ? "Deactivate" : "Désactiver") : (lang === "EN" ? "Activate" : "Activer")}
          cancelText={lang === "EN" ? "Cancel" : "Annuler"}
          type={deactivateClient.is_active ? "warning" : "success"}
          loading={toggling}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteClient && (
        <ConfirmModal
          isOpen={!!deleteClient}
          onClose={() => setDeleteClient(null)}
          onConfirm={async () => {
            try {
              setDeleting(true);
              await deleteUser(deleteClient.id);
              setDeleteClient(null);
              fetchClients(); // Refresh the list
            } catch (err) {
              console.error("Failed to delete user:", err);
            } finally {
              setDeleting(false);
            }
          }}
          title={lang === "EN" ? "Delete Client" : "Supprimer le client"}
          message={
            lang === "EN"
              ? `Are you sure you want to permanently delete ${deleteClient.full_name}? This action cannot be undone and all client data will be lost.`
              : `Êtes-vous sûr de vouloir supprimer définitivement ${deleteClient.full_name}? Cette action est irréversible et toutes les données du client seront perdues.`
          }
          confirmText={lang === "EN" ? "Delete Permanently" : "Supprimer définitivement"}
          cancelText={lang === "EN" ? "Cancel" : "Annuler"}
          type="danger"
          loading={deleting}
        />
      )}
    </main>
  );
}
