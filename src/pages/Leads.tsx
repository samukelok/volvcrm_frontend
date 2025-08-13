import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Mail, Trash2, ChevronLeft, ChevronRight, Frown, AlertCircle, Phone } from 'lucide-react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

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
}

const Leads = () => {
  const navigate = useNavigate();
  
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch all leads
  const { data: allLeads = [], isLoading, error, refetch } = useQuery<Lead[]>(
    'leads',
    async () => {
      const response = await axios.get('/leads');
      return response.data;
    }
  );

  // Delete single lead by ID
  const deleteLead = async (id: number) => {
    try {
      await axios.delete(`/leads/${id}`);
      refetch();
    }
    catch (err) {
      console.error('Error deleting lead:', err);
    }
  }

  // Export leads to CSV
  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get('/leads/export', {
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv',
          'Cache-Control': 'no-cache'
        },
        timeout: 300000 // 5 minutes timeout
      });

      // Check for error in blob
      if (response.data.type === 'application/json') {
        const errorData = JSON.parse(await response.data.text());
        throw new Error(errorData.message || 'Export failed');
      }

      // Create download link
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (error: any) {
      console.error('Export error:', error);

      let errorMessage = 'Export failed';
      if (error.response?.data) {
        try {
          const blobText = await error.response.data.text();
          const errorData = JSON.parse(blobText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = error.message || errorMessage;
        }
      }

      alert(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  // Format date for CSV export
  const formatExportDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Filter leads based on search and filters
  const filteredLeads = allLeads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? lead.status === statusFilter.toLowerCase() : true;
    const matchesSource = sourceFilter ? lead.source === sourceFilter : true;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Paginate the filtered results
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Get unique sources for filter dropdown
  const uniqueSources = Array.from(new Set(allLeads.map(lead => lead.source)));

  // Calculate total pages
  const totalPages = Math.ceil(filteredLeads.length / perPage);

  // Handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSourceFilter('');
    setCurrentPage(1);
  };

  // Status badge styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'converted': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Date formatting for UI
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500">
      <AlertCircle className="w-12 h-12 mx-auto mb-4" />
      <h3 className="text-lg font-medium">Error loading leads</h3>
      <p className="mt-2 text-gray-600">Please try again later</p>
      <button
        onClick={() => refetch()}
        className="mt-4 btn-primary inline-flex items-center"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-2 text-gray-600">Manage and track your leads from all funnels.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={isExporting || allLeads.length === 0}
          className={`mt-4 sm:mt-0 inline-flex items-center ${isExporting || allLeads.length === 0 ? 'btn-disabled' : 'btn-primary'}`}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Export Leads ({allLeads.length})
            </>
          )}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, or phone..."
              className="pl-10 input-field w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              className="input-field max-w-xs"
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Sources</option>
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
            <select
              className="input-field max-w-xs"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
            <button
              onClick={clearAllFilters}
              disabled={!searchTerm && !statusFilter && !sourceFilter}
              className={`inline-flex items-center ${!searchTerm && !statusFilter && !sourceFilter ? 'btn-disabled' : 'btn-secondary'}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-effect rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.niche_category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.source}</div>
                      <div className="text-sm text-gray-500">
                        Monthly Pays: ${lead.pays}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                          onClick={() => navigate(`/leads/${lead.id}`)}
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>

                        <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete lead: ${lead.name}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Frown className="w-16 h-16 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
                      <p className="text-gray-500 max-w-md text-center">
                        {allLeads.length === 0
                          ? 'You currently have no leads in your system'
                          : searchTerm || statusFilter || sourceFilter
                            ? 'No leads match your current filters'
                            : 'No leads available'}
                      </p>
                      {(searchTerm || statusFilter || sourceFilter) && (
                        <button
                          onClick={clearAllFilters}
                          className="mt-4 btn-secondary inline-flex items-center"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredLeads.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Leads per page:</span>
            <select
              className="input-field max-w-xs"
              value={perPage}
              onChange={handlePerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-500">
              Showing {((currentPage - 1) * perPage) + 1}-
              {Math.min(currentPage * perPage, filteredLeads.length)} of {filteredLeads.length} leads
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn-secondary px-4 py-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn-secondary px-4 py-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || filteredLeads.length === 0}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;