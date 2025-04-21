import './App.css'
import EmployeeTable from './components/EmployeeTable'
import dummyData from './data/dummyData'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl w-full  mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">My App</h1>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl w-full mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <EmployeeTable data={dummyData} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              © 2024 My App. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
