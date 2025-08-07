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
    'link'
  ]

  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{label}</label>
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
        /* Responsive toolbar */
        .rich-text-wrapper .ql-toolbar {
            border: 1px solid rgb(209, 213, 219) !important;
            border-bottom: none !important;
            border-radius: 6px 6px 0 0 !important;
            background-color: rgb(249, 250, 251) !important;
            padding: 6px !important;
          }
          
        @media (min-width: 640px) {
          .rich-text-wrapper .ql-toolbar {
            padding: 8px !important;
          }
        }

        /* Responsive container */
        .rich-text-wrapper .ql-container {
            border: 1px solid rgb(209, 213, 219) !important;
            border-top: none !important;
            border-radius: 0 0 6px 6px !important;
            font-family: inherit !important;
            min-height: 120px;
          }
          
        @media (min-width: 640px) {
          .rich-text-wrapper .ql-container {
            min-height: 150px;
          }
        }

        /* Responsive editor */
        .rich-text-wrapper .ql-editor {
            padding: 8px 10px !important;
            min-height: 64px !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
          }
          
        @media (min-width: 640px) {
          .rich-text-wrapper .ql-editor {
            padding: 8px 12px !important;
            font-size: 16px !important;
          }
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
            font-size: 14px !important;
          }
          
        @media (min-width: 640px) {
          .rich-text-wrapper .ql-editor.ql-blank::before {
            font-size: 16px !important;
          }
        }

        .rich-text-wrapper .ql-fill {
            fill: rgb(75, 85, 99) !important;
          }
          
        /* Responsive toolbar buttons */
        .rich-text-wrapper .ql-toolbar button {
          width: 24px !important;
          height: 24px !important;
          padding: 2px !important;
        }
        
        @media (min-width: 640px) {
          .rich-text-wrapper .ql-toolbar button {
            width: 28px !important;
            height: 28px !important;
            padding: 3px !important;
          }
        }
        
        /* Responsive toolbar icons */
        .rich-text-wrapper .ql-toolbar .ql-stroke {
          stroke-width: 2 !important;
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