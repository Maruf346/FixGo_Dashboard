import { loadStoredAuth } from "../../../services/auth";
import RichTextPage from "../../components/RichTextPage";
import { getPrivacy, patchPrivacy } from "../../../services/support";

type Language = "EN" | "FR";

export default function PrivacyPolicy({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const title = lang === "EN" ? "Privacy Policy" : "Politique de confidentialité";

  return (
    <RichTextPage
      lang={lang}
      title={title}
      onBack={onBack}
      getContent={getPrivacy}
      patchContent={async (content) => {
        const { accessToken } = loadStoredAuth();
        if (!accessToken) {
          throw new Error(lang === "EN" ? "Authentication required." : "Authentification requise.");
        }
        return patchPrivacy(accessToken, content);
      }}
    />
  );
}
