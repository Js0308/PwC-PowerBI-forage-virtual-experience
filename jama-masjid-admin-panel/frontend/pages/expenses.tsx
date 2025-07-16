import Layout from '../components/Layout';

export default function Expenses() {
  return (
    <Layout title="Expense Management">
      <div className="bg-white rounded-lg p-8 shadow-soft border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Expense Management
          </h2>
          <p className="text-gray-600 mb-6">
            Track and manage masjid-related expenses in a table format.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              This section will include expense tracking, categorization, and reporting features.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}