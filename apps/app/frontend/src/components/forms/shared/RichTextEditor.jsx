import { useCallback, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function RichTextEditor({ 
  initialHTML = '', 
  placeholder, 
  label = "Description",
  onChangeHtml, 
}) {
  const [html, setHtml] = useState(initialHTML);

  const handleChange = useCallback((_, __, ___, editor) => {
  const nextHTML = editor.getHTML(); // full HTML snapshot
  console.log("Editor HTML:", nextHTML);
  setHtml(nextHTML);
  onChangeHtml?.(nextHTML);
}, [onChangeHtml]);

  const modules = {
    toolbar: [
      ['bold'],
      ['italic'],
      [{'list': 'bullet'}, ],
      [{'list': 'ordered'}],
      ['link']
    ]
  }

  const formats = [
    'bold',
    'italic',
    'list',
    'link'
  ]


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
  )
}

export default RichTextEditor;