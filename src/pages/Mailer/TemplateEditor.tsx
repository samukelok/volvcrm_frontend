import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send, Smartphone, Monitor, Eye, Code, Palette, Type } from 'lucide-react';
import EmailPreview from './EmailPreview';
import $ from 'jquery';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface TemplateEditorProps {
  templateData?: {
    id?: string | number;
    name: string;
    subject: string;
    body_html: string;
    body_text?: string;
    category?: string;
    type?: string;
    is_default?: boolean;
  };
  onSave: (template: any) => void;
  onBack: () => void;
}

// Expose jQuery globally
declare global {
  interface Window {
    jQuery: typeof $;
    $: typeof $;
  }
}
window.$ = window.jQuery = $;

// Extend jQuery typings
declare global {
  interface JQuery {
    summernote(...args: any[]): any;
  }
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateData,
  onSave,
  onBack,
}) => {
  const [templateName, setTemplateName] = useState(templateData?.name || 'Untitled Template');
  const [subject, setSubject] = useState(templateData?.subject || '');
  const [content, setContent] = useState(templateData?.body_html || '');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual'>('visual');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showTestSuccess, setShowTestSuccess] = useState(false);
  const [editorContent, setEditorContent] = useState(templateData?.body_html || '');
  const [summernoteLoaded, setSummernoteLoaded] = useState(false);

  // Initialize with the actual template data
  useEffect(() => {
    if (templateData) {
      setTemplateName(templateData.name);
      setSubject(templateData.subject);
      setContent(templateData.body_html);
      setEditorContent(templateData.body_html);
    }
  }, [templateData]);

  useEffect(() => {
    const loadSummernote = async () => {
      try {
        // Import Summernote dynamically
        await import('summernote/dist/summernote-bs4.min.css');
        await import('summernote/dist/summernote-bs4.js');
        setSummernoteLoaded(true);
      } catch (error) {
        console.error('Failed to load Summernote:', error);
      }
    };

    loadSummernote();
  }, []);

  useEffect(() => {
    if (!summernoteLoaded) return;

    if (viewMode === 'visual') {
      // Initialize Summernote
      $('#summernote-editor').summernote({
        placeholder: 'Compose your email template...',
        height: 350,
        minHeight: 300,
        maxHeight: null,
        tabsize: 2,
        dialogsInBody: true,
        disableDragAndDrop: false,
        focus: false,
        airMode: false,
        disableResizeEditor: false,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert', ['link', 'picture']],
          ['view', ['fullscreen', 'codeview']],
        ],
        callbacks: {
          onChange: function(contents: string) {
            setEditorContent(contents);
            setContent(contents);
          }
        }
      });

      // Set the existing content
      $('#summernote-editor').summernote('code', editorContent);

      // Fix modal z-index issues
      $(document).on('show.bs.modal', '.note-modal', function() {
        $(this).css('z-index', 9999);
      });

      // Ensure dialogs appear above everything
      $('.note-editor .note-dialog').css('z-index', 10000);
    }

    return () => {
      if ($('#summernote-editor').data('summernote')) {
        $(document).off('show.bs.modal', '.note-modal');
        $('#summernote-editor').summernote('destroy');
      }
    };
  }, [viewMode, summernoteLoaded]);

  const handleSave = () => {
    // Get the current content from Summernote if in visual mode
    let currentContent = editorContent;
    if (viewMode === 'visual' && $('#summernote-editor').data('summernote')) {
      currentContent = $('#summernote-editor').summernote('code');
    }

    const template = {
      id: templateData?.id,
      name: templateName,
      subject,
      body_html: currentContent,
      body_text: templateData?.body_text || '',
      category: templateData?.category || 'custom',
      type: templateData?.type || 'custom',
      is_default: templateData?.is_default || false,
    };

    onSave(template);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleSendTest = () => {
    setShowTestSuccess(true);
    setTimeout(() => setShowTestSuccess(false), 3000);
  };

  const insertPlaceholder = (placeholder: string) => {
    if (viewMode === 'visual' && $('#summernote-editor').data('summernote')) {
      $('#summernote-editor').summernote('pasteHTML', ` {{${placeholder}}}`);
    } else {
      const newContent = editorContent + ` {{${placeholder}}}`;
      setEditorContent(newContent);
      setContent(newContent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Templates
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">{templateName}</h1>
          </div>

          <div className="flex items-center space-x-3">
            {showSaveSuccess && (
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium animate-fade-in">
                Template saved successfully!
              </div>
            )}
            {showTestSuccess && (
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium animate-fade-in">
                Test email sent successfully!
              </div>
            )}
            <button
              onClick={handleSendTest}
              className="btn-secondary inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Test
            </button>
            <button
              onClick={handleSave}
              className="btn-primary inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Editor */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col relative">
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Editor Controls */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'visual'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Visual
              </button>
              
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Insert:</span>
              {['Name', 'CompanyName', 'UnsubscribeLink'].map((placeholder) => (
                <button
                  key={placeholder}
                  onClick={() => insertPlaceholder(placeholder)}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium hover:bg-purple-200 transition-colors"
                >
                  {`{{${placeholder}}}`}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 p-4">
            <div className="h-full border border-gray-300 rounded-lg bg-white shadow-sm">
              {viewMode === 'visual' ? (
                <div className="h-full overflow-auto">
                  {summernoteLoaded ? (
                    <textarea 
                      id="summernote-editor" 
                      name="editordata"
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
                      Loading editor...
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={editorContent}
                  onChange={(e) => {
                    setEditorContent(e.target.value);
                    setContent(e.target.value);
                  }}
                  className="w-full h-full p-4 border-0 resize-none focus:outline-none font-mono text-sm bg-gray-900 text-green-400 overflow-auto"
                  placeholder="<html>...</html>"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-50 flex flex-col">
          <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded transition-colors ${previewMode === 'desktop'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded transition-colors ${previewMode === 'mobile'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-hidden">
            <div className="h-full bg-white border border-gray-300 rounded-lg shadow-sm overflow-auto">
              <div className="p-4">
            <EmailPreview
              content={content}
              subject={subject}
              previewMode={previewMode}
            />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;