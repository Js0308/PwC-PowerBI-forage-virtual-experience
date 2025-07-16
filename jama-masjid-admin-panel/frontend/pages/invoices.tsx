import Layout from '../components/Layout';

export default function Invoices() {
  return (
    <Layout title="Invoice Management">
      <div className="bg-white rounded-lg p-8 shadow-soft border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Invoice Management
          </h2>
          <p className="text-gray-600 mb-6">
            Generate and manage invoices for donors with PDF export functionality.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              This section will include invoice creation, tracking, and PDF generation features.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}