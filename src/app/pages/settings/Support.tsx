import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

type Language = "EN" | "FR";

interface SupportTicket {
  id: string;
  fromEN: string;
  fromFR: string;
  subjectEN: string;
  subjectFR: string;
  messageEN: string;
  messageFR: string;
}

const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "ticket-1",
    fromEN: "sarah.mitchell@email.com",
    fromFR: "sarah.mitchell@email.com",
    subjectEN: "Unable to continue my last reflection.",
    subjectFR: "Impossible de continuer ma dernière réflexion.",
    messageEN: "Hi,\nI paused a reflection session yesterday and couldn't find a way to continue it today. I'm not sure if I missed something or if it didn't save properly.\n\nCould you please help me understand how to resume where I left off?\n\nThank you.",
    messageFR: "Bonjour,\nJ'ai mis en pause une session de réflexion hier et je n'ai pas trouvé de moyen de la continuer aujourd'hui. Je ne sais pas si j'ai manqué quelque chose ou si elle n'a pas été sauvegardée correctement.\n\nPourriez-vous m'aider à comprendre comment reprendre là où je me suis arrêté ?\n\nMerci."
  },
  {
    id: "ticket-2",
    fromEN: "daniel.ross@email.com",
    fromFR: "daniel.ross@email.com",
    subjectEN: "Questions feel different than expected",
    subjectFR: "Les questions semblent différentes de ce qui était attendu",
    messageEN: "Hello,\nI've been using the app for a few days and noticed that the questions feel more open-ended than I expected. I just wanted to check if this is intentional or if I need to adjust my focus settings.\n\nOverall, the experience feels calm and thoughtful.\n\nThanks for your support.",
    messageFR: "Bonjour,\nJ'utilise l'application depuis quelques jours et j'ai remarqué que les questions semblent plus ouvertes que prévu. Je voulais juste vérifier si c'est intentionnel ou si je dois ajuster mes paramètres de focus.\n\nGlobalement, l'expérience est calme et réfléchie.\n\nMerci pour votre soutien."
  },
  {
    id: "ticket-3",
    fromEN: "amina.khan@email.com",
    fromFR: "amina.khan@email.com",
    subjectEN: "Issue signing back into my account",
    subjectFR: "Problème de reconnexion à mon compte",
    messageEN: "Hi team,\nI logged out of my account earlier today and now I'm having trouble signing back in. I'm not seeing an error message, but the screen doesn't move forward.\n\nCould you please take a look or let me know what I should do next?\n\nBest regards.",
    messageFR: "Bonjour l'équipe,\nJe me suis déconnecté de mon compte plus tôt aujourd'hui et maintenant j'ai du mal à me reconnecter. Je ne vois pas de message d'erreur, mais l'écran ne progresse pas.\n\nPourriez-vous jeter un œil ou me dire ce que je devrais faire ensuite ?\n\nCordialement."
  }
];

export default function Support({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["ticket-1"]);

  const t = {
    title: lang === "EN" ? "Contact Support" : "Support Contact",
    save: lang === "EN" ? "Save" : "Enregistrer",
    from: lang === "EN" ? "From:" : "De:",
    subject: lang === "EN" ? "Subject:" : "Sujet:",
  };

  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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

        {/* Support Tickets Content */}
        <div className="p-6 lg:p-8">
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            {/* Ticket Items */}
            <div className="divide-y divide-[rgba(0,0,0,0.4)]">
              {SUPPORT_TICKETS.map((ticket) => {
                const isExpanded = expandedItems.includes(ticket.id);
                const from = lang === "EN" ? ticket.fromEN : ticket.fromFR;
                const subject = lang === "EN" ? ticket.subjectEN : ticket.subjectFR;
                const message = lang === "EN" ? ticket.messageEN : ticket.messageFR;

                return (
                  <div key={ticket.id}>
                    <button
                      onClick={() => toggleItem(ticket.id)}
                      className="w-full px-5 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex flex-col gap-1 items-start text-left">
                        <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#6c7a92]">
                          <span>{t.from} </span>
                          <span className="underline decoration-solid">{from}</span>
                        </p>
                        <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#6c7a92]">
                          <span>{t.subject} </span>
                          <span className="underline decoration-solid">{subject}</span>
                        </p>
                      </div>
                      <div className={`flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={24} className="text-[#6c7a92]" />
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-3">
                        <p className="font-['Poppins',sans-serif] font-normal text-[14px] text-[#6c7a92] leading-[1.6] whitespace-pre-line">
                          {message}
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
  );
}
