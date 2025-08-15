import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface Layout {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  preview: string;
}

interface LayoutSelectorProps {
  onSelectLayout: (layoutId: string) => void;
  onBack: () => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ onSelectLayout, onBack }) => {
  const layouts: Layout[] = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      description: 'Hero image, welcome text, and call-to-action button',
      category: 'Onboarding',
      thumbnail: 'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
            <h1 style="margin: 0 0 10px 0;">Welcome to {{CompanyName}}!</h1>
            <p style="margin: 0; opacity: 0.9;">We're excited to have you on board</p>
          </div>
          <div style="padding: 30px 20px;">
            <p>Hi {{Name}},</p>
            <p>Welcome to our community! We're thrilled to have you join us on this journey.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{Download}}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">Get Started</a>
            </div>
            <p>Best regards,<br>The {{CompanyName}} Team</p>
          </div>
        </div>
      `
    },
    {
      id: 'followup',
      name: 'Follow-up Email',
      description: 'Simple text with clear call-to-action',
      category: 'Engagement',
      thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2d3748;">Quick Follow-up</h2>
          <p>Hello {{Name}},</p>
          <p>I wanted to follow up on our conversation about your solar project. Do you have any questions I can help answer?</p>
          <p>I'm here to help make your transition to clean energy as smooth as possible.</p>
          <div style="margin: 25px 0;">
            <a href="{{Download}}" style="background: #48bb78; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Schedule a Call</a>
          </div>
          <p>Best regards,<br>{{CompanyName}}</p>
        </div>
      `
    },
    {
      id: 'announcement',
      name: 'Announcement Email',
      description: 'Featured image with announcement content',
      category: 'Marketing',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600" style="width: 100%; height: 200px; object-fit: cover;">
          <div style="padding: 30px 20px;">
            <h1 style="color: #1a202c; margin-bottom: 15px;">Big News Coming!</h1>
            <p>Hi {{Name}},</p>
            <p>We have some exciting updates to share with you about our latest solar technology innovations.</p>
            <p>Stay tuned for more details coming your way soon!</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="{{Download}}" style="background: #ed8936; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">Learn More</a>
            </div>
            <p>Cheers,<br>{{CompanyName}} Team</p>
          </div>
        </div>
      `
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Multi-section newsletter with articles',
      category: 'Content',
      thumbnail: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: #4a5568; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">{{CompanyName}} Newsletter</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Monthly Solar Industry Updates</p>
          </div>
          <div style="padding: 20px;">
            <p>Dear {{Name}},</p>
            <h3 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">This Month's Highlights</h3>
            <p>Here are the latest updates from the solar industry and our company.</p>
            <div style="background: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="color: #2d3748; margin: 0 0 10px 0;">Featured Article</h4>
              <p style="margin: 0;">The future of renewable energy looks brighter than ever...</p>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="{{Download}}" style="background: #3182ce; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Read Full Newsletter</a>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'promotion',
      name: 'Promotional Email',
      description: 'Special offer with countdown and urgency',
      category: 'Sales',
      thumbnail: 'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); padding: 30px 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🌟 Special Offer!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Limited Time Only</p>
          </div>
          <div style="padding: 30px 20px; text-align: center;">
            <p>Hi {{Name}},</p>
            <h2 style="color: #e53e3e; margin: 20px 0;">25% OFF Solar Installation</h2>
            <p>Don't miss out on this exclusive offer for our valued customers!</p>
            <div style="background: #fed7d7; border: 2px dashed #e53e3e; padding: 20px; margin: 25px 0; border-radius: 8px;">
              <p style="margin: 0; font-weight: bold; color: #e53e3e;">Offer expires in 7 days!</p>
            </div>
            <a href="{{Download}}" style="background: #e53e3e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin: 20px 0;">Claim Your Discount</a>
            <p>Questions? Reply to this email anytime!</p>
            <p>Best,<br>{{CompanyName}}</p>
          </div>
        </div>
      `
    },
    {
      id: 'thankyou',
      name: 'Thank You Email',
      description: 'Appreciation message with next steps',
      category: 'Support',
      thumbnail: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #48bb78; color: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;">✓</div>
            <h1 style="color: #2d3748; margin: 0;">Thank You!</h1>
          </div>
          <p>Dear {{Name}},</p>
          <p>Thank you for choosing {{CompanyName}} for your solar energy needs. Your installation has been completed successfully!</p>
          <div style="background: #f0fff4; border-left: 4px solid #48bb78; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #2f855a;">Your system is now generating clean energy!</p>
          </div>
          <p>Here's what happens next:</p>
          <ul style="color: #4a5568;">
            <li>Monitor your system performance online</li>
            <li>Schedule your first maintenance check</li>
            <li>Access your customer portal</li>
          </ul>
          <div style="text-align: center; margin: 25px 0;">
            <a href="{{Download}}" style="background: #48bb78; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">Access Portal</a>
          </div>
          <p>Thank you for going solar!</p>
          <p>{{CompanyName}} Team</p>
        </div>
      `
    },
    {
      id: 'reminder',
      name: 'Reminder Email',
      description: 'Gentle reminder with clear action items',
      category: 'Engagement',
      thumbnail: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <div style="background: #fef5e7; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
            <h2 style="color: #d69e2e; margin: 0 0 10px 0;">⏰ Friendly Reminder</h2>
            <p style="margin: 0; color: #744210;">Don't forget about your upcoming appointment</p>
          </div>
          <p>Hello {{Name}},</p>
          <p>This is a gentle reminder about your solar consultation scheduled for next week.</p>
          <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin: 0 0 15px 0;">Appointment Details:</h3>
            <p style="margin: 5px 0; color: #4a5568;"><strong>Date:</strong> [Date to be filled]</p>
            <p style="margin: 5px 0; color: #4a5568;"><strong>Time:</strong> [Time to be filled]</p>
            <p style="margin: 5px 0; color: #4a5568;"><strong>Duration:</strong> 45 minutes</p>
          </div>
          <p>Please let us know if you need to reschedule.</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="{{Download}}" style="background: #d69e2e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px;">Confirm Appointment</a>
            <a href="#" style="background: #e2e8f0; color: #4a5568; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reschedule</a>
          </div>
          <p>Looking forward to speaking with you!</p>
          <p>Best regards,<br>{{CompanyName}}</p>
        </div>
      `
    },
    {
      id: 'survey',
      name: 'Survey Email',
      description: 'Feedback request with survey link',
      category: 'Feedback',
      thumbnail: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #553c9a;">We'd Love Your Feedback!</h1>
            <p style="color: #6b46c1; margin: 0;">Help us improve our service</p>
          </div>
          <p>Dear {{Name}},</p>
          <p>How was your experience with {{CompanyName}}? Your feedback helps us serve you better.</p>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0;">Quick Survey</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.9;">Takes less than 2 minutes</p>
            <a href="{{Download}}" style="background: white; color: #553c9a; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Take Survey</a>
          </div>
          <div style="background: #f8f9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b46c1;"><strong>Why your feedback matters:</strong> It helps us improve our products and services for everyone.</p>
          </div>
          <p>Thank you for your time!</p>
          <p>With appreciation,<br>The {{CompanyName}} Team</p>
        </div>
      `
    }
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Choose a Layout</h3>
          <p className="text-sm text-gray-600">Select a template to customize for your needs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            className="group cursor-pointer"
            onClick={() => onSelectLayout(layout.id)}
          >
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img
                  src={layout.thumbnail}
                  alt={layout.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                    {layout.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{layout.name}</h4>
                <p className="text-sm text-gray-600">{layout.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;