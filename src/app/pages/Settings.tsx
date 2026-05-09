import { useState } from "react";
import { ChevronRight } from "lucide-react";
import ChangePassword from "./settings/ChangePassword";
import PrivacyPolicy from "./settings/PrivacyPolicy";
import TermsConditions from "./settings/TermsConditions";
import AboutUs from "./settings/AboutUs";
import Support from "./settings/Support";
import FAQs from "./settings/FAQs";
import ArtisanReports from "./settings/ArtisanReports";

type Language = "EN" | "FR";

interface SettingItem {
  id: string;
  labelEN: string;
  labelFR: string;
}

const SETTINGS_ITEMS: SettingItem[] = [
  { id: "change-password", labelEN: "Change Password", labelFR: "Changer le mot de passe" },
  { id: "support", labelEN: "Support", labelFR: "Support" },
  { id: "artisan-reports", labelEN: "Artisan Reports", labelFR: "Rapports artisans" },
  { id: "faqs", labelEN: "FAQ's", labelFR: "FAQ" },
  { id: "privacy-policy", labelEN: "Privacy Policy", labelFR: "Politique de confidentialité" },
  { id: "terms", labelEN: "Terms & Conditions", labelFR: "Conditions générales" },
  { id: "about", labelEN: "About Us", labelFR: "À propos" },
];

export default function Settings({ lang }: { lang: Language }) {
  const [activePage, setActivePage] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setActivePage(itemId);
  };

  const handleBack = () => {
    setActivePage(null);
  };

  // Render sub-pages
  if (activePage === "change-password") {
    return <ChangePassword lang={lang} onBack={handleBack} />;
  }

  if (activePage === "privacy-policy") {
    return <PrivacyPolicy lang={lang} onBack={handleBack} />;
  }

  if (activePage === "terms") {
    return <TermsConditions lang={lang} onBack={handleBack} />;
  }

  if (activePage === "about") {
    return <AboutUs lang={lang} onBack={handleBack} />;
  }

  if (activePage === "support") {
    return <Support lang={lang} onBack={handleBack} />;
  }

  if (activePage === "faqs") {
    return <FAQs lang={lang} onBack={handleBack} />;
  }

  if (activePage === "artisan-reports") {
    return <ArtisanReports lang={lang} onBack={handleBack} />;
  }

  // Main Settings List
  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden max-w-4xl">
        {/* Header */}
        <div className="px-6 py-5 text-white" style={{ background: "linear-gradient(144.926deg, #1b457c 12%, #5286ca 88%)" }}>
          <h1 className="text-2xl font-semibold">
            {lang === "EN" ? "Settings" : "Paramètres"}
          </h1>
        </div>

        {/* Settings List */}
        <div className="divide-y divide-border">
          {SETTINGS_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-muted/50 transition-colors group"
            >
              <span className="text-base lg:text-lg font-normal text-foreground group-hover:text-primary transition-colors">
                {lang === "EN" ? item.labelEN : item.labelFR}
              </span>
              <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
