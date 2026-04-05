import { useState, useEffect } from 'react';

function App() {
  const [appInfo, setAppInfo] = useState({ name: '', version: '' });

  useEffect(() => {
    // Get app info from Electron API
    if (window.electronAPI) {
      Promise.all([
        window.electronAPI.getAppName(),
        window.electronAPI.getAppVersion(),
      ]).then(([name, version]) => {
        setAppInfo({ name, version });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ☕ Coffee Shop Management System
          </h1>
          
          {appInfo.name && (
            <p className="text-gray-600 mb-2">
              App: {appInfo.name} v{appInfo.version}
            </p>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              🚀 Bắt đầu phát triển
            </h2>
            <p className="text-blue-700">
              Đây là template cơ bản. Bạn có thể bắt đầu phát triển UI từ đây.
            </p>
            <p className="text-blue-700 mt-2">
              Copy các components từ folder <code className="bg-blue-100 px-2 py-1 rounded">docs/UI_UX/src/components</code> 
              vào <code className="bg-blue-100 px-2 py-1 rounded">src/renderer/components</code>
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">✓ Electron</h3>
              <p className="text-sm text-green-700">Desktop app framework</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">✓ React + TS</h3>
              <p className="text-sm text-purple-700">Modern UI development</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900">✓ MySQL API</h3>
              <p className="text-sm text-orange-700">Database & REST API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
