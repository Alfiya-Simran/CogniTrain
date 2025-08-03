import React from 'react';
import { Game } from '../types';
import { GAMES } from '../constants';
import GameCard from './GameCard';

interface DashboardProps {
  onStartGame: (game: Game) => void;
  childName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartGame, childName }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Welcome back, <span className="text-blue-600">{childName}</span>!</h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
          Choose a game below to start sharpening your mind!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GAMES.map((game, index) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onStartGame={onStartGame} 
            isComingSoon={index > 0} 
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
