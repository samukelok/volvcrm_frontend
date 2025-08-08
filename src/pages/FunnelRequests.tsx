import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import axios from 'axios';
import { useQuery } from 'react-query';

interface Funnel {
  id: number;
  title: string;
  goal: string;
  target_audience: string;
  cta: string;
  notes?: string;
  deadline: string;
  priority: string;
  status: string;
  created_at: string;
  media?: Array<{
    id: number;
    file_path: string;
    file_name: string;
  }>;
}

interface ApiResponse {
  user: any;
  client: any;
  funnels: Funnel[];
}

const fetchFunnels = async (): Promise<ApiResponse> => {
  const response = await axios.get('/my-funnels');
  return response.data;
};

const FunnelRequests = () => {
  const { data, isLoading, error } = useQuery<ApiResponse>('funnels', fetchFunnels);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    cta: ''
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredFunnels = data?.funnels?.filter(funnel => {
    return (
      (filters.status === '' || funnel.status.toLowerCase() === filters.status.toLowerCase()) &&
      (filters.priority === '' || funnel.priority.toLowerCase() === filters.priority.toLowerCase()) &&
      (filters.cta === '' || funnel.cta.toLowerCase() === filters.cta.toLowerCase())
    );
  }) || [];

  // Helper functions remain the same as before
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'submitted':
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'complete': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'complete': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal':
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCTAIcon = (cta: string) => {
    switch (cta.toLowerCase()) {
      case 'form': return '📝';
      case 'whatsapp': return '💬';
      case 'call': return '📞';
      case 'email': return '✉️';
      default: return '📝';
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading funnels...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading funnels</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funnel Requests</h1>
          <p className="mt-2 text-gray-600">Manage your funnel requests and track their progress.</p>
        </div>
        <Link to="/funnel-requests/create" className="mt-4 sm:mt-0 btn-primary inline-flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Request New Funnel
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-wrap gap-4">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input-field max-w-xs"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="live">Live</option>
            <option value="complete">Complete</option>
          </select>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="input-field max-w-xs"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <select
            name="cta"
            value={filters.cta}
            onChange={handleFilterChange}
            className="input-field max-w-xs"
          >
            <option value="">All CTA Types</option>
            <option value="form">Form</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      {/* Funnels Grid */}
      {filteredFunnels.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFunnels.map((funnel) => (
            <div key={funnel.id} className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(funnel.status)}
                    <h3 className="text-lg font-semibold text-gray-900"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 'calc(100% - 24px)',
                      }}

                      title={funnel.title}
                    >
                      {funnel.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,     
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}

                    title={funnel.goal}
                  >
                    {funnel.goal}</p>
                </div>
                <Link to={`/funnels/${funnel.id}`} className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <Eye className="w-4 h-4 text-gray-600" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(funnel.status)}`}>
                    {funnel.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Priority</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(funnel.priority)}`}>
                    {funnel.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">CTA Type</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getCTAIcon(funnel.cta)} {funnel.cta}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Deadline</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-900">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(funnel.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {funnel.media && funnel.media.length > 0 && (
                  <div className="pt-3 border-t border-white/20">
                    <p className="text-xs text-gray-500 mb-1">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {funnel.media.map(media => (
                        <a
                          key={media.id}
                          href={`/storage/${media.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {media.file_name.split('/').pop()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-white/20">
                  <p className="text-xs text-gray-500 mb-1">Target Audience</p>
                  <p className="text-sm text-gray-700"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                    title={funnel.target_audience}
                  >
                    {funnel.target_audience}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-500">
                    Created {new Date(funnel.created_at).toLocaleDateString()}
                  </span>
                  <Link to={`/funnels/${funnel.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No funnels found matching your filters</div>
          <Link to="/funnel-requests/create" className="btn-primary inline-flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Create New Funnel
          </Link>
        </div>
      )}
    </div>
  );
};

export default FunnelRequests;