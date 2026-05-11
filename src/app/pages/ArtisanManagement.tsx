import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Star,
  Eye,
  UserX,
  UserCheck,
  Trash2,
  MapPin,
  Briefcase,
  Award,
  Zap,
} from "lucide-react";
import { Modal, ConfirmModal } from "../components/Modal";
import { ActionMenu } from "../components/ActionMenu";
import { getArtisans, getArtisanDetail, toggleUserActive, deleteUser, Artisan, ArtisanDetail } from "../../services/artisans";

type Language = "EN" | "FR";
type SortKey = "full_name" | "total_jobs_done" | "average_rating" | "-joined_at";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [8, 16, 20];

interface ArtisanWithLocation extends Artisan {
  locationDisplay: string;
}

function AvatarImg({ src, name, size = 32, className = "" }: { src: string; name: string; size?: number; className?: string }) {
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

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return <ArrowUpDown size={12} className={`inline ml-1 transition-colors ${active ? "text-primary" : "text-muted-foreground/50"}`} />;
}

function RatingStars({ rating }: { rating: number }) {
  const ratingNum = parseFloat(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= Math.round(ratingNum) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
      <span className="text-sm font-medium text-foreground ml-1">{ratingNum.toFixed(1)}</span>
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
          {lang === "EN" ? "No artisans found" : "Aucun artisan trouvé"}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          {lang === "EN" ? "Try adjusting your search or check back later." : "Essayez d'affiner votre recherche."}
        </p>
      </div>
    </div>
  );
}

