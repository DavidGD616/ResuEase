import { useCallback, useState } from 'react';
// @ts-ignore - react-quill-new is not installed; RichTextEditor is currently unused
import ReactQuill from 'react-quill-new';
// @ts-ignore
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  initialHTML?: string;
  placeholder?: string;
  label?: string;
  onChangeHtml?: (html: string) => void;
}

function RichTextEditor({
  initialHTML = '',
  placeholder,
  label = 'Description',
  onChangeHtml,
}: RichTextEditorProps) {
  const [html, setHtml] = useState(initialHTML);

  const handleChange = useCallback(
    (_: string, __: unknown, ___: unknown, editor: { getHTML: () => string }) => {
      const nextHTML = editor.getHTML();
      console.log('Editor HTML:', nextHTML);
      setHtml(nextHTML);
      onChangeHtml?.(nextHTML);
    },
    [onChangeHtml]
  );

  const modules = {
    toolbar: [
      ['bold'],
      ['italic'],
      [{ list: 'bullet' }],
      [{ list: 'ordered' }],
      ['link'],
    ],
  };

  const formats = ['bold', 'italic', 'list', 'link'];

  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{label}</label>
      <div className="rich-text-wrapper">
        <ReactQuill
          theme="snow"
          value={html}
          onChange={handleChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
        />
      </div>
    </div>
  );
}

export default RichTextEditor;
