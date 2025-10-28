import React, { useState, useEffect } from 'react';
import type { Entry, CreateEntryData } from '../services/api';
import { apiService } from '../services/api';

interface EntryFormProps {
  entry?: Entry | null;
  onSave: () => void;
  onCancel: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ entry, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CreateEntryData>({
    title: '',
    type: 'Movie',
    director: '',
    budget: '',
    location: '',
    duration: '',
    yearTime: '',
    posterUrl: ''
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title,
        type: entry.type,
        director: entry.director,
        budget: entry.budget,
        location: entry.location,
        duration: entry.duration,
        yearTime: entry.yearTime,
        posterUrl: entry.posterUrl || ''
      });
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (entry) {
        await apiService.updateEntry(entry.id, formData);
      } else {
        await apiService.createEntry(formData);
      }
      onSave();
    } catch (error) {
      alert('Error saving entry: ' + (error as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-amber-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-amber-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white text-center">
            {entry ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          <p className="text-amber-100 text-center mt-1">
            {entry ? 'Update your movie details' : 'Add a new movie to your collection'}
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Title <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/50"
              placeholder="Enter movie title"
            />
          </div>

          {/* Type & Director in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Type <span className="text-amber-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/50"
              >
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Director <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/50"
                placeholder="Enter director name"
              />
            </div>
          </div>

          {/* Budget & Duration in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Budget
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/50"
                placeholder="Enter budget"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/50"
                placeholder="Enter duration"
              />
            </div>
          </div>

          {/* Poster URL */}
          <div>
            <label className="block text-sm font-semibold text-amber-800 mb-2">
              Poster URL
            </label>
            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleChange}
              className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/50"
              placeholder="https://example.com/poster.jpg"
            />
            {formData.posterUrl && (
              <div className="mt-3">
                <p className="text-sm font-medium text-amber-700 mb-2">Poster Preview:</p>
                <img
                  src={formData.posterUrl}
                  alt="Poster preview"
                  className="w-32 h-48 object-cover rounded-lg border-2 border-amber-300 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Location & Year/Time in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/50"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                Year/Time
              </label>
              <input
                type="text"
                name="yearTime"
                value={formData.yearTime}
                onChange={handleChange}
                className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/50"
                placeholder="Enter year or time period"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-amber-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-amber-700 bg-amber-100 border border-amber-300 rounded-xl hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-white bg-gradient-to-r from-amber-500 to-amber-600 border border-transparent rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 font-medium shadow-lg"
            >
              {entry ? 'Update Movie' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};