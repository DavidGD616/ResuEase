import { useState } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function RichTextEditor({ placeholder, label = "Description" }) {
  const [value, setValue] = useState('');

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
    'bullet',
    'link'
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="rich-text-wrapper">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
        />
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        .rich-text-wrapper .ql-toolbar {
            border: 1px solid rgb(209, 213, 219) !important;
            border-bottom: none !important;
            border-radius: 6px 6px 0 0 !important;
            background-color: rgb(249, 250, 251) !important;
            padding: 8px !important;
          }

        .rich-text-wrapper .ql-container {
            border: 1px solid rgb(209, 213, 219) !important;
            border-top: none !important;
            border-radius: 0 0 6px 6px !important;
            font-family: inherit !important;
            min-height: 150px;
          }

        .rich-text-wrapper .ql-editor {
            padding: 8px 12px !important;
            min-height: 64px !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
          }

        .rich-text-wrapper .ql-editor:focus {
            outline: none !important;
          }

        .rich-text-wrapper:focus-within {
            box-shadow: 0 0 0 2px rgb(59, 130, 246, 0.5) !important;
            border-radius: 6px !important;
          }

        .rich-text-wrapper .ql-editor.ql-blank::before {
            font-style: normal !important;
            color: rgb(156, 163, 175) !important;
          }

        .rich-text-wrapper .ql-fill {
            fill: rgb(75, 85, 99) !important;
          }

        /* List spacing fixes - reduce big spaces in bullet/ordered lists */
          .rich-text-wrapper .ql-editor ul {
            margin: 0 !important;
            padding-left: 1.5em !important;
          }
          
          .rich-text-wrapper .ql-editor ol {
            margin: 0 !important;
            padding-left: 1.5em !important;
          }
          
          .rich-text-wrapper .ql-editor li {
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1.5 !important;
          }
        `
      }} />
    </div>
  )
}

export default RichTextEditor;