import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";

type Language = "EN" | "FR";

export default function PrivacyPolicy({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [content, setContent] = useState(`<h2>Privacy Policy</h2>
<p>Last updated: May 7, 2026</p>
<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, including:</p>
<ul>
  <li>Name and contact information</li>
  <li>Account credentials</li>
  <li>Payment information</li>
  <li>Service preferences and history</li>
</ul>
<h3>2. How We Use Your Information</h3>
<p>We use the information we collect to:</p>
<ul>
  <li>Provide, maintain, and improve our services</li>
  <li>Process transactions and send related information</li>
  <li>Send technical notices and support messages</li>
  <li>Respond to your comments and questions</li>
</ul>
<h3>3. Information Sharing</h3>
<p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
<h3>4. Data Security</h3>
<p>We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>
<h3>5. Your Rights</h3>
<p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>`);

  const t = {
    title: lang === "EN" ? "Privacy Policy" : "Politique de confidentialité",
    save: lang === "EN" ? "Save" : "Enregistrer",
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving content:", content);
  };

  return (
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
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-white text-primary rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
          >
            {t.save}
          </button>
        </div>

        {/* Editor Area */}
        <div className="p-6 lg:p-8">
          <div className="min-h-[500px] bg-white border border-border rounded-lg overflow-hidden">
            <CKEditor
              editor={ClassicEditor}
              data={content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
              config={{
                licenseKey: 'GPL',
                toolbar: [
                  'heading', '|',
                  'bold', 'italic', 'link', '|',
                  'bulletedList', 'numberedList', '|',
                  'blockQuote', 'insertTable', '|',
                  'undo', 'redo'
                ],
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
