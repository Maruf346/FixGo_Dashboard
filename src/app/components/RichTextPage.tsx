import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

type Language = "EN" | "FR";

interface RichTextPageProps {
  lang: Language;
  title: string;
  onBack: () => void;
  getContent: () => Promise<{ content: string; updated_at?: string }>;
  patchContent: (content: string) => Promise<{ content: string; updated_at?: string }>;
}

export default function RichTextPage({ lang, title, onBack, getContent, patchContent }: RichTextPageProps) {
  const [content, setContent] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const t = {
    edit: lang === "EN" ? "Edit" : "Modifier",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
    save: lang === "EN" ? "Save" : "Enregistrer",
    loading: lang === "EN" ? "Loading content..." : "Chargement du contenu...",
    empty: lang === "EN" ? "No content yet. Click Edit to add content." : "Aucun contenu pour le moment. Cliquez sur Modifier pour ajouter du contenu.",
    saved: lang === "EN" ? "Content saved successfully." : "Contenu enregistré avec succès.",
    saveFailed: lang === "EN" ? "Unable to save changes. Please try again." : "Impossible d'enregistrer les modifications. Veuillez réessayer.",
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getContent();
        setContent(response.content ?? "");
        setDraft(response.content ?? "");
        setUpdatedAt(response.updated_at ?? null);
      } catch (err) {
        setError(t.loading);
        console.error("Failed to load rich content:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getContent]);

  const handleEdit = () => {
    setDraft(content);
    setEditing(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setDraft(content);
    setEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const response = await patchContent(draft);
      setContent(response.content ?? draft);
      setDraft(response.content ?? draft);
      setUpdatedAt(response.updated_at ?? updatedAt);
      setEditing(false);
      setSuccess(true);
      window.setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setSaveError(t.saveFailed);
      console.error("Failed to save rich content:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white border border-border p-8 shadow-sm">
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden max-w-5xl mx-auto">
        <div className="px-6 py-4 text-white flex items-center justify-between" style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={handleEdit}
              className="px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {t.edit}
            </button>
          )}
        </div>

        <div className="p-6 lg:p-8">
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 mb-4">
              {t.saved}
            </div>
          )}

          {saveError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
              {saveError}
            </div>
          )}

          {!editing ? (
            <div className="bg-white rounded-2xl border border-border p-6 min-h-[320px]">
              {content ? (
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-muted-foreground">{t.empty}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <RichTextEditor value={draft} onChange={setDraft} />
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}
                >
                  {saving ? `${t.save}...` : t.save}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
