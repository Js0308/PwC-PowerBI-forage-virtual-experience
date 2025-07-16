import Layout from '../components/Layout';

export default function Receipts() {
  return (
    <Layout title="Receipt Management">
      <div className="bg-white rounded-lg p-8 shadow-soft border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Receipt Management
          </h2>
          <p className="text-gray-600 mb-6">
            Generate and track donation receipts with PDF export functionality.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              This section will include receipt creation, tracking, and PDF generation features.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}