export default function ArtisanManagement({ lang }: { lang: Language }) {
  const [artisans, setArtisans] = useState<ArtisanWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("-joined_at");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<ArtisanDetail | null>(null);
  const [deactivateArtisan, setDeactivateArtisan] = useState<ArtisanWithLocation | null>(null);
  const [deleteArtisan, setDeleteArtisan] = useState<ArtisanWithLocation | null>(null);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getArtisans({
        page,
        page_size: pageSize,
        search: search || undefined,
        ordering: sortKey,
      });
      const artisansWithLocation = response.results.map((artisan: Artisan) => ({
        ...artisan,
        locationDisplay: artisan.location
          ? `${artisan.location.city || ""}, ${artisan.location.state || ""}, ${artisan.location.country || ""}`.replace(/^, |, $/, "").replace(/, , /g, ", ")
          : "N/A",
      }));
      setArtisans(artisansWithLocation);
      setTotalCount(response.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch artisans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, [page, pageSize, sortKey, search]);

  const fetchArtisanDetail = async (artisanId: string) => {
    try {
      const detail = await getArtisanDetail(artisanId);
      setSelectedArtisan(detail);
    } catch (err) {
      console.error("Failed to fetch artisan detail:", err);
    }
  };

  useEffect(() => {
    if (selectedArtisan && typeof selectedArtisan === 'object' && 'id' in selectedArtisan && !('booking_history' in selectedArtisan)) {
      fetchArtisanDetail(selectedArtisan.id);
    }
  }, [selectedArtisan]);

  const t = {
    search:        lang === "EN" ? "Search artisans by name, email…" : "Rechercher par nom, email…",
    name:          lang === "EN" ? "Name" : "Nom",
    email:         lang === "EN" ? "Email" : "Email",
    phone:         lang === "EN" ? "Phone number" : "Téléphone",
    jobsCompleted: lang === "EN" ? "Jobs Done" : "Emplois effectués",
    rating:        lang === "EN" ? "Rating" : "Note",
    location:      lang === "EN" ? "Location" : "Localisation",
    showResult:    lang === "EN" ? "Show result:" : "Résultats :",
    actions:       lang === "EN" ? "Actions" : "Actions",
    viewDetails:   lang === "EN" ? "View Details" : "Voir détails",
    deactivate:    lang === "EN" ? "Deactivate" : "Désactiver",
    activate:      lang === "EN" ? "Activate" : "Activer",
    delete:        lang === "EN" ? "Delete" : "Supprimer",
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortKey(key.startsWith('-') ? key.substring(1) as SortKey : `-${key}` as SortKey);
    } else {
      setSortKey(key);
    }
    setPage(1);
  };

  const filtered = artisans;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginated = artisans;

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

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-50 text-green-600 border-green-200";
      case "pending": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "rejected": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getVerificationStatusLabel = (status: string) => {
    switch (status) {
      case "verified": return lang === "EN" ? "Verified" : "Vérifié";
      case "pending": return lang === "EN" ? "Pending Review" : "En attente";
      case "rejected": return lang === "EN" ? "Rejected" : "Rejeté";
      case "unverified": return lang === "EN" ? "Unverified" : "Non vérifié";
      default: return status;
    }
  };

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
              {lang === "EN" ? "Loading artisans..." : "Chargement des artisans..."}
            </span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchArtisans}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {lang === "EN" ? "Try Again" : "Réessayer"}
              </button>
            </div>
          </div>
        )}

        {/* Desktop table */}
        {!loading && !error && (
          <>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("full_name")}>
                  {t.name}<SortIcon active={sortKey === "full_name"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.email}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.phone}</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("total_jobs_done")}>
                  {t.jobsCompleted}<SortIcon active={sortKey === "total_jobs_done"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("average_rating")}>
                  {t.rating}<SortIcon active={sortKey === "average_rating"} dir={sortDir} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.location}</th>
                <th className="px-3 py-3">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <EmptyState lang={lang} />
                  </td>
                </tr>
              ) : (
                paginated.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedArtisan(a)}
                    className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <AvatarImg src={a.profile_picture || ""} name={a.full_name} />
                        <span className="font-medium text-foreground">{a.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{a.email}</td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{a.phone}</td>
                    <td className="px-5 py-3.5 text-foreground">{a.total_jobs_done}</td>
                    <td className="px-5 py-3.5"><RatingStars rating={a.average_rating} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{a.locationDisplay}</td>
                    <td className="px-3 py-3.5">
                      <ActionMenu
                        items={[
                          {
                            label: t.viewDetails,
                            icon: <Eye size={14} />,
                            onClick: () => setSelectedArtisan(a),
                          },
                          {
                            label: a.is_active ? t.deactivate : t.activate,
                            icon: a.is_active ? <UserX size={14} /> : <UserCheck size={14} />,
                            onClick: () => setDeactivateArtisan(a),
                            className: a.is_active ? "text-orange-600" : "text-green-600",
                          },
                          {
                            label: t.delete,
                            icon: <Trash2 size={14} />,
                            onClick: () => setDeleteArtisan(a),
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
            paginated.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedArtisan(a)}
                className="px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <AvatarImg src={a.profile_picture || ""} name={a.full_name} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.full_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.phone}</p>
                    <p className="text-xs text-foreground">{a.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.location}</p>
                    <p className="text-xs text-foreground truncate">{a.locationDisplay}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.jobsCompleted}</p>
                    <p className="text-sm font-bold text-foreground">{a.total_jobs_done}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t.rating}</p>
                    <div className="text-xs"><RatingStars rating={a.average_rating} /></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
          </>
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
                  <ChevronDown size={14} className={`transition-transform ${pageSizeOpen ? "rotate-180" : ""}`} />
                </button>
                {pageSizeOpen && (
                  <div className="absolute z-10 top-full left-0 mt-1 border border-border rounded-lg bg-card shadow-lg">
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        onClick={() => { setPageSize(size); setPageSizeOpen(false); setPage(1); }}
                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${size === pageSize ? "bg-muted font-medium" : ""}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers.map((num, i) => (
                <button
                  key={i}
                  onClick={() => typeof num === "number" && setPage(num)}
                  disabled={num === "…"}
                  className={`px-2.5 py-1.5 text-sm rounded-lg transition-colors ${
                    num === page
                      ? "bg-primary text-primary-foreground font-medium"
                      : num === "…"
                      ? "text-muted-foreground cursor-default"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Artisan Details Modal */}
      {selectedArtisan && (
        <Modal
          isOpen={!!selectedArtisan}
          onClose={() => setSelectedArtisan(null)}
          title={lang === "EN" ? "Artisan Details" : "Détails de l'artisan"}
          size="lg"
        >
          <div className="space-y-6">
            {/* Artisan Header */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <AvatarImg src={selectedArtisan.profile_picture || ""} name={selectedArtisan.full_name} size={80} className="border-4 border-white shadow-md" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedArtisan.full_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedArtisan.email}</p>
                <p className="text-sm text-muted-foreground">{selectedArtisan.phone}</p>
              </div>
            </div>

            {/* Status and Verification */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 mb-1">{lang === "EN" ? "Occupation" : "Profession"}</p>
                <p className="text-sm font-semibold text-foreground">{selectedArtisan.occupation || "N/A"}</p>
              </div>
              <div className={`p-3 rounded-lg ${selectedArtisan.is_online ? "bg-green-50" : "bg-red-50"}`}>
                <p className={`text-xs mb-1 ${selectedArtisan.is_online ? "text-green-700" : "text-red-700"}`}>
                  {lang === "EN" ? "Status" : "Statut"}
                </p>
                <p className={`text-sm font-semibold ${selectedArtisan.is_online ? "text-green-600" : "text-red-600"}`}>
                  {selectedArtisan.is_online ? (lang === "EN" ? "Online" : "En ligne") : (lang === "EN" ? "Offline" : "Hors ligne")}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{lang === "EN" ? "Account Status" : "Statut du compte"}</p>
                <p className={`text-sm font-semibold ${selectedArtisan.is_active ? "text-green-600" : "text-red-600"}`}>
                  {selectedArtisan.is_active ? (lang === "EN" ? "Active" : "Actif") : (lang === "EN" ? "Inactive" : "Inactif")}
                </p>
              </div>
              <div className={`p-3 rounded-lg border ${getVerificationStatusColor(selectedArtisan.verification_status)}`}>
                <p className={`text-xs mb-1 ${getVerificationStatusColor(selectedArtisan.verification_status).split(" ")[1]}`}>
                  {lang === "EN" ? "Verification" : "Vérification"}
                </p>
                <p className={`text-sm font-semibold`}>
                  {getVerificationStatusLabel(selectedArtisan.verification_status)}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-700 mb-1">{lang === "EN" ? "Rating" : "Note"}</p>
                <div><RatingStars rating={selectedArtisan.average_rating} /></div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700 mb-1">{lang === "EN" ? "Reviews" : "Avis"}</p>
                <p className="text-sm font-semibold text-purple-600">{selectedArtisan.review_count}</p>
              </div>
            </div>

            {/* Bio */}
            {selectedArtisan.bio && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">{lang === "EN" ? "Bio" : "Biographie"}</h4>
                <p className="text-sm text-muted-foreground">{selectedArtisan.bio}</p>
              </div>
            )}

            {/* Professional Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{lang === "EN" ? "Experience" : "Expérience"}</p>
                <p className="text-sm font-semibold text-foreground">{selectedArtisan.years_of_experience} {lang === "EN" ? "years" : "ans"}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{lang === "EN" ? "Hourly Rate" : "Tarif horaire"}</p>
                <p className="text-sm font-semibold text-foreground">${selectedArtisan.hourly_rate}</p>
              </div>
              <div className={`p-3 rounded-lg ${selectedArtisan.is_available ? "bg-green-50" : "bg-red-50"}`}>
                <p className={`text-xs mb-1 ${selectedArtisan.is_available ? "text-green-700" : "text-red-700"}`}>
                  {lang === "EN" ? "Availability" : "Disponibilité"}
                </p>
                <p className={`text-sm font-semibold ${selectedArtisan.is_available ? "text-green-600" : "text-red-600"}`}>
                  {selectedArtisan.is_available ? (lang === "EN" ? "Available" : "Disponible") : (lang === "EN" ? "Unavailable" : "Non disponible")}
                </p>
              </div>
            </div>

            {/* Skills */}
            {selectedArtisan.skills && selectedArtisan.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">{lang === "EN" ? "Skills" : "Compétences"}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArtisan.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Areas */}
            {selectedArtisan.service_areas && selectedArtisan.service_areas.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">{lang === "EN" ? "Service Areas" : "Zones de service"}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArtisan.service_areas.map((area, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                      <MapPin size={12} className="inline mr-1" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Job Stats */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">{lang === "EN" ? "Job Statistics" : "Statistiques d'emploi"}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{lang === "EN" ? "Total Orders" : "Commandes totales"}</p>
                  <p className="text-lg font-bold text-foreground">{selectedArtisan.total_orders_count}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700 mb-1">{lang === "EN" ? "Completed" : "Complétées"}</p>
                  <p className="text-lg font-bold text-green-600">{selectedArtisan.completed_orders_count}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-700 mb-1">{lang === "EN" ? "Cancelled" : "Annulées"}</p>
                  <p className="text-lg font-bold text-red-600">{selectedArtisan.cancelled_orders_count}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 mb-1">{lang === "EN" ? "Total Earnings" : "Revenus totaux"}</p>
                  <p className="text-lg font-bold text-blue-600">${selectedArtisan.total_earnings}</p>
                </div>
              </div>
            </div>

            {/* Member Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{lang === "EN" ? "Member Since" : "Membre depuis"}</p>
                <p className="text-sm font-semibold text-foreground">{new Date(selectedArtisan.joined_at).toLocaleDateString()}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{lang === "EN" ? "Date of Birth" : "Date de naissance"}</p>
                <p className="text-sm font-semibold text-foreground">{selectedArtisan.birth_date ? new Date(selectedArtisan.birth_date).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">{lang === "EN" ? "Location" : "Emplacement"}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedArtisan.location
                  ? `${selectedArtisan.location.address_line}, ${selectedArtisan.location.city}, ${selectedArtisan.location.state}, ${selectedArtisan.location.zip_code}, ${selectedArtisan.location.country}`
                  : "N/A"}
              </p>
            </div>

            {/* Booking History */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">{lang === "EN" ? "Recent Bookings" : "Réservations récentes"}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead className="bg-muted/20">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">{lang === "EN" ? "Date" : "Date"}</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">{lang === "EN" ? "Service" : "Service"}</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">{lang === "EN" ? "Client" : "Client"}</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">{lang === "EN" ? "Status" : "Statut"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedArtisan.booking_history?.map((booking, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="px-3 py-2 text-sm">{new Date(booking.scheduled_date).toLocaleDateString()}</td>
                        <td className="px-3 py-2 text-sm">{booking.service_name}</td>
                        <td className="px-3 py-2 text-sm">{booking.client_name}</td>
                        <td className="px-3 py-2 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-50 text-green-600' :
                            booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                            booking.status === 'requested' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-sm text-muted-foreground">
                          {lang === "EN" ? "No bookings available" : "Aucune réservation disponible"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}


      {/* Toggle Active Confirmation Modal */}
      {deactivateArtisan && (
        <ConfirmModal
          isOpen={!!deactivateArtisan}
          onClose={() => setDeactivateArtisan(null)}
          onConfirm={async () => {
            try {
              setToggling(true);
              await toggleUserActive(deactivateArtisan.id);
              setDeactivateArtisan(null);
              fetchArtisans();
            } catch (err) {
              console.error("Failed to toggle user active:", err);
            } finally {
              setToggling(false);
            }
          }}
          title={deactivateArtisan.is_active ? (lang === "EN" ? "Deactivate Artisan" : "Désactiver l'artisan") : (lang === "EN" ? "Activate Artisan" : "Activer l'artisan")}
          message={
            deactivateArtisan.is_active
              ? (lang === "EN"
                  ? `Are you sure you want to deactivate ${deactivateArtisan.full_name}? They will not be able to accept new bookings.`
                  : `Êtes-vous sûr de vouloir désactiver ${deactivateArtisan.full_name}? Ils ne pourront plus accepter de nouvelles réservations.`)
              : (lang === "EN"
                  ? `Are you sure you want to activate ${deactivateArtisan.full_name}? They will be able to accept new bookings again.`
                  : `Êtes-vous sûr de vouloir activer ${deactivateArtisan.full_name}? Ils pourront à nouveau accepter de nouvelles réservations.`)
          }
          confirmText={deactivateArtisan.is_active ? (lang === "EN" ? "Deactivate" : "Désactiver") : (lang === "EN" ? "Activate" : "Activer")}
          cancelText={lang === "EN" ? "Cancel" : "Annuler"}
          type={deactivateArtisan.is_active ? "warning" : "success"}
          loading={toggling}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteArtisan && (
        <ConfirmModal
          isOpen={!!deleteArtisan}
          onClose={() => setDeleteArtisan(null)}
          onConfirm={async () => {
            try {
              setDeleting(true);
              await deleteUser(deleteArtisan.id);
              setDeleteArtisan(null);
              fetchArtisans();
            } catch (err) {
              console.error("Failed to delete user:", err);
            } finally {
              setDeleting(false);
            }
          }}
          title={lang === "EN" ? "Delete Artisan" : "Supprimer l'artisan"}
          message={
            lang === "EN"
              ? `Are you sure you want to permanently delete ${deleteArtisan.full_name}? This action cannot be undone and all artisan data will be lost.`
              : `Êtes-vous sûr de vouloir supprimer définitivement ${deleteArtisan.full_name}? Cette action est irréversible et toutes les données de l'artisan seront perdues.`
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
