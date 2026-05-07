import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";

type Language = "EN" | "FR";

export default function AboutUs({ lang, onBack }: { lang: Language; onBack: () => void }) {
  const [content, setContent] = useState(`<p>Welcome to our platform! We are dedicated to providing the best service marketplace experience.</p>
<p>Our mission is to connect skilled artisans with clients who need their services, creating a seamless and efficient marketplace for everyone.</p>
<h3>Our Values</h3>
<ul>
  <li>Quality service delivery</li>
  <li>Trust and transparency</li>
  <li>Customer satisfaction</li>
  <li>Innovation and excellence</li>
</ul>
<p>Thank you for being part of our community!</p>`);

  const t = {
    title: lang === "EN" ? "About Us" : "À propos",
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
