import { loadStoredAuth } from "../../../services/auth";
import RichTextPage from "../../components/RichTextPage";
import { getTerms, patchTerms } from "../../../services/support";

type Language = "EN" | "FR";

export default function TermsConditions({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const title = lang === "EN" ? "Terms & Conditions" : "Conditions générales";

  return (
    <RichTextPage
      lang={lang}
      title={title}
      onBack={onBack}
      getContent={async () => {
        const { accessToken } = loadStoredAuth();
        if (!accessToken) {
          throw new Error(lang === "EN" ? "Authentication required." : "Authentification requise.");
        }
        return getTerms(accessToken);
      }}
      patchContent={async (content) => {
        const { accessToken } = loadStoredAuth();
        if (!accessToken) {
          throw new Error(lang === "EN" ? "Authentication required." : "Authentification requise.");
        }
        return patchTerms(accessToken, content);
      }}
    />
  );
}
