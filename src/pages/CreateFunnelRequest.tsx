import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, MessageCircle, Phone, Mail } from 'lucide-react'

const CreateFunnelRequest = () => {
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    targetAudience: '',
    ctaType: 'form',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    requirements: '',
    deadline: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Transform the form data to match backend expectations
    const submitData = {
      ...formData,
      brand_colors: [
        formData.primaryColor,
        formData.secondaryColor
      ]
    }
    
    console.log('Form submitted:', submitData)
  }

  const ctaOptions = [
    {
      value: 'form',
      label: 'Contact Form',
      description: 'Collect lead information',
      icon: FileText,
      color: 'blue'
    },
    {
      value: 'whatsapp',
      label: 'WhatsApp',
      description: 'Direct messaging',
      icon: MessageCircle,
      color: 'green'
    },
    {
      value: 'call',
      label: 'Phone Call',
      description: 'Direct phone contact',
      icon: Phone,
      color: 'purple'
    },
    {
      value: 'email',
      label: 'Email',
      description: 'Email contact',
      icon: Mail,
      color: 'red'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/funnel-requests"
          className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request New Funnel</h1>
          <p className="mt-2 text-gray-600">Tell us about your funnel requirements and we'll create a custom landing page for you.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-effect rounded-2xl p-8 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-white/20 pb-2">
            Basic Information
          </h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Funnel Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Solar Panel Lead Generation, Summer Sale Campaign"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Goal *
            </label>
            <textarea
              id="goal"
              name="goal"
              required
              rows={4}
              value={formData.goal}
              onChange={handleInputChange}
              placeholder="Describe what you want to achieve with this funnel. Be specific about your objectives."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              name="targetAudience"
              rows={3}
              value={formData.targetAudience}
              onChange={handleInputChange}
              placeholder="Who is your ideal customer? Demographics, interests, pain points, etc."
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-white/20 pb-2">
            Call-to-Action
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What action should visitors take? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ctaOptions.map((option) => {
                const Icon = option.icon
                const isSelected = formData.ctaType === option.value
                
                return (
                  <label
                    key={option.value}
                    className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? `border-${option.color}-500 bg-${option.color}-50`
                        : 'border-gray-200 hover:border-gray-300 bg-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ctaType"
                      value={option.value}
                      checked={isSelected}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <Icon className={`w-8 h-8 mb-3 ${
                      isSelected ? `text-${option.color}-600` : 'text-gray-400'
                    }`} />
                    <span className="text-sm font-semibold text-gray-900 mb-1">
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-500 text-center">
                      {option.description}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-white/20 pb-2">
            Additional Requirements
          </h2>
          
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements or Notes
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="Any specific features, integrations, or design preferences you'd like us to consider..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              className="input-field max-w-xs"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-6 border-t border-white/20">
          <Link
            to="/funnel-requests"
            className="btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-primary"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateFunnelRequest