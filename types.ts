import React from 'react';

export enum Role {
  Child = 'CHILD',
  Parent = 'PARENT',
  Therapist = 'THERAPIST',
}

export enum View {
  Login = 'LOGIN',
  ChildDashboard = 'CHILD_DASHBOARD',
  ParentDashboard = 'PARENT_DASHBOARD',
  TherapistDashboard = 'THERAPIST_DASHBOARD',
  Game = 'GAME',
  Progress = 'PROGRESS',
  ConnectTherapist = 'CONNECT_THERAPIST',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  password?: string; // Added for login
  childIds?: string[]; // For Parent
  patientIds?: string[]; // For Therapist
  therapistId?: string | null; // For Parent/Child
  connectionRequests?: string[]; // For Therapist, contains childIds
}


export enum GameType {
  Memory = 'Memory',
  Attention = 'Attention',
  Logic = 'Logic',
}

export interface Game {
  id: string;
  type: GameType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Session {
  childId: string;
  date: string; // ISO string
  gameType: GameType;
  score: number;
  accuracy: number; // percentage
  duration: number; // in seconds
}

export interface MemoryCard {
  id: number;
  pairId: number;
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryPair {
  item1: string;
  item2: string;
}

// Types for Live Chat
export interface Message {
  senderId: string;
  text: string;
  timestamp: number;
}

export type ChatHistory = Record<string, Message[]>;
