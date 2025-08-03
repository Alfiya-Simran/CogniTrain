import React from 'react';
import { Game, GameType, User, Role, Session, ChatHistory } from './types';
import { BrainIcon, EyeIcon, LightbulbIcon } from './components/icons';

export const GAMES: Game[] = [
  {
    id: 'memory-match',
    type: GameType.Memory,
    title: 'Memory Match',
    description: 'Find all the matching pairs of cards. A fun way to boost your memory!',
    icon: <BrainIcon className="h-12 w-12 text-blue-500" />,
  },
  {
    id: 'attention-tracker',
    type: GameType.Attention,
    title: 'Attention Tracker',
    description: 'Follow the glowing light and test your focus. (Coming Soon)',
    icon: <EyeIcon className="h-12 w-12 text-green-500" />,
  },
  {
    id: 'logic-puzzles',
    type: GameType.Logic,
    title: 'Logic Puzzles',
    description: 'Solve fun puzzles and sharpen your reasoning skills. (Coming Soon)',
    icon: <LightbulbIcon className="h-12 w-12 text-yellow-500" />,
  },
];

// NOTE: User IDs are used as usernames for login.
export const ALL_USERS: User[] = [
  { id: 'alex', name: 'Alex', role: Role.Child, password: 'password', therapistId: 'dr.miller' },
  { id: 'sarah', name: 'Sarah (Parent)', role: Role.Parent, password: 'password', childIds: ['alex'] },
  { id: 'dr.miller', name: 'Dr. Miller', role: Role.Therapist, password: 'password', patientIds: ['alex'], connectionRequests: [] },
  { id: 'dr.carter', name: 'Dr. Carter', role: Role.Therapist, password: 'password', patientIds: [], connectionRequests: [] },
];

export const MOCK_SESSIONS: Session[] = [
    { childId: 'alex', date: new Date(Date.now() - 5 * 86400000).toISOString(), gameType: GameType.Memory, score: 1200, accuracy: 80, duration: 180 },
    { childId: 'alex', date: new Date(Date.now() - 4 * 86400000).toISOString(), gameType: GameType.Memory, score: 1500, accuracy: 85, duration: 165 },
    { childId: 'alex', date: new Date(Date.now() - 3 * 86400000).toISOString(), gameType: GameType.Logic, score: 2000, accuracy: 90, duration: 240 },
    { childId: 'alex', date: new Date(Date.now() - 2 * 86400000).toISOString(), gameType: GameType.Memory, score: 1800, accuracy: 95, duration: 150 },
    { childId: 'alex', date: new Date(Date.now() - 1 * 86400000).toISOString(), gameType: GameType.Attention, score: 2500, accuracy: 92, duration: 200 },
];

export const MOCK_CHAT_HISTORY: ChatHistory = {
  'dr.miller_sarah': [
    { senderId: 'sarah', text: "Hello! I wanted to check in on Alex's progress this week.", timestamp: Date.now() - 20000 },
    { senderId: 'dr.miller', text: "Hi Sarah! Of course. The data shows some great improvement in the Memory Match game.", timestamp: Date.now() - 10000 },
  ]
};
