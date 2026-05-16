import { useState, useEffect } from "react";
import { ArrowLeft, Search, Star, CheckCircle2, X, Download } from "lucide-react";
import {
  getIssueReports,
  getIssueReportDetail,
  resolveIssueReport,
  IssueReportDetail,
  IssueReportListItem,
} from "../../../services/bookings";
import { API_BASE_URL } from "../../../services/api";

type Language = "EN" | "FR";

function getTimeAgo(timestamp: string | null | undefined) {
  if (!timestamp) return "—";
  const created = new Date(timestamp);
  if (Number.isNaN(created.getTime())) return "—";
  const diffMs = Date.now() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays}d ago`;
}

function formatIssueType(raw: string | null | undefined) {
  if (!raw) return "Unknown";
  const normalized = raw.replace(/_/g, " ");
  return normalized.replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatAddress(address: IssueReportDetail["booking_address"] | null | undefined) {
  if (!address) return "—";
  const parts = [
    address.address_line,
    address.city,
    address.state,
    address.zip_code,
    address.country,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

function normalizeMediaUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
    return url;
  }
  if (url.startsWith("/")) {
    return API_BASE_URL ? `${API_BASE_URL}${url}` : url;
  }
  return url;
}

function getFileNameFromUrl(url: string | null | undefined) {
  if (!url) return "attachment";
  try {
    const parsed = new URL(url, API_BASE_URL || undefined);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.pop() || "attachment";
  } catch {
    const parts = url.split("/").filter(Boolean);
    return parts.pop() || "attachment";
  }
}

function isImageUrl(url: string | null | undefined) {
  if (!url) return false;
  return /\.(jpe?g|png|gif|webp|avif|svg|bmp|ico)(\?|#|$)/i.test(url);
}

function Avatar({ src, name, size = 40, className = "" }: { src: string | null | undefined; name: string; size?: number; className?: string }) {
  const normalizedSrc = normalizeMediaUrl(src);
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return normalizedSrc ? (
    <img
      src={normalizedSrc}
      alt={name}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover border border-[#e2e8f0] shadow-sm ${className}`}
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-[#eef2ff] text-[#1d4ed8] font-semibold flex items-center justify-center border border-[#e2e8f0] shadow-sm ${className}`}
    >
      {initial}
    </div>
  );
}

function getUrgencyStyle(urgency: string) {
  switch (urgency.toLowerCase()) {
    case "high":
      return "bg-[#ffe2e2] text-[#c10007]";
    case "medium":
      return "bg-[#ffedd4] text-[#ca3500]";
    case "low":
      return "bg-[#dcfce7] text-[#008236]";
    default:
      return "bg-[#f3f4f6] text-[#334155]";
  }
}

