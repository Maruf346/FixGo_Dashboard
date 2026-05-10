import { loadStoredAuth } from "../../../services/auth";
import RichTextPage from "../../components/RichTextPage";
import { getAboutUs, patchAboutUs } from "../../../services/support";

type Language = "EN" | "FR";

export default function AboutUs({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const title = lang === "EN" ? "About Us" : "À propos";

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
        return getAboutUs(accessToken);
      }}
      patchContent={async (content) => {
        const { accessToken } = loadStoredAuth();
        if (!accessToken) {
          throw new Error(lang === "EN" ? "Authentication required." : "Authentification requise.");
        }
        return patchAboutUs(accessToken, content);
      }}
    />
  );
}
