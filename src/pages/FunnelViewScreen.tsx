import React from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { ArrowLeft, Eye, Download } from 'lucide-react';

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

const fetchFunnel = async (id: string): Promise<Funnel> => {
  const response = await axios.get(`http://127.0.0.1:8000/funnels/${id}`);
  return response.data;
};

const FunnelViewScreen = () => {
  const { id } = useParams<{ id: string }>();
  const { data: funnel, isLoading, error } = useQuery<Funnel>(
    ['funnel', id],
    () => fetchFunnel(id!),
    { enabled: !!id }
  );

  if (isLoading) return <div className="text-center py-8">Loading funnel...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading funnel</div>;
  if (!funnel) return <div className="text-center py-8">Funnel not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/funnel-requests" className="flex items-center text-blue-600 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Funnels
      </Link>

      <div className="glass-effect rounded-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{funnel.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            funnel.status === 'live' ? 'bg-green-100 text-green-800' :
            funnel.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {funnel.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Goal</h3>
              <p className="mt-1 text-gray-900">{funnel.goal}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Target Audience</h3>
              <p className="mt-1 text-gray-900">{funnel.target_audience}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Call to Action</h3>
              <p className="mt-1 text-gray-900">{funnel.cta}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              <p className="mt-1 text-gray-900 capitalize">{funnel.priority}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
              <p className="mt-1 text-gray-900">
                {new Date(funnel.deadline).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-gray-900">
                {new Date(funnel.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {funnel.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-line">{funnel.notes}</p>
          </div>
        )}

        {funnel.media && funnel.media.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {funnel.media.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.file_name.split('/').pop()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.file_path.split('.').pop()?.toUpperCase()} File
                    </p>
                  </div>
                  <a
                    href={`http://127.0.0.1:8000/storage/${file.file_path}`}
                    download
                    className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelViewScreen;