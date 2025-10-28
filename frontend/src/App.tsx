import { useState } from 'react';
import { EntriesTable } from './components/EntriesTable';
import { EntryForm } from './components/EntryForm';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { SearchBar } from './components/SearchBar';
import { useAuth } from './contexts/AuthContext';
import type { Entry } from './services/api';

type AuthMode = 'login' | 'register';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  const { user, logout, loading } = useAuth();

  const handleAddNew = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingEntry(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Loading your collection...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-25">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-amber-200/60 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg">
                <span className="text-white text-xl">🎬</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                  CineCollection
                </h1>
                <p className="text-sm text-amber-600/80">Your premium movie & TV show library</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-amber-600/80">Welcome back,</p>
                <p className="font-semibold text-amber-800">{user.name}</p>
              </div>
              <button
                onClick={logout}
                className="bg-white border border-amber-300 text-amber-700 px-4 py-2 rounded-xl hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Entry</span>
            </button>
            
            <div className="hidden sm:block text-sm text-amber-600/80 font-medium">
              {searchQuery ? 'Search results' : 'Your complete collection'}
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Content Container */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
          <EntriesTable 
            onEdit={handleEdit} 
            refreshTrigger={refreshTrigger}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Entry Form Modal */}
      {showForm && (
        <EntryForm
          entry={editingEntry}
          onSave={handleFormSave}
          onCancel={handleFormClose}
        />
      )}
    </div>
  );
}

export default App;