import React from 'react';
import { User } from '../types';
import { AcademicCapIcon, ArrowLeftIcon } from './icons';

interface ConnectTherapistViewProps {
  therapists: User[];
  child: User;
  onSendRequest: (therapist: User, child: User) => void;
  onBack: () => void;
}

const ConnectTherapistView: React.FC<ConnectTherapistViewProps> = ({ therapists, child, onSendRequest, onBack }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="relative">
         <button onClick={onBack} className="absolute -left-12 top-1 flex items-center text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeftIcon className="h-6 w-6"/>
         </button>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Connect with a Therapist</h2>
        <p className="mt-2 text-lg text-slate-600">
          Select a therapist to send a connection request for <span className="font-bold text-blue-600">{child.name}</span>.
        </p>
        <p className="mt-1 text-sm text-slate-500">
            By connecting, you agree to share your child's progress reports with the therapist.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ul role="list" className="divide-y divide-slate-200">
          {therapists.length > 0 ? therapists.map((therapist) => (
            <li key={therapist.id}>
              <div className="block hover:bg-slate-50 transition-colors">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      <AcademicCapIcon className="h-12 w-12 text-purple-500" />
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                        <p className="text-lg font-bold text-purple-600 truncate">{therapist.name}</p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => onSendRequest(therapist, child)}
                      className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Send Request
                    </button>
                  </div>
                </div>
              </div>
            </li>
          )) : (
            <li className="px-6 py-8 text-center text-slate-500">
              No therapists available at this time.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ConnectTherapistView;
