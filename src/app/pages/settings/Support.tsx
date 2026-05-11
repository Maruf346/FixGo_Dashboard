import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Search, Download } from "lucide-react";
import { getFeedbacks, FeedbackItem } from "../../../services/feedbacks";

type Language = "EN" | "FR";

export default function Support({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const t = {
    title: lang === "EN" ? "Contact Support" : "Support Contact",
    search: lang === "EN" ? "Search feedbacks..." : "Rechercher des feedbacks...",
    from: lang === "EN" ? "From:" : "De:",
    subject: lang === "EN" ? "Subject:" : "Sujet:",
    attachment: lang === "EN" ? "Attachment:" : "Pièce jointe:",
    download: lang === "EN" ? "Download" : "Télécharger",
    loading: lang === "EN" ? "Loading..." : "Chargement...",
    error: lang === "EN" ? "Error loading feedbacks" : "Erreur lors du chargement des feedbacks",
    noFeedbacks: lang === "EN" ? "No feedbacks found" : "Aucun feedback trouvé",
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFeedbacks({
          page,
          page_size: pageSize,
          search: search || undefined,
        });
        setFeedbacks(data.results);
        setTotalCount(data.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [page, pageSize, search]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-6 py-4 text-white flex items-center gap-3" style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}>
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">{t.title}</h1>
        </div>

        {/* Search */}
        {/* <div className="p-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div> */}

        {/* Feedbacks Content */}
        <div className="p-6 lg:p-8">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t.loading}</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{t.error}: {error}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t.noFeedbacks}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              {/* Feedback Items */}
              <div className="divide-y divide-[rgba(0,0,0,0.4)]">
                {feedbacks.map((feedback) => {
                  const isExpanded = expandedItems.includes(feedback.id);

                  return (
                    <div key={feedback.id}>
                      <button
                        onClick={() => toggleItem(feedback.id)}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex flex-col gap-1 items-start text-left">
                          <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#6c7a92]">
                            <span>{t.from} </span>
                            <span className="underline decoration-solid">{feedback.email}</span>
                          </p>
                          <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#6c7a92]">
                            <span>{t.subject} </span>
                            <span className="underline decoration-solid">{feedback.subject}</span>
                          </p>
                          {feedback.attachment && (
                            <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#6c7a92]">
                              <span>{t.attachment} </span>
                              <a
                                href={feedback.attachment}
                                download
                                className="inline-flex items-center gap-1 underline decoration-solid text-primary hover:text-primary/80"
                              >
                                <Download size={14} />
                                {t.download}
                              </a>
                            </p>
                          )}
                        </div>
                        <div className={`flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown size={24} className="text-[#6c7a92]" />
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-3">
                          <p className="font-['Poppins',sans-serif] font-normal text-[14px] text-[#6c7a92] leading-[1.6] whitespace-pre-line">
                            {feedback.message}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
