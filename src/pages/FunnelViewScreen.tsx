import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Download, Trash2, Edit } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import CreateFunnelRequest from './CreateFunnelRequest';

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
  requested_by: string;
  preview_link: string;
  media?: Array<{
    id: number;
    file_path: string;
    file_name: string;
  }>;
}

const fetchFunnel = async (id: string): Promise<Funnel> => {
  const response = await axios.get(`/funnels/${id}`);
  return response.data;
};

const FunnelViewScreen = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: funnel, isLoading, error } = useQuery<Funnel>(
    ['funnel', id],
    () => fetchFunnel(id!),
    { enabled: !!id }
  );

  const deleteMutation = useMutation(
    (reason: string) => axios.delete(`/funnels/${id}`, { data: { reason } }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['funnels']);
        navigate('/funnel-requests');
      }
    }
  );

  const handleDelete = () => {
    if (!deleteReason.trim()) {
      alert('Please provide a reason for deletion');
      return;
    }
    deleteMutation.mutate(deleteReason);
  };

  if (isLoading) return <div className="text-center py-8">Loading funnel...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Funnel Not Found</div>;
  if (!funnel) return <div className="text-center py-8">Funnel not found</div>;

  if (isEditing) {
    return <CreateFunnelRequest editData={funnel} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
            <Dialog.Title className="text-lg font-bold">Delete Funnel</Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600">
              Please provide a reason for deleting this funnel. This will help us improve our services.
            </Dialog.Description>

            <textarea
              className="mt-4 w-full p-2 border rounded-md"
              rows={3}
              placeholder="Reason for deletion..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex justify-between items-center mb-6">
        <Link to="/funnel-requests" className="flex items-center text-blue-600">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Funnels
        </Link>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{funnel.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${funnel.status === 'live' ? 'bg-green-100 text-green-800' :
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

            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <p className="mt-1 text-gray-900">{funnel.requested_by}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Preview Link</h3>
              <p className="mt-1 text-gray-900">
                {funnel.preview_link ? (
                  <a href={funnel.preview_link} target="_blank" rel="noopener noreferrer">
                    {funnel.preview_link}
                  </a>
                ) : (
                  'Preview pending. We’ll notify you by email.'
                )}
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
                    href={`/storage/${file.file_path}`}
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