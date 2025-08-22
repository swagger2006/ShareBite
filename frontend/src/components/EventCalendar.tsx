import React, { useState } from 'react';
import { Calendar, Users, MapPin, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { CampusEvent } from '../types';
import { formatDate, generateId } from '../utils/helpers';

interface EventCalendarProps {
  events: CampusEvent[];
  onAddEvent: (event: CampusEvent) => void;
  onLogFood: (eventId: string) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ 
  events, 
  onAddEvent, 
  onLogFood 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    estimatedAttendees: 50,
    organizer: '',
    hasFood: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: CampusEvent = {
      id: generateId(),
      title: formData.title,
      date: new Date(formData.date),
      location: formData.location,
      estimatedAttendees: formData.estimatedAttendees,
      organizer: formData.organizer,
      hasFood: formData.hasFood,
      foodLogged: false,
    };

    onAddEvent(newEvent);
    setShowAddForm(false);
    setFormData({
      title: '',
      date: '',
      location: '',
      estimatedAttendees: 50,
      organizer: '',
      hasFood: true,
    });
  };

  const upcomingEvents = events.filter(event => event.date > new Date());
  const pastEvents = events.filter(event => event.date <= new Date());
  const needsFoodLogging = events.filter(event => 
    event.hasFood && !event.foodLogged && event.date <= new Date()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events</h1>
          <p className="text-gray-600">Track events and manage food surplus</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Food Logging Reminders */}
      {needsFoodLogging.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Food Logging Reminders
              </h3>
              <p className="text-yellow-800 mb-4">
                The following events need food surplus logging:
              </p>
              <div className="space-y-2">
                {needsFoodLogging.map(event => (
                  <div key={event.id} className="flex justify-between items-center bg-yellow-100 p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">{event.title}</p>
                      <p className="text-sm text-yellow-700">
                        {formatDate(event.date)} • {event.location}
                      </p>
                    </div>
                    <button
                      onClick={() => onLogFood(event.id)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      Log Food
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    {event.hasFood && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Has Food
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {event.estimatedAttendees} attendees
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3">
                    Organized by {event.organizer}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Past Events</h2>
          <div className="space-y-4">
            {pastEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No past events</p>
              </div>
            ) : (
              pastEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex space-x-2">
                      {event.hasFood && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Had Food
                        </span>
                      )}
                      {event.foodLogged && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs">Logged</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {event.estimatedAttendees} attendees
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3">
                    Organized by {event.organizer}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Event Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Campus Event</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Tech Symposium 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Main Auditorium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Attendees
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedAttendees}
                      onChange={(e) => setFormData({...formData, estimatedAttendees: Number(e.target.value)})}
                      min="1"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hasFood}
                        onChange={(e) => setFormData({...formData, hasFood: e.target.checked})}
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Will serve food</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Computer Science Department"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;