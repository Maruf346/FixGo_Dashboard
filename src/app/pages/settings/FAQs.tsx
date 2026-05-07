import { useState } from "react";
import { ArrowLeft, ChevronDown, Plus, X } from "lucide-react";

type Language = "EN" | "FR";

interface FAQ {
  id: string;
  questionEN: string;
  questionFR: string;
  answerEN: string;
  answerFR: string;
}

const INITIAL_FAQ_ITEMS: FAQ[] = [
  {
    id: "faq-1",
    questionEN: "What is this app for?",
    questionFR: "À quoi sert cette application ?",
    answerEN: "This app is a private space for self-reflection and self-awareness. It invites you to slow down, look inward, and explore your thoughts and emotions through thoughtful questions.\n\nThere is no advice or judgment—only space to notice what feels present and reconnect with yourself at your own pace. You can return anytime and continue from wherever you are, without pressure or evaluation.",
    answerFR: "Cette application est un espace privé pour l'auto-réflexion et la conscience de soi. Elle vous invite à ralentir, à regarder vers l'intérieur et à explorer vos pensées et vos émotions à travers des questions réfléchies.\n\nIl n'y a pas de conseil ou de jugement - seulement un espace pour remarquer ce qui se présente et vous reconnecter avec vous-même à votre propre rythme. Vous pouvez revenir à tout moment et continuer d'où vous êtes, sans pression ni évaluation."
  },
  {
    id: "faq-2",
    questionEN: "How does the conversation practice work?",
    questionFR: "Comment fonctionne la pratique de conversation ?",
    answerEN: "The experience guides you through open-ended questions that help you reflect on real-life situations and inner experiences. You respond in your own words, at your own pace, without advice or judgment. You can pause anytime and return later to continue from where you left off.",
    answerFR: "L'expérience vous guide à travers des questions ouvertes qui vous aident à réfléchir sur des situations réelles et des expériences intérieures. Vous répondez avec vos propres mots, à votre propre rythme, sans conseil ni jugement. Vous pouvez faire une pause à tout moment et revenir plus tard pour continuer là où vous vous êtes arrêté."
  },
  {
    id: "faq-3",
    questionEN: "Will the conversations be the same every time?",
    questionFR: "Les conversations seront-elles les mêmes à chaque fois ?",
    answerEN: "No, each conversation is unique and adapts to your responses and current state of mind.",
    answerFR: "Non, chaque conversation est unique et s'adapte à vos réponses et à votre état d'esprit actuel."
  },
  {
    id: "faq-4",
    questionEN: 'What is the "Create Your Own Scenario" feature?',
    questionFR: 'Qu\'est-ce que la fonctionnalité "Créer votre propre scénario" ?',
    answerEN: "This feature allows you to create custom reflection scenarios tailored to your specific needs and situations.",
    answerFR: "Cette fonctionnalité vous permet de créer des scénarios de réflexion personnalisés adaptés à vos besoins et situations spécifiques."
  }
];

export default function FAQs({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [faqItems, setFaqItems] = useState<FAQ[]>(INITIAL_FAQ_ITEMS);
  const [expandedItems, setExpandedItems] = useState<string[]>(["faq-1", "faq-2"]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestionEN, setNewQuestionEN] = useState("");
  const [newQuestionFR, setNewQuestionFR] = useState("");
  const [newAnswerEN, setNewAnswerEN] = useState("");
  const [newAnswerFR, setNewAnswerFR] = useState("");

  const t = {
    title: lang === "EN" ? "FAQs" : "FAQ",
    save: lang === "EN" ? "Save" : "Enregistrer",
    addFAQ: lang === "EN" ? "Add FAQ" : "Ajouter FAQ",
    questionEN: lang === "EN" ? "Question (English)" : "Question (Anglais)",
    questionFR: lang === "EN" ? "Question (French)" : "Question (Français)",
    answerEN: lang === "EN" ? "Answer (English)" : "Réponse (Anglais)",
    answerFR: lang === "EN" ? "Answer (French)" : "Réponse (Français)",
    cancel: lang === "EN" ? "Cancel" : "Annuler",
    saveButton: lang === "EN" ? "Save FAQ" : "Enregistrer FAQ",
  };

  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddFAQ = () => {
    if (!newQuestionEN.trim() || !newAnswerEN.trim()) {
      alert(lang === "EN" ? "Please fill in at least the English question and answer" : "Veuillez remplir au moins la question et la réponse en anglais");
      return;
    }

    const newFAQ: FAQ = {
      id: `faq-${Date.now()}`,
      questionEN: newQuestionEN,
      questionFR: newQuestionFR || newQuestionEN,
      answerEN: newAnswerEN,
      answerFR: newAnswerFR || newAnswerEN,
    };

    setFaqItems([...faqItems, newFAQ]);
    setNewQuestionEN("");
    setNewQuestionFR("");
    setNewAnswerEN("");
    setNewAnswerFR("");
    setShowAddModal(false);
  };

  const handleSaveAll = () => {
    // Handle save all FAQs logic here
    console.log("Saving all FAQs:", faqItems);
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden max-w-5xl mx-auto">
          {/* Header */}
          <div className="px-6 py-4 text-white flex items-center justify-between" style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold">{t.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                {t.addFAQ}
              </button>
              <button
                onClick={handleSaveAll}
                className="px-6 py-2 bg-white text-primary rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
              >
                {t.save}
              </button>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="p-6 lg:p-8">
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              {/* FAQ Items */}
              <div className="divide-y divide-[rgba(0,0,0,0.4)]">
                {faqItems.map((faq) => {
                  const isExpanded = expandedItems.includes(faq.id);
                  const question = lang === "EN" ? faq.questionEN : faq.questionFR;
                  const answer = lang === "EN" ? faq.answerEN : faq.answerFR;

                  return (
                    <div key={faq.id}>
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#6c7a92] text-left">
                          {question}
                        </p>
                        <div className={`flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown size={24} className="text-[#6c7a92]" />
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-3">
                          <p className="font-['Poppins',sans-serif] font-normal text-[14px] text-[#6c7a92] leading-[1.6] whitespace-pre-line">
                            {answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{t.addFAQ}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewQuestionEN("");
                  setNewQuestionFR("");
                  setNewAnswerEN("");
                  setNewAnswerFR("");
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Question EN */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.questionEN} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newQuestionEN}
                  onChange={(e) => setNewQuestionEN(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Enter question in English"
                />
              </div>

              {/* Question FR */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.questionFR}
                </label>
                <input
                  type="text"
                  value={newQuestionFR}
                  onChange={(e) => setNewQuestionFR(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Enter question in French (optional)"
                />
              </div>

              {/* Answer EN */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.answerEN} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newAnswerEN}
                  onChange={(e) => setNewAnswerEN(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Enter answer in English"
                />
              </div>

              {/* Answer FR */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.answerFR}
                </label>
                <textarea
                  value={newAnswerFR}
                  onChange={(e) => setNewAnswerFR(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Enter answer in French (optional)"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewQuestionEN("");
                    setNewQuestionFR("");
                    setNewAnswerEN("");
                    setNewAnswerFR("");
                  }}
                  className="px-6 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleAddFAQ}
                  className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-sm hover:opacity-90"
                  style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}
                >
                  {t.saveButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
