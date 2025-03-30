import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Insurance Management System</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to your dashboard</h2>
          <p className="text-gray-600 mb-4">
            Manage your insurance policies and vehicle information in one place.
          </p>
          
          <div className="flex space-x-4 mb-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </button>
            
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Policies</h3>
            <p className="text-gray-600">View and manage your insurance policies</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Vehicles</h3>
            <p className="text-gray-600">Track your registered vehicles</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
