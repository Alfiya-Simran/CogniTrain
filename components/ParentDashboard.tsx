import React, { useState, useCallback } from 'react';
import { User, Session, Role } from '../types';
import { getHealthSuggestion } from '../services/geminiService';
import { UserCircleIcon, ChartBarIcon, AcademicCapIcon, LinkIcon, ChatBubbleLeftRightIcon } from './icons';

interface ParentDashboardProps {
  user: User;
  onViewProgress: (child: User) => void;
  onConnectTherapist: (child: User) => void;
  onContact: (user: User, childContext: User) => void;
  sessions: Session[];
  allUsers: User[];
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onViewProgress, onConnectTherapist, onContact, sessions, allUsers }) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChildForSuggestion, setSelectedChildForSuggestion] = useState<User | null>(null);

  const children = allUsers.filter(u => user.childIds?.includes(u.id));
  const therapists = allUsers.filter(u => u.role === Role.Therapist);

  const handleGetSuggestion = useCallback(async (child: User) => {
    const childSessions = sessions.filter(s => s.childId === child.id);
    setSelectedChildForSuggestion(child);
    setIsLoading(true);
    setError(null);
    setSuggestion('');
    try {
      const result = await getHealthSuggestion(childSessions);
      setSuggestion(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestion.');
    } finally {
      setIsLoading(false);
    }
  }, [sessions]);

  const ChildCard: React.FC<{child: User}> = ({ child }) => {
    const therapist = allUsers.find(u => u.id === child.therapistId);
    const isRequestPending = therapists.some(t => t.connectionRequests?.includes(child.id));

    const getTherapistConnectionStatus = () => {
      if (therapist) {
        return (
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onContact(therapist, child)}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-all"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2"/>
              Contact {therapist.name}
            </button>
            <div className="flex-1 text-sm text-center py-2 px-3 bg-green-50 text-green-700 rounded-md">
                Connected
            </div>
          </div>
        );
      }
      if (isRequestPending) {
        return (
           <div className="mt-4 text-sm text-center py-2 px-3 bg-yellow-50 text-yellow-800 rounded-md">
             Connection request pending...
          </div>
        )
      }
      return (
        <button
          onClick={() => onConnectTherapist(child)}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-slate-300 text-base font-medium rounded-md text-slate-600 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all"
        >
          <LinkIcon className="h-5 w-5 mr-2"/>
          Connect to a Therapist
        </button>
      );
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <UserCircleIcon className="h-16 w-16 text-blue-500"/>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">{child.name}</h3>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3">
            <button
                onClick={() => onViewProgress(child)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
                <ChartBarIcon className="h-5 w-5 mr-2"/>
                View Full Progress
            </button>
            <button
                onClick={() => handleGetSuggestion(child)}
                disabled={isLoading && selectedChildForSuggestion?.id === child.id}
                className="w-full px-4 py-2 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
            >
                {isLoading && selectedChildForSuggestion?.id === child.id ? 'Analyzing...' : 'Get AI Health Suggestion'}
            </button>
        </div>
        
        {getTherapistConnectionStatus()}

      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Parent Dashboard</h2>
        <p className="mt-2 text-lg text-slate-600">Welcome, {user.name}. Here's an overview of your family's progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {children.length > 0 ? children.map(child => <ChildCard key={child.id} child={child} />) : 
          <p className="text-slate-500">No children assigned to this account.</p>
        }
      </div>

      {(suggestion || error) && (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h3 className="text-xl font-bold mb-4 text-slate-800">AI Suggestion for {selectedChildForSuggestion?.name}</h3>
            {suggestion && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg whitespace-pre-wrap font-mono text-sm text-slate-700">
                    {suggestion}
                </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;