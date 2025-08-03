import React, { useState, useCallback } from 'react';
import { Session, GameType, User } from '../types';
import ProgressChart from './ProgressChart';
import { summarizeProgress } from '../services/geminiService';
import { ArrowLeftIcon } from './icons';

interface ProgressViewProps {
  sessions: Session[];
  child: User;
  onBack: () => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ sessions, child, onBack }) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = useCallback(async () => {
    if (sessions.length === 0) {
        setSummary("Not enough data to generate a summary. Play some games first!");
        return;
    }
    setIsLoading(true);
    setError(null);
    setSummary('');
    try {
      const result = await summarizeProgress(sessions);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary.');
    } finally {
      setIsLoading(false);
    }
  }, [sessions]);

  const memorySessions = sessions.filter(s => s.gameType === GameType.Memory);
  const attentionSessions = sessions.filter(s => s.gameType === GameType.Attention);
  const logicSessions = sessions.filter(s => s.gameType === GameType.Logic);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative">
         <button onClick={onBack} className="absolute -left-12 top-1 flex items-center text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeftIcon className="h-6 w-6"/>
         </button>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Progress Report for <span className="text-blue-600">{child.name}</span></h2>
        <p className="mt-2 text-lg text-slate-600">
          Track performance and see improvements over time.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-slate-800">AI Progress Summary</h3>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading || sessions.length === 0}
          className="px-6 py-2 mb-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Generate AI Summary'}
        </button>
        {summary && (
           <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg whitespace-pre-wrap font-mono text-sm text-slate-700">
            {summary}
          </div>
        )}
         {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProgressChart title="Memory Game Score" data={memorySessions} dataKey="score" color="#3b82f6" />
        <ProgressChart title="Memory Game Accuracy" data={memorySessions} dataKey="accuracy" color="#10b981" unit="%" />
        <ProgressChart title="Attention Game Score" data={attentionSessions} dataKey="score" color="#8b5cf6" />
        <ProgressChart title="Logic Game Score" data={logicSessions} dataKey="score" color="#f59e0b" />
      </div>
    </div>
  );
};

export default ProgressView;