export default function ArtisanReports({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [reports, setReports] = useState<IssueReportListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filterUrgency, setFilterUrgency] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReportDetail, setSelectedReportDetail] = useState<IssueReportDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const t = {
    title: lang === "EN" ? "Artisan Field Reports" : "Rapports de terrain des artisans",
    subtitle:
      lang === "EN"
        ? "Issues reported by artisans during active jobs"
        : "Problèmes signalés par les artisans lors des travaux actifs",
    searchPlaceholder: lang === "EN" ? "Search reports..." : "Rechercher des rapports...",
    all: lang === "EN" ? "All" : "Tous",
    low: lang === "EN" ? "Low" : "Faible",
    medium: lang === "EN" ? "Medium" : "Moyen",
    high: lang === "EN" ? "High" : "Élevé",
    viewDetails: lang === "EN" ? "View Details" : "Voir les détails",
    resolve: lang === "EN" ? "Resolve" : "Résoudre",
    reportedAgo: lang === "EN" ? "Reported" : "Signalé",
    showResult: lang === "EN" ? "Show result:" : "Afficher le résultat:",
    noReports: lang === "EN" ? "No reports found." : "Aucun rapport trouvé.",
    loading: lang === "EN" ? "Loading reports..." : "Chargement des rapports...",
    errorLoading: lang === "EN" ? "Error loading reports:" : "Erreur de chargement des rapports :",
    errorResolving: lang === "EN" ? "Could not resolve issue:" : "Impossible de résoudre le problème :",
    resolved: lang === "EN" ? "Resolved" : "Résolu",
    open: lang === "EN" ? "Open" : "Ouvert",
    issueReportDetails: lang === "EN" ? "Issue Report Details" : "Détails du rapport",
    reportedAs: lang === "EN" ? "Reported" : "Signalé",
    booking: lang === "EN" ? "Booking" : "Réservation",
    service: lang === "EN" ? "Service" : "Service",
    scheduled: lang === "EN" ? "Scheduled" : "Planifié",
    address: lang === "EN" ? "Address" : "Adresse",
    attachment: lang === "EN" ? "Attachment" : "Pièce jointe",
    description: lang === "EN" ? "Description" : "Description",
    markAsResolved: lang === "EN" ? "Mark as Resolved" : "Marquer comme résolu",
    noDescription: lang === "EN" ? "No description available." : "Aucune description disponible.",
    unknownClient: lang === "EN" ? "Unknown client" : "Client inconnu",
    unknownArtisan: lang === "EN" ? "Unknown artisan" : "Artisan inconnu",
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getIssueReports({
          page: currentPage,
          page_size: itemsPerPage,
          search: searchQuery || undefined,
          urgency: filterUrgency === "All" ? undefined : filterUrgency.toLowerCase(),
          ordering: "-created_at",
        });
        setReports(response.results);
        setTotalCount(response.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentPage, itemsPerPage, searchQuery, filterUrgency]);

  useEffect(() => {
    if (!selectedReportId) {
      setSelectedReportDetail(null);
      setDetailError(null);
      return;
    }

    const fetchDetail = async () => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const detail = await getIssueReportDetail(selectedReportId);
        setSelectedReportDetail(detail);
      } catch (err) {
        setDetailError(err instanceof Error ? err.message : String(err));
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedReportId]);

  const openDetails = (id: string) => {
    setSelectedReportId(id);
    setSelectedReportDetail(null);
    setDetailError(null);
  };

  const closeDetails = () => {
    setSelectedReportId(null);
    setSelectedReportDetail(null);
    setDetailError(null);
  };

  const handleResolveReport = async (bookingUuid: string, issueId: string) => {
    setResolveError(null);
    setActionLoading(true);
    try {
      const updated = await resolveIssueReport(bookingUuid, issueId);
      setReports((prev) =>
        prev.map((report) =>
          report.id === issueId
            ? { ...report, is_resolved: true, resolved_at: updated.resolved_at ?? report.resolved_at }
            : report
        )
      );
      if (selectedReportDetail?.id === issueId) {
        setSelectedReportDetail((prev) =>
          prev ? { ...prev, is_resolved: true, resolved_at: updated.resolved_at ?? prev.resolved_at } : prev
        );
      }
    } catch (err) {
      setResolveError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
        <div className="max-w-[1100px] mx-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft size={20} className="text-[#101828]" />
              </button>
              <h1 className="font-['Inter',sans-serif] font-bold text-[20px] text-[#101828]">
                {t.title}
              </h1>
            </div>
            <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#6a7282] ml-11">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="relative flex-1 max-w-[461px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99a1af]" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full h-[38px] pl-10 pr-4 bg-white border border-[#d1d5dc] rounded-[10px] font-['Inter',sans-serif] text-[14px] text-[#0a0a0a] placeholder:text-[rgba(10,10,10,0.5)] outline-none focus:border-[#155dfc]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Low", "Medium", "High"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setFilterUrgency(filter);
                    setCurrentPage(1);
                  }}
                  className={`h-[38px] px-4 rounded-[10px] font-['Inter',sans-serif] font-medium text-[14px] transition-colors ${
                    filterUrgency === filter
                      ? "bg-[#1a3a6b] text-white"
                      : "bg-white text-[#4a5565] border border-[#d1d5dc] hover:bg-muted/30"
                  }`}
                >
                  {t[filter.toLowerCase() as keyof typeof t] || filter}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-[#4a5565]">{t.loading}</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-[#4a5565]">{t.noReports}</div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-[16px] border border-[#2b7fff] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-5"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 flex-wrap">
                      <span className="bg-[#f3f4f6] px-3 py-1 rounded-[10px] font-['Inter',sans-serif] font-semibold text-[12px] text-[#364153]">
                        {report.booking_uuid ? `Booking ${report.booking_uuid.slice(0, 8)}` : "Booking"}
                      </span>
                      <h3 className="font-['Inter',sans-serif] font-bold text-[18px] text-[#101828]">
                        {report.service_name || "Unknown service"}
                      </h3>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                      <span className={`px-3 py-1 rounded-full font-['Inter',sans-serif] font-semibold text-[12px] ${getUrgencyStyle(report.urgency)}`}>
                        {formatIssueType(report.urgency)}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#eff6ff] text-[#1d4ed8] font-['Inter',sans-serif] font-semibold text-[12px]">
                        {report.is_resolved ? t.resolved : t.open}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={report.reported_by_picture} name={report.reported_by_name || "?"} />
                      <div>
                        <p className="font-['Inter',sans-serif] font-medium text-[14px] text-[#101828]">
                          {report.reported_by_name || t.unknownArtisan}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#f0b100] text-[#f0b100]" />
                          <span className="font-['Inter',sans-serif] text-[12px] text-[#4a5565]">
                            {report.reported_by_rating || "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="font-['Inter',sans-serif] text-[12px] text-[#6a7282]">
                      {t.reportedAgo} {getTimeAgo(report.created_at)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="inline-block bg-[#f3f4f6] px-3 py-1 rounded-full font-['Inter',sans-serif] font-medium text-[12px] text-[#364153] mb-2">
                      {formatIssueType(report.issue_type)}
                    </span>
                    <p className="font-['Inter',sans-serif] text-[14px] text-[#364153] leading-[20px]">
                      {report.description || t.noDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openDetails(report.id)}
                      className="h-[38px] px-4 rounded-[10px] border border-[#155dfc] font-['Inter',sans-serif] font-medium text-[14px] text-[#155dfc] hover:bg-[#155dfc]/10 transition-colors"
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      onClick={() => handleResolveReport(report.booking_uuid, report.id)}
                      disabled={report.is_resolved || actionLoading}
                      className={`h-[38px] px-4 rounded-[10px] font-['Inter',sans-serif] font-medium text-[14px] transition-colors ${
                        report.is_resolved
                          ? "bg-[#d1d5db] text-[#6b7280] cursor-not-allowed"
                          : "bg-[#00a63e] text-white hover:bg-[#00a63e]/90"
                      }`}
                    >
                      {report.is_resolved ? t.resolved : t.resolve}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(error || resolveError) && (
            <div className="mt-4 space-y-2 text-sm">
              {error && (
                <div className="text-red-600 font-medium">{t.errorLoading} {error}</div>
              )}
              {resolveError && (
                <div className="text-red-600 font-medium">{t.errorResolving} {resolveError}</div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between bg-white rounded-[12px] px-5 py-3 mt-6">
            <div className="flex items-center gap-4">
              <span className="font-['Inter',sans-serif] text-[14px] text-[#718096]">
                {t.showResult}
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="h-[32px] px-3 border border-[#eeeff2] rounded-[8px] font-['Inter',sans-serif] font-semibold text-[14px] text-[#171717] cursor-pointer"
              >
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={24}>24</option>
              </select>
            </div>
            <div className="flex items-center gap-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-[8px] hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {getPageNumbers().map((page, index) => (
                typeof page === "number" ? (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center font-['Inter',sans-serif] text-[14px] transition-colors ${
                      currentPage === page
                        ? "bg-[#f0f0f0] rounded-[12px] font-bold text-[#262626]"
                        : "rounded-[8px] text-[#8c8c8c] hover:bg-muted/30"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <div key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center font-['Inter',sans-serif] font-medium text-[14px] text-[#a0aec0]">
                    {page}
                  </div>
                )
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-[8px] hover:bg-muted/30 rotate-180 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {selectedReportDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#e5e7eb]">
                <h2 className="font-['Inter',sans-serif] font-bold text-[18px] text-[#101828]">
                  {t.issueReportDetails}
                </h2>
                <button
                  onClick={closeDetails}
                  className="text-[#99a1af] hover:text-[#101828] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {detailLoading ? (
                <div className="text-center py-8 text-[#4a5565]">{t.loading}</div>
              ) : detailError ? (
                <div className="text-red-600 font-medium">{detailError}</div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex flex-wrap justify-between gap-3 items-center">
                      <div>
                        <h3 className="font-['Inter',sans-serif] font-bold text-[16px] text-[#101828] mb-2">
                          {formatIssueType(selectedReportDetail.issue_type)}
                        </h3>
                        <span className="text-sm text-[#6b7280]">
                          {selectedReportDetail.is_resolved ? t.resolved : t.open}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-['Inter',sans-serif] font-semibold text-[12px] ${getUrgencyStyle(selectedReportDetail.urgency)}`}>
                        {formatIssueType(selectedReportDetail.urgency)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#4a5565]">
                      {selectedReportDetail.description || t.noDescription}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">{t.booking}</span>
                        <p className="font-semibold text-[#101828]">{selectedReportDetail.booking_id || selectedReportDetail.booking_uuid}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">{t.service}</span>
                        <p className="font-semibold text-[#101828]">{selectedReportDetail.service_name || '—'}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">{t.scheduled}</span>
                        <p className="font-semibold text-[#101828]">{selectedReportDetail.booking_date || '—'} {selectedReportDetail.booking_time || ''}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">{t.address}</span>
                        <p className="font-semibold text-[#101828]">{formatAddress(selectedReportDetail.booking_address)}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">{t.reportedAs}</span>
                        <p className="font-semibold text-[#101828]">{getTimeAgo(selectedReportDetail.created_at)}</p>
                      </div>
                      {selectedReportDetail.resolved_at && (
                        <div>
                          <span className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">{t.resolved}</span>
                          <p className="font-semibold text-[#101828]">{new Date(selectedReportDetail.resolved_at).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-6">
                    <div className="rounded-[16px] border border-[#e5e7eb] p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar src={selectedReportDetail.client_picture} name={selectedReportDetail.client_name || ''} />
                        <div>
                          <p className="font-semibold text-[#101828]">{selectedReportDetail.client_name || t.unknownClient}</p>
                          <p className="text-sm text-[#6b7280]">{lang === 'EN' ? 'Client' : 'Client'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[16px] border border-[#e5e7eb] p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar src={selectedReportDetail.artisan.profile_picture} name={selectedReportDetail.artisan.name} />
                        <div>
                          <p className="font-semibold text-[#101828]">{selectedReportDetail.artisan.name}</p>
                          <p className="text-sm text-[#6b7280]">{lang === 'EN' ? 'Artisan' : 'Artisan'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#4a5565]">
                        <span>{selectedReportDetail.artisan.avg_rating} ★</span>
                        <span>•</span>
                        <span>{selectedReportDetail.artisan.completed_jobs} {lang === 'EN' ? 'jobs' : 'travaux'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedReportDetail.attachment ? (
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="block text-xs uppercase tracking-[0.16em] text-[#6b7280]">{t.attachment}</span>
                        <a
                          href={normalizeMediaUrl(selectedReportDetail.attachment) || selectedReportDetail.attachment!}
                          download={getFileNameFromUrl(selectedReportDetail.attachment)}
                          className="inline-flex items-center gap-2 rounded-[12px] bg-[#eef2ff] px-3 py-2 text-[13px] font-medium text-[#0f172a] hover:bg-[#dbeafe]"
                        >
                          <Download size={14} />
                          {lang === "EN" ? "Download" : "Télécharger"}
                        </a>
                      </div>
                      {isImageUrl(selectedReportDetail.attachment) ? (
                        <img
                          src={normalizeMediaUrl(selectedReportDetail.attachment) || selectedReportDetail.attachment}
                          alt="Issue attachment"
                          className="w-full max-h-[320px] object-cover rounded-[16px]"
                        />
                      ) : (
                        <div className="rounded-[16px] border border-[#d1d5dc] bg-[#f9fafb] p-4 text-[#334155]">
                          <p className="font-['Inter',sans-serif] text-[14px] font-medium mb-2">{getFileNameFromUrl(selectedReportDetail.attachment)}</p>
                          <p className="text-[13px] text-[#525252]">{lang === "EN" ? "Download the attached file using the button above." : "Téléchargez le fichier joint en utilisant le bouton ci-dessus."}</p>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="mb-6">
                    <span className="block text-xs uppercase tracking-[0.16em] text-[#6b7280] mb-2">{t.description}</span>
                    <div className="bg-[#f9fafb] border border-[#d1d5dc] rounded-[14px] p-4">
                      <p className="font-['Inter',sans-serif] text-[14px] text-[#364153] leading-[20px]">
                        {selectedReportDetail.description || t.noDescription}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolveReport(selectedReportDetail.booking_uuid, selectedReportDetail.id)}
                    disabled={selectedReportDetail.is_resolved || actionLoading}
                    className={`w-full h-12 rounded-[14px] font-['Inter',sans-serif] font-medium text-[16px] transition-colors flex items-center justify-center gap-2 ${
                      selectedReportDetail.is_resolved
                        ? 'bg-[#d1d5db] text-[#6b7280] cursor-not-allowed'
                        : 'bg-[#00a63e] text-white hover:bg-[#00a63e]/90'
                    }`}
                  >
                    <CheckCircle2 size={20} />
                    {selectedReportDetail.is_resolved ? t.resolved : t.markAsResolved}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
