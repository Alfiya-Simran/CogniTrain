import React from 'react';
import { User } from '../types';
import { BrainIcon, LogoutIcon, UserCircleIcon, HomeIcon } from './icons';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onGoToDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onGoToDashboard }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <BrainIcon className="h-10 w-10 text-blue-600" />
            <h1 className="ml-3 text-2xl sm:text-3xl font-bold text-slate-800">
              Cogni<span className="text-blue-600">Train</span>
            </h1>
            {currentUser && (
               <button
                onClick={onGoToDashboard}
                className="ml-6 flex items-center px-3 py-2 rounded-md text-sm sm:text-base font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                title="Go to Dashboard"
              >
                <HomeIcon className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Dashboard</span>
              </button>
            )}
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            {currentUser && (
              <>
                 <span className="flex items-center text-slate-500">
                  <UserCircleIcon className="h-6 w-6 mr-2 text-slate-400"/>
                  <span className="hidden sm:inline">{currentUser.name}</span>
                 </span>
                <button
                  onClick={onLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm sm:text-base font-medium text-red-500 hover:bg-red-100 transition-colors"
                  title="Logout"
                >
                  <LogoutIcon className="h-5 w-5" />
                   <span className="ml-2 hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;