import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Download,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { donorsApi, googleSheetsApi, formatCurrency, formatDate } from '../lib/api';
import { CreateDonorData, Donor } from '../types';

interface DonorFormData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  area: 'Masjid Chawl' | 'Phugewadi' | 'Wakhare Chawl' | 'Sanjay Nagar' | 'Outside';
  notes?: string;
}

interface CreateDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor?: Donor;
}

function CreateDonorModal({ isOpen, onClose, donor }: CreateDonorModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DonorFormData>({
    defaultValues: donor ? {
      firstName: donor.firstName,
      lastName: donor.lastName,
      mobileNumber: donor.mobileNumber,
      area: donor.area,
      notes: donor.notes || '',
    } : undefined,
  });

  const createMutation = useMutation(donorsApi.create, {
    onSuccess: () => {
      toast.success('Donor created successfully!');
      queryClient.invalidateQueries('donors');
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create donor');
    },
  });

  const updateMutation = useMutation(
    (data: { id: string; data: Partial<CreateDonorData> }) =>
      donorsApi.update(data.id, data.data),
    {
      onSuccess: () => {
        toast.success('Donor updated successfully!');
        queryClient.invalidateQueries('donors');
        onClose();
        reset();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update donor');
      },
    }
  );

  const onSubmit = (data: DonorFormData) => {
    if (donor) {
      updateMutation.mutate({ id: donor._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal max-w-md"
      >
        <div className="modal-header">
          <h3 className="modal-title">
            {donor ? 'Edit Donor' : 'Create New Donor'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                className={`input ${errors.firstName ? 'input-error' : ''}`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="error-message">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className={`input ${errors.lastName ? 'input-error' : ''}`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="error-message">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Mobile Number</label>
            <input
              {...register('mobileNumber', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Mobile number must be exactly 10 digits',
                },
              })}
              className={`input ${errors.mobileNumber ? 'input-error' : ''}`}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {errors.mobileNumber && (
              <p className="error-message">{errors.mobileNumber.message}</p>
            )}
          </div>

          <div>
            <label className="label">Area</label>
            <select
              {...register('area', { required: 'Area is required' })}
              className={`input ${errors.area ? 'input-error' : ''}`}
            >
              <option value="">Select area</option>
              <option value="Masjid Chawl">Masjid Chawl</option>
              <option value="Phugewadi">Phugewadi</option>
              <option value="Wakhare Chawl">Wakhare Chawl</option>
              <option value="Sanjay Nagar">Sanjay Nagar</option>
              <option value="Outside">Outside</option>
            </select>
            {errors.area && (
              <p className="error-message">{errors.area.message}</p>
            )}
          </div>

          <div>
            <label className="label">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              className="input"
              placeholder="Additional notes about the donor"
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isLoading || updateMutation.isLoading}
              className="btn-primary"
            >
              {createMutation.isLoading || updateMutation.isLoading ? (
                <div className="loading" />
              ) : (
                donor ? 'Update Donor' : 'Create Donor'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Donors() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'mobile' | 'name'>('mobile');
  const [selectedArea, setSelectedArea] = useState('');

  const queryClient = useQueryClient();

  const { data: donorsData, isLoading } = useQuery(
    ['donors', searchTerm, selectedArea],
    () => donorsApi.getAll({ 
      search: searchTerm, 
      area: selectedArea,
      limit: 50
    }),
    {
      keepPreviousData: true,
    }
  );

  const deleteMutation = useMutation(donorsApi.delete, {
    onSuccess: () => {
      toast.success('Donor deleted successfully!');
      queryClient.invalidateQueries('donors');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete donor');
    },
  });

  const importMutation = useMutation(googleSheetsApi.importData, {
    onSuccess: (data) => {
      toast.success(`Import completed! ${data.imported} donors imported, ${data.skipped} skipped`);
      queryClient.invalidateQueries('donors');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to import data');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImport = () => {
    if (window.confirm('This will import donors from Google Sheets. Continue?')) {
      importMutation.mutate();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically by the query
  };

  const filteredDonors = donorsData?.data || [];

  return (
    <Layout title="Master Data - Donors">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleImport}
              disabled={importMutation.isLoading}
              className="btn-outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importMutation.isLoading ? 'Importing...' : 'Import from Sheets'}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Donor
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Search Type</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'mobile' | 'name')}
                  className="input"
                >
                  <option value="mobile">Mobile Number</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div>
                <label className="label">
                  {searchType === 'mobile' ? 'Mobile Number' : 'Name'}
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                  placeholder={
                    searchType === 'mobile' 
                      ? 'Enter 10-digit mobile number' 
                      : 'Enter first or last name'
                  }
                />
              </div>

              <div>
                <label className="label">Area</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="input"
                >
                  <option value="">All Areas</option>
                  <option value="Masjid Chawl">Masjid Chawl</option>
                  <option value="Phugewadi">Phugewadi</option>
                  <option value="Wakhare Chawl">Wakhare Chawl</option>
                  <option value="Sanjay Nagar">Sanjay Nagar</option>
                  <option value="Outside">Outside</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedArea('');
                  }}
                  className="btn-secondary w-full"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Donors Table */}
        <div className="bg-white rounded-lg shadow-soft border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Donors ({filteredDonors.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="loading-lg" />
            </div>
          ) : filteredDonors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No donors found. Try adjusting your search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Name</th>
                    <th className="table-header-cell">Mobile</th>
                    <th className="table-header-cell">Area</th>
                    <th className="table-header-cell">Total Donations</th>
                    <th className="table-header-cell">Last Donation</th>
                    <th className="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredDonors.map((donor) => (
                    <tr key={donor._id} className="table-row">
                      <td className="table-cell">
                        <div className="font-medium text-gray-900">
                          {donor.firstName} {donor.lastName}
                        </div>
                        {donor.notes && (
                          <div className="text-sm text-gray-500">
                            {donor.notes}
                          </div>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          {donor.mobileNumber}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          {donor.area}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          {formatCurrency(donor.totalDonations)}
                        </div>
                      </td>
                      <td className="table-cell">
                        {donor.lastDonationDate ? (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {formatDate(donor.lastDonationDate)}
                          </div>
                        ) : (
                          <span className="text-gray-500">Never</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingDonor(donor)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(donor._id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={deleteMutation.isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Donor Modal */}
      <CreateDonorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Donor Modal */}
      {editingDonor && (
        <CreateDonorModal
          isOpen={true}
          onClose={() => setEditingDonor(null)}
          donor={editingDonor}
        />
      )}
    </Layout>
  );
}