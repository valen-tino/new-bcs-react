import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * MultilingualEditor component for editing content in multiple languages
 * 
 * @param {Object} props - Component props
 * @param {Object} props.content - The content object with language keys (English, Indonesia)
 * @param {Function} props.onChange - Function to call when content changes
 * @param {String} props.fieldName - Name of the field being edited (for labels)
 * @param {Boolean} props.isSimple - If true, uses textarea instead of rich text editor
 * @param {Number} props.rows - Number of rows for textarea (only used if isSimple=true)
 * @param {String} props.placeholder - Placeholder text
 */
function MultilingualEditor({ 
  content = { English: '', Indonesia: '' }, 
  onChange, 
  fieldName = 'Content',
  isSimple = false,
  rows = 4,
  placeholder = 'Enter content...',
  className = ''
}) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('English');
  const editorRefEnglish = useRef(null);
  const editorRefIndonesia = useRef(null);
  
  const handleContentChange = (lang, value) => {
    if (onChange) {
      onChange({
        ...content,
        [lang]: value
      });
    }
  };

  return (
    <div className={`multilingual-editor ${className}`}>
      <div className="mb-2 flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('English')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'English' 
            ? 'text-orange-600 border-b-2 border-orange-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('Indonesia')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'Indonesia' 
            ? 'text-orange-600 border-b-2 border-orange-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Indonesian
        </button>
      </div>

      <div className="mt-2">
        {activeTab === 'English' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{fieldName} (English)</label>
            {isSimple ? (
              <textarea
                value={content.English || ''}
                onChange={(e) => handleContentChange('English', e.target.value)}
                rows={rows}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder={placeholder}
              />
            ) : (
              <Editor
                apiKey="qi0nenw5umgv10sw07bvpjtaftf20chbphdm63kytqo8xzvx"
                onInit={(evt, editor) => editorRefEnglish.current = editor}
                value={content.English || ''}
                onEditorChange={(content) => handleContentChange('English', content)}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'Indonesia' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{fieldName} (Indonesian)</label>
            {isSimple ? (
              <textarea
                value={content.Indonesia || ''}
                onChange={(e) => handleContentChange('Indonesia', e.target.value)}
                rows={rows}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder={placeholder}
              />
            ) : (
              <Editor
                apiKey="qi0nenw5umgv10sw07bvpjtaftf20chbphdm63kytqo8xzvx"
                onInit={(evt, editor) => editorRefIndonesia.current = editor}
                value={content.Indonesia || ''}
                onEditorChange={(content) => handleContentChange('Indonesia', content)}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MultilingualEditor;