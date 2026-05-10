import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, Plus, Trash2, X } from "lucide-react";
import { getFaqs, createFaq, deleteFaq, FaqItem } from "../../../services/support";
import { loadStoredAuth } from "../../../services/auth";

type Language = "EN" | "FR";

export default function FAQs({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const t = {
    title: lang === "EN" ? "FAQs" : "FAQ",
    addFAQ: lang === "EN" ? "Add FAQ" : "Ajouter FAQ",
    question: lang === "EN" ? "Question" : "Question",
    answer: lang === "EN" ? "Answer" : "Réponse",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
    saveFAQ: lang === "EN" ? "Save FAQ" : "Enregistrer FAQ",
    loading: lang === "EN" ? "Loading FAQs..." : "Chargement des FAQ...",
    loadError: lang === "EN" ? "Unable to load FAQs." : "Impossible de charger les FAQ.",
    empty: lang === "EN" ? "No FAQs available yet." : "Aucune FAQ disponible pour le moment.",
    required: lang === "EN" ? "Question and answer are required." : "La question et la réponse sont requises.",
    deleteConfirm: lang === "EN" ? "Delete FAQ" : "Supprimer la FAQ",
    deleteError: lang === "EN" ? "Unable to delete FAQ." : "Impossible de supprimer la FAQ.",
    createError: lang === "EN" ? "Unable to create FAQ." : "Impossible de créer la FAQ.",
    created: lang === "EN" ? "FAQ created successfully." : "FAQ créée avec succès.",
    deleted: lang === "EN" ? "FAQ deleted successfully." : "FAQ supprimée avec succès.",
  };

  useEffect(() => {
    const loadFaqs = async () => {
      setLoading(true);
      setError(null);

      try {
        const { accessToken } = loadStoredAuth();
        const response = await getFaqs(accessToken ?? undefined);
        setFaqItems(response.results);
      } catch (err) {
        console.error(err);
        setError(t.loadError);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, [lang]);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleCreateFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setModalError(t.required);
      return;
    }

    setSaving(true);
    setModalError(null);

    try {
      const { accessToken } = loadStoredAuth();
      if (!accessToken) throw new Error("Authentication required.");

      const createdFaq = await createFaq(accessToken, newQuestion.trim(), newAnswer.trim());
      setFaqItems((prev) => [createdFaq, ...prev]);
      setExpandedItems((prev) => [createdFaq.id, ...prev]);
      setNewQuestion("");
      setNewAnswer("");
      setShowAddModal(false);
      setSuccessMessage(t.created);
      window.setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err) {
      console.error(err);
      setModalError(t.createError);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    const confirmDelete = window.confirm(lang === "EN" ? "Are you sure you want to delete this FAQ?" : "Êtes-vous sûr de vouloir supprimer cette FAQ ?");
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      const { accessToken } = loadStoredAuth();
      if (!accessToken) throw new Error("Authentication required.");
      await deleteFaq(accessToken, id);
      setFaqItems((prev) => prev.filter((item) => item.id !== id));
      setExpandedItems((prev) => prev.filter((item) => item !== id));
      setSuccessMessage(t.deleted);
      window.setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err) {
      console.error(err);
      setError(t.deleteError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden max-w-5xl mx-auto">
          <div className="px-6 py-4 text-white flex items-center justify-between" style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}>
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold">{t.title}</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              {t.addFAQ}
            </button>
          </div>

          <div className="p-6 lg:p-8">
            {loading ? (
              <p className="text-muted-foreground">{t.loading}</p>
            ) : error ? (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : faqItems.length === 0 ? (
              <div className="rounded-2xl bg-white border border-border p-6 text-center text-muted-foreground">{t.empty}</div>
            ) : (
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <div className="divide-y divide-[rgba(0,0,0,0.08)]">
                  {faqItems.map((faq) => {
                    const isExpanded = expandedItems.includes(faq.id);
                    return (
                      <div key={faq.id}>
                        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between bg-white hover:bg-muted/20 transition-colors">
                          <button
                            type="button"
                            onClick={() => toggleItem(faq.id)}
                            className="text-left flex-1"
                          >
                            <p className="font-['Poppins',sans-serif] font-semibold text-[16px] text-[#1f2937]">
                              {faq.question}
                            </p>
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteFaq(faq.id)}
                              disabled={deletingId === faq.id}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={t.deleteConfirm}
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleItem(faq.id)}
                              className={`p-2 rounded-lg text-[#6c7a92] hover:bg-muted/20 transition-colors ${isExpanded ? "rotate-180" : ""}`}
                            >
                              <ChevronDown size={20} />
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-5 pb-4">
                            <p className="font-['Poppins',sans-serif] text-[14px] text-[#6c7a92] leading-[1.8] whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{t.addFAQ}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setModalError(null);
                  setNewQuestion("");
                  setNewAnswer("");
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modalError && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.question}</label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder={lang === "EN" ? "Enter question" : "Entrez la question"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.answer}</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder={lang === "EN" ? "Enter answer" : "Entrez la réponse"}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setModalError(null);
                    setNewQuestion("");
                    setNewAnswer("");
                  }}
                  className="px-6 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleCreateFaq}
                  disabled={saving}
                  className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}
                >
                  {saving ? (lang === "EN" ? "Saving..." : "Enregistrement...") : t.saveFAQ}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
