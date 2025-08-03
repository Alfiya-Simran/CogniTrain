import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onStartGame: (game: Game) => void;
  isComingSoon?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onStartGame, isComingSoon }) => {
  const handlePlay = () => {
    if (!isComingSoon) {
      onStartGame(game);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col ${isComingSoon ? 'opacity-60' : ''}`}>
      <div className="p-6 flex-grow flex flex-col text-center">
        <div className="mx-auto mb-4">{game.icon}</div>
        <h3 className="text-xl font-bold text-slate-800">{game.title}</h3>
        <p className="mt-2 text-slate-600 flex-grow">{game.description}</p>
      </div>
      <div className="p-6 bg-slate-50">
        <button
          onClick={handlePlay}
          disabled={isComingSoon}
          className={`w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors duration-200 ${
            isComingSoon
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isComingSoon ? 'Coming Soon' : 'Play Now'}
        </button>
      </div>
    </div>
  );
};

export default GameCard;
