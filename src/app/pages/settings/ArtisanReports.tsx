import { useState } from "react";
import { ArrowLeft, Search, Star, MapPin, CheckCircle2, X, AlertTriangle } from "lucide-react";
import imgImageJohnWilliams from "../../../imports/Dashboard-3-1/0d5da6ab018faf09b0940ac3e0ab4d6d514c431f.png";
import imgImageSarahJohnson from "../../../imports/ReportDetailPanel/56d9e68ccff12413f144bdf75269165f5e84005a.png";

type Language = "EN" | "FR";

interface Report {
  id: string;
  jobId: string;
  serviceName: string;
  urgency: "High" | "Medium" | "Low";
  artisanName: string;
  artisanAvatar: string;
  artisanRating: number;
  issueType: string;
  description: string;
  reportedTime: string;
  bookingDate: string;
  clientName: string;
  clientAvatar: string;
  address: string;
}

export default function ArtisanReports({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<string>("All");
  const [selectedUrgencyInModal, setSelectedUrgencyInModal] = useState<"Low" | "Medium" | "High">("High");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");

  const t = {
    title: lang === "EN" ? "Artisan Field Reports" : "Rapports de terrain des artisans",
    subtitle: lang === "EN" ? "Issues reported by artisans during active jobs" : "Problèmes signalés par les artisans lors des travaux actifs",
    searchPlaceholder: lang === "EN" ? "Search reports..." : "Rechercher des rapports...",
    all: lang === "EN" ? "All" : "Tous",
    low: lang === "EN" ? "Low" : "Faible",
    medium: lang === "EN" ? "Medium" : "Moyen",
    high: lang === "EN" ? "High" : "Élevé",
    viewDetails: lang === "EN" ? "View Details" : "Voir les détails",
    resolve: lang === "EN" ? "Resolve" : "Résoudre",
    reportedAgo: lang === "EN" ? "Reported" : "Signalé",
    jobsCompleted: lang === "EN" ? "jobs completed" : "travaux terminés",
    showResult: lang === "EN" ? "Show result:" : "Afficher le résultat:",
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-[#ffe2e2] text-[#c10007]";
      case "Medium":
        return "bg-[#ffedd4] text-[#ca3500]";
      case "Low":
        return "bg-[#dcfce7] text-[#008236]";
      default:
        return "";
    }
  };

  // Generate more mock data for pagination demo
  const generateReports = () => {
    const reports: Report[] = [];
    for (let i = 1; i <= 60; i++) {
      const urgencies: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"];
      reports.push({
        id: `${i}`,
        jobId: `J${i}`,
        serviceName: "Emergency Plumbing Repair",
        urgency: urgencies[i % 3],
        artisanName: "John Williams",
        artisanAvatar: imgImageJohnWilliams,
        artisanRating: 4.8,
        issueType: "Access Problem",
        description: "Client not home, gate locked. Unable to access property despite confirmed appointment time. Attempted to contact client via phone and app messaging but no response. Waiting on-site for 20 minutes as per policy.",
        reportedTime: "2 hours ago",
        bookingDate: "May 6, 2026 • 10:00 AM",
        clientName: "Sarah Johnson",
        clientAvatar: imgImageSarahJohnson,
        address: "1234 Maple Street, San Francisco, CA 94102"
      });
    }
    return reports;
  };

  const allReports = generateReports();

  // Filter reports
  const filteredReports = allReports.filter((report) => {
    const matchesUrgency = filterUrgency === "All" || report.urgency === filterUrgency;
    const matchesSearch = searchQuery === "" ||
      report.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.jobId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUrgency && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
        <div className="max-w-[1100px] mx-auto p-6">
          {/* Header */}
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

          {/* Search and Filters */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative flex-1 max-w-[461px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99a1af]" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                placeholder={t.searchPlaceholder}
                className="w-full h-[38px] pl-10 pr-4 bg-white border border-[#d1d5dc] rounded-[10px] font-['Inter',sans-serif] text-[14px] text-[#0a0a0a] placeholder:text-[rgba(10,10,10,0.5)] outline-none focus:border-[#155dfc]"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Low", "Medium", "High"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setFilterUrgency(filter);
                    setCurrentPage(1); // Reset to first page on filter change
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

          {/* Reports List */}
          <div className="space-y-3">
            {currentReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-[16px] border border-[#2b7fff] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-5"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#f3f4f6] px-3 py-1 rounded-[10px] font-['Inter',sans-serif] font-semibold text-[12px] text-[#364153]">
                      Job #{report.jobId}
                    </span>
                    <h3 className="font-['Inter',sans-serif] font-bold text-[18px] text-[#101828]">
                      {report.serviceName}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-['Inter',sans-serif] font-semibold text-[12px] ${getUrgencyStyle(
                      report.urgency
                    )}`}
                  >
                    {report.urgency}
                  </span>
                </div>

                {/* Artisan Info Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={report.artisanAvatar}
                      alt={report.artisanName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-['Inter',sans-serif] font-medium text-[14px] text-[#101828]">
                        {report.artisanName}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#f0b100] text-[#f0b100]" />
                        <span className="font-['Inter',sans-serif] text-[12px] text-[#4a5565]">
                          {report.artisanRating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="font-['Inter',sans-serif] text-[12px] text-[#6a7282]">
                    {t.reportedAgo} {report.reportedTime}
                  </span>
                </div>

                {/* Issue Details */}
                <div className="mb-3">
                  <span className="inline-block bg-[#f3f4f6] px-3 py-1 rounded-full font-['Inter',sans-serif] font-medium text-[12px] text-[#364153] mb-2">
                    {report.issueType}
                  </span>
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#364153] leading-[20px]">
                    {report.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="h-[38px] px-4 rounded-[10px] border border-[#155dfc] font-['Inter',sans-serif] font-medium text-[14px] text-[#155dfc] hover:bg-[#155dfc]/10 transition-colors"
                  >
                    {t.viewDetails}
                  </button>
                  <button className="h-[38px] px-4 rounded-[10px] bg-[#00a63e] font-['Inter',sans-serif] font-medium text-[14px] text-white hover:bg-[#00a63e]/90 transition-colors">
                    {t.resolve}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
                  <div key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center font-['Manrope',sans-serif] font-medium text-[14px] text-[#a0aec0]">
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

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] max-w-[480px] w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#e5e7eb]">
                <h2 className="font-['Inter',sans-serif] font-bold text-[18px] text-[#101828]">
                  Report Details
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-[#99a1af] hover:text-[#101828] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Job Information */}
              <div className="mb-6">
                <h3 className="font-['Inter',sans-serif] font-bold text-[14px] text-[#101828] mb-3">
                  Job Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter',sans-serif] text-[14px] text-[#4a5565]">
                      Job ID:
                    </span>
                    <span className="bg-[#f3f4f6] px-3 py-1 rounded-[10px] font-['Inter',sans-serif] font-semibold text-[12px] text-[#364153]">
                      Job #{selectedReport.jobId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter',sans-serif] text-[14px] text-[#4a5565]">
                      Service Type:
                    </span>
                    <span className="bg-[#dbeafe] px-3 py-1 rounded-full font-['Inter',sans-serif] font-medium text-[12px] text-[#1447e6]">
                      Emergency Plumbing
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter',sans-serif] text-[14px] text-[#4a5565]">
                      Booking Date:
                    </span>
                    <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#101828]">
                      {selectedReport.bookingDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter',sans-serif] text-[14px] text-[#4a5565]">
                      Client:
                    </span>
                    <div className="flex items-center gap-2">
                      <img
                        src={selectedReport.clientAvatar}
                        alt={selectedReport.clientName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#101828]">
                        {selectedReport.clientName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#99a1af] mt-0.5 shrink-0" />
                    <span className="font-['Inter',sans-serif] text-[14px] text-[#364153]">
                      {selectedReport.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Artisan Information */}
              <div className="mb-6 pb-6 border-b border-[#e5e7eb]">
                <h3 className="font-['Inter',sans-serif] font-bold text-[14px] text-[#101828] mb-3">
                  Artisan Information
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedReport.artisanAvatar}
                    alt={selectedReport.artisanName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-['Inter',sans-serif] font-bold text-[16px] text-[#101828]">
                        {selectedReport.artisanName}
                      </h4>
                      <CheckCircle2 className="w-4 h-4 text-[#155dfc] fill-[#155dfc]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#f0b100] text-[#f0b100]" />
                        <span className="font-['Inter',sans-serif] text-[14px] text-[#4a5565]">
                          {selectedReport.artisanRating}
                        </span>
                      </div>
                      <span className="font-['Inter',sans-serif] text-[14px] text-[#4a5565]">•</span>
                      <span className="font-['Inter',sans-serif] text-[14px] text-[#4a5565]">
                        127 {t.jobsCompleted}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div className="mb-6">
                <h3 className="font-['Inter',sans-serif] font-bold text-[14px] text-[#101828] mb-4">
                  Issue Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-['Inter',sans-serif] font-medium text-[12px] text-[#4a5565] mb-2 block">
                      Issue Type:
                    </label>
                    <span className="inline-block bg-[#f3f4f6] px-3 py-2 rounded-full font-['Inter',sans-serif] font-medium text-[14px] text-[#364153]">
                      {selectedReport.issueType}
                    </span>
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-medium text-[12px] text-[#4a5565] mb-2 block">
                      Urgency Level:
                    </label>
                    <div className="flex gap-2">
                      {(["Low", "Medium", "High"] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setSelectedUrgencyInModal(level)}
                          className={`h-[38px] px-4 rounded-[10px] font-['Inter',sans-serif] font-medium text-[14px] transition-colors ${
                            selectedUrgencyInModal === level
                              ? level === "High"
                                ? "border-2 border-[#e7000b] text-[#c10007]"
                                : level === "Medium"
                                ? "border-2 border-[#d1d5dc] text-[#4a5565]"
                                : "border-2 border-[#00a63e] text-[#4a5565] relative"
                              : "border border-[#d1d5dc] text-[#4a5565]"
                          }`}
                        >
                          {selectedUrgencyInModal === level && level === "Low" && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#00a63e] rounded-full" />
                          )}
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-medium text-[12px] text-[#4a5565] mb-2 block">
                      Description:
                    </label>
                    <div className="bg-[#f9fafb] border border-[#d1d5dc] rounded-[14px] p-4">
                      <p className="font-['Inter',sans-serif] text-[14px] text-[#364153] leading-[20px]">
                        {selectedReport.description}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-medium text-[12px] text-[#4a5565] mb-2 block">
                      Attached Photos/Documents:
                    </label>
                    <div className="flex gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-20 h-20 bg-[#e5e7eb] rounded-[14px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="bg-[#fff3cd] border-l-4 border-[#f0b100] rounded-[14px] p-4 mb-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#a65f00] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-['Inter',sans-serif] font-bold text-[14px] text-[#733e0a] mb-1">
                      High urgency — immediate attention required
                    </p>
                    <p className="font-['Inter',sans-serif] text-[12px] text-[#894b00]">
                      Please review and respond to this report as soon as possible.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full h-12 bg-[#00a63e] rounded-[14px] font-['Inter',sans-serif] font-medium text-[16px] text-white hover:bg-[#00a63e]/90 transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
