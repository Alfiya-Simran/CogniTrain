import React from 'react';
import { User, Role } from '../types';
import { UserCircleIcon, ChartBarIcon, CheckIcon, XIcon, ChatBubbleLeftRightIcon } from './icons';

interface TherapistDashboardProps {
  user: User;
  onViewProgress: (child: User) => void;
  onUpdateRequest: (therapist: User, childId: string, accepted: boolean) => void;
  onContact: (user: User, childContext: User) => void;
  allUsers: User[];
}

const TherapistDashboard: React.FC<TherapistDashboardProps> = ({ user, onViewProgress, onUpdateRequest, onContact, allUsers }) => {
  const patients = allUsers.filter(u => user.patientIds?.includes(u.id));
  const connectionRequests = (user.connectionRequests || [])
    .map(childId => allUsers.find(u => u.id === childId))
    .filter((u): u is User => !!u);

  const ConnectionRequestCard: React.FC<{child: User}> = ({ child }) => (
     <li className="px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
            <UserCircleIcon className="h-10 w-10 text-slate-500" />
            <div className="ml-4">
                <p className="text-md font-bold text-slate-800">{child.name}</p>
                <p className="text-sm text-slate-500">Wants to connect with you.</p>
            </div>
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={() => onUpdateRequest(user, child.id, true)}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                title="Accept"
            >
                <CheckIcon className="h-5 w-5" />
            </button>
            <button
                 onClick={() => onUpdateRequest(user, child.id, false)}
                 className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                 title="Decline"
            >
                <XIcon className="h-5 w-5" />
            </button>
        </div>
     </li>
  );
  
  const PatientCard: React.FC<{patient: User}> = ({ patient }) => {
    const parent = allUsers.find(u => u.role === Role.Parent && u.childIds?.includes(patient.id));
    return (
        <li className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <UserCircleIcon className="h-10 w-10 text-blue-500" />
                    <div className="ml-4">
                        <p className="text-md font-bold text-blue-600">{patient.name}</p>
                        {parent && <p className="text-sm text-slate-500">Parent: {parent.name}</p>}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {parent && (
                        <button
                          onClick={() => onContact(parent, patient)}
                          className="p-2 rounded-md bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Contact Parent"
                        >
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        </button>
                    )}
                    <button
                        onClick={() => onViewProgress(patient)}
                        className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        title="View Report"
                    >
                        <ChartBarIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </li>
    );
  }


  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Therapist Dashboard</h2>
        <p className="mt-2 text-lg text-slate-600">Welcome, {user.name}. Here are your patients and connection requests.</p>
      </div>
      
      {connectionRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg">
             <h3 className="text-xl font-bold p-4 sm:p-6 border-b border-slate-200">Connection Requests</h3>
             <ul role="list" className="divide-y divide-slate-200">
                {connectionRequests.map(child => <ConnectionRequestCard key={child.id} child={child} />)}
             </ul>
          </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <h3 className="text-xl font-bold p-4 sm:p-6 border-b border-slate-200">My Patients</h3>
        {patients.length > 0 ? (
            <ul role="list" className="divide-y divide-slate-200">
                {patients.map((patient) => <PatientCard key={patient.id} patient={patient} />)}
            </ul>
        ) : (
            <div className="px-6 py-8 text-center text-slate-500">
                You have no patients assigned.
            </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;