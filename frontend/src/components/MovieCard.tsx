import type { Entry } from '../services/api';

interface MovieCardProps {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ entry, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${entry.title}"?`)) {
      onDelete(entry.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-200 group hover:border-amber-300">
      {/* Poster Image with Title Overlay */}
      <div className="relative">
        {entry.posterUrl ? (
          <img
            src={entry.posterUrl}
            alt={`${entry.title} poster`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=No+Poster';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-3xl mb-2">🎬</div>
              <div className="text-sm font-medium">No Poster</div>
            </div>
          </div>
        )}
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900/90 to-transparent p-4">
          <h3 className="text-white font-bold text-lg truncate">{entry.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              entry.type === 'Movie' 
                ? 'bg-amber-500 text-white' 
                : 'bg-amber-600 text-white'
            }`}>
              {entry.type}
            </span>
            <span className="text-white text-sm bg-amber-700/80 px-2 py-1 rounded">
              {entry.yearTime}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
          <button
            onClick={() => onEdit(entry)}
            className="bg-white/90 hover:bg-white text-amber-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Director */}
        <div className="mb-3">
          <div className="flex items-center text-amber-700 mb-1">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-semibold">Director</span>
          </div>
          <p className="text-gray-800 ml-6 font-medium">{entry.director || 'Not specified'}</p>
        </div>

        {/* Budget & Duration */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="flex items-center text-amber-700 mb-1">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-sm font-semibold">Budget</span>
            </div>
            <p className="text-gray-700 ml-6 text-sm">{entry.budget || 'Not specified'}</p>
          </div>
          <div>
            <div className="flex items-center text-amber-700 mb-1">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold">Duration</span>
            </div>
            <p className="text-gray-700 ml-6 text-sm">{entry.duration || 'Not specified'}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-amber-700 border-t border-amber-100 pt-3">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-semibold mr-2">Location:</span>
          <span className="text-gray-700 text-sm">{entry.location || 'Not specified'}</span>
        </div>
      </div>
    </div>
  );
};