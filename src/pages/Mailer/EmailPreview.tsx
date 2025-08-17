import React from 'react';

interface EmailPreviewProps {
  content: string;
  subject: string;
  previewMode: 'desktop' | 'mobile';
}

const EmailPreview: React.FC<EmailPreviewProps> = ({
  content,
  subject,
  previewMode,
}) => {
  // Replace placeholders with sample data
  const processContent = (htmlContent: string) => {
    return htmlContent
      .replace(/\{\{Name\}\}/g, 'John Smith')
      .replace(/\{\{CompanyName\}\}/g, 'Solar Solutions Inc.')
      .replace(/\{\{UnsubscribeLink\}\}/g, 'volvcrm.com/unsubscribe/123');
  };

  const processedContent = processContent(content);
  
  const containerWidth = previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl';
  const containerClass = `${containerWidth} mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300`;

  return (
    <div className="h-full flex flex-col">
      {/* Email Header Simulation */}
      <div className="bg-gray-50 border border-gray-200 rounded-t-lg p-4 mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              S
            </div>
            <div>
              <div className="font-medium text-gray-900">Solar Solutions Inc.</div>
              <div className="text-xs">no-reply@solarsolutions.com</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Just now
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="font-semibold text-gray-900">
            {subject || 'Subject line will appear here...'}
          </div>
        </div>
      </div>

      {/* Email Content Preview */}
      <div className="flex-1 overflow-auto">
        <div className={containerClass}>
          <div 
            className="email-preview-content"
            dangerouslySetInnerHTML={{ __html: processedContent }}
            style={{
              fontSize: previewMode === 'mobile' ? '14px' : '16px',
              lineHeight: '1.6',
            }}
          />
        </div>
      </div>

      {/* Preview Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-700 font-medium">
            Preview Mode: {previewMode === 'mobile' ? 'Mobile' : 'Desktop'}
          </span>
          <span className="text-blue-600">
            {previewMode === 'mobile' ? '375px width' : '600px width'}
          </span>
        </div>
        <div className="mt-1 text-xs text-blue-600">
          Placeholders are filled with sample data for preview
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;