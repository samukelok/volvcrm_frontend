import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Trash2, Edit, Mail, Phone } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  niche_category: string;
  pays: string;
  source: string;
  status: string;
  created_at: string;
  notes?: string;
}

const fetchLead = async (id: string): Promise<Lead> => {
  const response = await axios.get(`/leads/${id}`);
  return response.data;
};

const LeadViewScreen = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  const { data: lead, isLoading, error } = useQuery<Lead>(
    ['lead', id],
    () => fetchLead(id!),
    { enabled: !!id }
  );

  const deleteMutation = useMutation(
    () => axios.delete(`/leads/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['leads']);
        navigate('/leads');
      }
    }
  );

  const updateMutation = useMutation(
    (updatedData: Partial<Lead>) => axios.put(`/leads/${id}`, updatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['lead', id]);
        setIsEditing(false);
      }
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleEditSave = () => {
    updateMutation.mutate(editForm);
  };

  if (isLoading) return <div className="text-center py-8">Loading lead...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Lead Not Found</div>;
  if (!lead) return <div className="text-center py-8">Lead not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Delete Confirmation */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
            <Dialog.Title className="text-lg font-bold">Delete Lead</Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600">
              Are you sure you want to delete <strong>{lead.name}</strong>? This action cannot be undone.
            </Dialog.Description>

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

      {/* Edit Modal */}
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6">
            <Dialog.Title className="text-lg font-bold">Edit Lead</Dialog.Title>

            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="input-field w-full"
                defaultValue={lead.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="input-field w-full"
                defaultValue={lead.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone"
                className="input-field w-full"
                defaultValue={lead.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Source"
                disabled
                className="input-field w-full"
                defaultValue={lead.source}
              />
              <input
                type="text"
                placeholder="Lead Value"
                className="input-field w-full"
                defaultValue={lead.pays}
                onChange={(e) => setEditForm({ ...editForm, pays: e.target.value })}
              />
              <select
                className="input-field w-full"
                defaultValue={lead.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/leads" className="flex items-center text-blue-600">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Leads
        </Link>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditForm(lead);
              setIsEditing(true);
            }}
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

      {/* Lead Details */}
      <div className="glass-effect rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{lead.name}</h1>

        <div className="space-y-4">
          <div className="flex items-center text-gray-900">
            <Mail className="w-5 h-5 mr-2 text-gray-500" />
            {lead.email}
          </div>
          <div className="flex items-center text-gray-900">
            <Phone className="w-5 h-5 mr-2 text-gray-500" />
            {lead.phone}
          </div>
          <p><strong>Source:</strong> {lead.source}</p>
          <p><strong>Lead Value:</strong> ${lead.pays}</p>
          <p><strong>Status:</strong> {lead.status}</p>
          <p><strong>Created:</strong> {new Date(lead.created_at).toLocaleDateString()}</p>
          {lead.notes && (
            <div>
              <strong>Notes:</strong>
              <p className="whitespace-pre-line">{lead.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadViewScreen;
