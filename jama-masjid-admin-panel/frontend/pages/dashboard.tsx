import React from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  CreditCard,
} from 'lucide-react';
import Layout from '../components/Layout';
import { dashboardApi, formatCurrency } from '../lib/api';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<any>;
  color: string;
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-6 shadow-soft border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              {change.type === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

interface RecentDonation {
  _id: string;
  amount: number;
  donor: {
    firstName: string;
    lastName: string;
    area: string;
  };
  paymentDate: string;
  paymentMethod: string;
}

function RecentDonations({ donations }: { donations: RecentDonation[] }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Donations
      </h3>
      <div className="space-y-3">
        {donations.map((donation) => (
          <div
            key={donation._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {donation.donor.firstName} {donation.donor.lastName}
                </p>
                <p className="text-xs text-gray-500">{donation.donor.area}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(donation.amount)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(donation.paymentDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonationsByArea {
  _id: string;
  total: number;
  count: number;
}

function DonationsByArea({ data }: { data: DonationsByArea[] }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Donations by Area
      </h3>
      <div className="space-y-3">
        {data.map((area) => (
          <div key={area._id} className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900">
                {area._id}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(area.total)}
              </p>
              <p className="text-xs text-gray-500">{area.count} donations</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboard-stats',
    dashboardApi.getQuickStats
  );

  const { data: analytics, isLoading: analyticsLoading } = useQuery(
    'dashboard-analytics',
    dashboardApi.getAnalytics
  );

  if (statsLoading || analyticsLoading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Donors"
            value={stats?.totalDonors || 0}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Donations"
            value={formatCurrency(stats?.totalDonationCollection || 0)}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats?.totalExpenses || 0)}
            icon={TrendingDown}
            color="bg-red-500"
          />
          <StatCard
            title="Net Balance"
            value={formatCurrency(stats?.netBalance || 0)}
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="This Month Donations"
            value={formatCurrency(stats?.thisMonthDonations || 0)}
            icon={Calendar}
            color="bg-indigo-500"
          />
          <StatCard
            title="This Month Expenses"
            value={formatCurrency(stats?.thisMonthExpenses || 0)}
            icon={Calendar}
            color="bg-yellow-500"
          />
        </div>

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <RecentDonations donations={analytics?.recentDonations || []} />

          {/* Donations by Area */}
          <DonationsByArea data={analytics?.donationsByArea || []} />
        </div>

        {/* Top Donors */}
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Donors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics?.topDonors?.map((donor, index) => (
              <div
                key={donor._id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {donor.firstName} {donor.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{donor.area}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(donor.totalDonations)}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics?.paymentMethodStats?.map((method) => (
              <div
                key={method._id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {method._id.charAt(0).toUpperCase() + method._id.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(method.total)} ({method.count} payments)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}