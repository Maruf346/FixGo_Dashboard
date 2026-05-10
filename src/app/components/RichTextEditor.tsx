import { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";

const STYLES = `
.ck-editor-wrap .ck.ck-toolbar {
  border-radius: 1rem 1rem 0 0 !important;
  background: #f8fafc !important;
  border-color: #e5e7eb !important;
}
.ck-editor-wrap .ck.ck-toolbar .ck-button:hover:not(.ck-disabled) {
  background: #fff4ee !important;
  color: #f54900 !important;
}
.ck-editor-wrap .ck.ck-button.ck-on {
  background: #fff4ee !important;
  color: #f54900 !important;
}
.ck-editor-wrap .ck-editor__main > .ck-editor__editable {
  min-height: 280px;
  padding: 1rem 1.25rem;
  border-radius: 0 0 1rem 1rem !important;
  border-color: #e5e7eb !important;
  font-size: 0.95rem;
  line-height: 1.75;
  color: #1f2937;
}
.ck-editor-wrap .ck-editor__main > .ck-editor__editable:focus {
  box-shadow: 0 0 0 3px rgba(245, 73, 0, 0.1) !important;
}
`; 
let stylesInjected = false;

function injectStyles() {
  if (typeof document === "undefined" || stylesInjected) return;
  const style = document.createElement("style");
  style.textContent = STYLES;
  document.head.appendChild(style);
  stylesInjected = true;
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <div className="ck-editor-wrap">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "alignment",
              "|",
              "link",
              "blockQuote",
              "|",
              "indent",
              "outdent",
              "|",
              "undo",
              "redo",
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: {
            options: [
              { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
              { model: "heading1", title: "Heading 1", view: "h1", class: "ck-heading_heading1" },
              { model: "heading2", title: "Heading 2", view: "h2", class: "ck-heading_heading2" },
              { model: "heading3", title: "Heading 3", view: "h3", class: "ck-heading_heading3" },
            ],
          },
        }}
        onChange={(_, editor) => onChange(editor.getData())}
      />
    </div>
  );
}
