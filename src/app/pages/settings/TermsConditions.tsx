import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";

type Language = "EN" | "FR";

export default function TermsConditions({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [content, setContent] = useState(`<h2>Terms and Conditions</h2>
<p>Last updated: May 7, 2026</p>
<h3>1. Acceptance of Terms</h3>
<p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
<h3>2. Use License</h3>
<p>Permission is granted to temporarily use this platform for personal, non-commercial transitory viewing only.</p>
<h3>3. Service Description</h3>
<p>Our platform connects service providers with clients seeking various services including but not limited to:</p>
<ul>
  <li>Plumbing services</li>
  <li>Electrical work</li>
  <li>Carpentry</li>
  <li>Home repairs</li>
</ul>
<h3>4. User Responsibilities</h3>
<p>Users agree to provide accurate information and maintain the security of their account credentials.</p>
<h3>5. Payment Terms</h3>
<p>All payments must be made through the platform's secure payment system. Service fees apply as outlined in our pricing policy.</p>`);

  const t = {
    title: lang === "EN" ? "Terms & Conditions" : "Conditions générales",
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
