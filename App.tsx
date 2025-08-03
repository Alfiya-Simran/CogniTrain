import React, { useState, useCallback } from 'react';
import { View, Game, Session, User, Role, Message, ChatHistory } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import GameView from './components/GameView';
import ProgressView from './components/ProgressView';
import LoginView from './components/LoginView';
import ParentDashboard from './components/ParentDashboard';
import TherapistDashboard from './components/TherapistDashboard';
import ConnectTherapistView from './components/ConnectTherapistView';
import ContactModal from './components/ContactModal';
import { MOCK_SESSIONS, ALL_USERS as INITIAL_USERS, MOCK_CHAT_HISTORY } from './constants';
import { generateChatResponse, isApiConfigured } from './services/geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>(View.Login);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [viewingChild, setViewingChild] = useState<User | null>(null);

  // Chat State
  const [contactModalInfo, setContactModalInfo] = useState<{isOpen: boolean; user: User | null; childContext?: User | null}>({isOpen: false, user: null, childContext: null});
  const [chatHistory, setChatHistory] = useState<ChatHistory>(MOCK_CHAT_HISTORY);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);


  const handleLogin = useCallback((credentials: { id: string; password?: string }): boolean => {
    const user = users.find(u => u.id.toLowerCase() === credentials.id.toLowerCase());
    if (user && user.password === credentials.password) {
      setCurrentUser(user);
      switch (user.role) {
        case Role.Child:
          setView(View.ChildDashboard);
          break;
        case Role.Parent:
          setView(View.ParentDashboard);
          break;
        case Role.Therapist:
          setView(View.TherapistDashboard);
          break;
        default:
          setView(View.Login);
      }
      return true;
    }
    return false;
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setViewingChild(null);
    setActiveGame(null);
    setView(View.Login);
  }, []);
  
  const handleNavigateToConnectTherapist = useCallback((child: User) => {
    setViewingChild(child);
    setView(View.ConnectTherapist);
  }, []);
  
  const handleSendConnectionRequest = useCallback((therapist: User, child: User) => {
    setUsers(currentUsers => currentUsers.map(u => {
      if (u.id === therapist.id) {
        return {
          ...u,
          connectionRequests: [...(u.connectionRequests || []), child.id]
        };
      }
      return u;
    }));
    setView(View.ParentDashboard);
  }, []);
  
  const handleConnectionRequest = useCallback((therapist: User, childId: string, accepted: boolean) => {
    setUsers(currentUsers => {
        const newUsers = JSON.parse(JSON.stringify(currentUsers));
        
        const therapistIndex = newUsers.findIndex((u: User) => u.id === therapist.id);
        const childIndex = newUsers.findIndex((u: User) => u.id === childId);
        const parentIndex = newUsers.findIndex((u: User) => u.role === Role.Parent && u.childIds?.includes(childId));

        if (therapistIndex === -1 || childIndex === -1) return currentUsers;

        newUsers[therapistIndex].connectionRequests = (newUsers[therapistIndex].connectionRequests || []).filter((id:string) => id !== childId);

        if (accepted) {
            newUsers[therapistIndex].patientIds = [...(newUsers[therapistIndex].patientIds || []), childId];
            if(parentIndex !== -1) {
              const childInParentIndex = (newUsers[parentIndex].childIds || []).findIndex((id: string) => id === childId);
               if(childInParentIndex !== -1) {
                 const childToUpdate = newUsers.find((u: User) => u.id === childId);
                 if(childToUpdate) childToUpdate.therapistId = therapist.id;
               }
            }
             const childToUpdateIdx = newUsers.findIndex((u: User) => u.id === childId);
             if(childToUpdateIdx !== -1) newUsers[childToUpdateIdx].therapistId = therapist.id;
        }
        
        return newUsers;
    });
  }, []);


  const startGame = useCallback((game: Game) => {
    setActiveGame(game);
    setView(View.Game);
  }, []);

  const endGame = useCallback((session: Omit<Session, 'date' | 'childId'> | null) => {
    if (session && currentUser && currentUser.role === Role.Child) {
      const newSession: Session = {
        ...session,
        childId: currentUser.id,
        date: new Date().toISOString(),
      };
      setSessions(prevSessions => [...prevSessions, newSession]);
    }
    
    const returnView = currentUser?.role === Role.Child ? View.ChildDashboard : View.ParentDashboard;
    setView(returnView);
    setActiveGame(null);
    
  }, [currentUser]);

  const handleViewProgress = useCallback((child: User) => {
    setViewingChild(child);
    setView(View.Progress);
  }, []);
  
  const handleBackToDashboard = useCallback(() => {
    if (!currentUser) {
        setView(View.Login);
        return;
    }
     switch(currentUser.role) {
      case Role.Parent:
        setView(View.ParentDashboard);
        break;
      case Role.Therapist:
        setView(View.TherapistDashboard);
        break;
      default:
        setView(View.ChildDashboard);
    }
    setViewingChild(null);
  }, [currentUser]);
  
  const handleOpenContactModal = useCallback((userToContact: User, childContext?: User) => {
    setContactModalInfo({ isOpen: true, user: userToContact, childContext });
  }, []);

  const handleCloseContactModal = useCallback(() => {
    setContactModalInfo({ isOpen: false, user: null, childContext: null });
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!currentUser || !contactModalInfo.user) return;

    const conversationId = [currentUser.id, contactModalInfo.user.id].sort().join('_');
    const newMessage: Message = { senderId: currentUser.id, text, timestamp: Date.now() };

    const updatedHistory = {
      ...chatHistory,
      [conversationId]: [...(chatHistory[conversationId] || []), newMessage]
    };
    setChatHistory(updatedHistory);
    setIsAiTyping(true);

    try {
      // The service will handle mock vs real response
      const aiResponseText = await generateChatResponse(
        updatedHistory[conversationId], 
        currentUser, 
        contactModalInfo.user,
        contactModalInfo.childContext
      );
      
      const aiMessage: Message = { senderId: contactModalInfo.user.id, text: aiResponseText, timestamp: Date.now() + 1000 };
      
       setTimeout(() => {
         setChatHistory(prevHistory => ({
          ...prevHistory,
          [conversationId]: [...(prevHistory[conversationId] || []), aiMessage]
        }));
        setIsAiTyping(false);
       }, 1500); // Simulate network delay

    } catch (error) {
       console.error("Failed to get AI response:", error);
       const errorMessage: Message = { senderId: contactModalInfo.user.id, text: "Sorry, I'm having trouble connecting right now.", timestamp: Date.now() + 1000 };
       setChatHistory(prevHistory => ({
        ...prevHistory,
        [conversationId]: [...(prevHistory[conversationId] || []), errorMessage]
      }));
       setIsAiTyping(false);
    }
  }, [currentUser, contactModalInfo, chatHistory]);


  const renderContent = () => {
    if (!currentUser) {
      return <LoginView onLogin={handleLogin} />;
    }

    switch (view) {
      case View.Game:
        return activeGame ? <GameView game={activeGame} onGameEnd={endGame} /> : <p>No game selected.</p>;
      
      case View.Progress:
        if (viewingChild) {
          const childSessions = sessions.filter(s => s.childId === viewingChild.id);
          return <ProgressView sessions={childSessions} child={viewingChild} onBack={handleBackToDashboard} />;
        }
        handleBackToDashboard();
        return null;

      case View.ChildDashboard:
        return <Dashboard onStartGame={startGame} childName={currentUser.name} />;

      case View.ParentDashboard:
        return <ParentDashboard user={currentUser} onViewProgress={handleViewProgress} onConnectTherapist={handleNavigateToConnectTherapist} onContact={handleOpenContactModal} sessions={sessions} allUsers={users} />;
        
      case View.TherapistDashboard:
        return <TherapistDashboard user={currentUser} onViewProgress={handleViewProgress} onUpdateRequest={handleConnectionRequest} onContact={handleOpenContactModal} allUsers={users}/>;
        
      case View.ConnectTherapist:
         if (viewingChild) {
          const therapists = users.filter(u => u.role === Role.Therapist);
          return <ConnectTherapistView therapists={therapists} child={viewingChild} onSendRequest={handleSendConnectionRequest} onBack={() => setView(View.ParentDashboard)} />;
        }
        handleBackToDashboard();
        return null;

      default:
        return <LoginView onLogin={handleLogin} />;
    }
  };

  const conversationId = currentUser && contactModalInfo.user ? [currentUser.id, contactModalInfo.user.id].sort().join('_') : '';
  
  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800">
      {!isApiConfigured && (
        <div className="bg-yellow-100 border-b-2 border-yellow-300 text-yellow-900 text-center p-2 text-sm font-semibold sticky top-0 z-50">
          Demo Mode: AI features are using mock data. Provide an API key to enable live responses.
        </div>
      )}
      <Header currentUser={currentUser} onLogout={handleLogout} onGoToDashboard={handleBackToDashboard}/>
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
      {contactModalInfo.isOpen && currentUser && (
        <ContactModal 
          isOpen={contactModalInfo.isOpen}
          currentUser={currentUser}
          contactUser={contactModalInfo.user}
          onClose={handleCloseContactModal}
          history={chatHistory[conversationId] || []}
          onSendMessage={handleSendMessage}
          isAiTyping={isAiTyping}
        />
      )}
    </div>
  );
};

export default App;