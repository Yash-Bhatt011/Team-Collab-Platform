import { createContext, useContext, useState } from 'react';
import { mockPrivateNotes } from '../utils/mockData';
import { useAuth } from './AuthContext';

const PrivateNotesContext = createContext(null);

export const PrivateNotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(mockPrivateNotes);
  const { user } = useAuth();

  const getNotesForTask = (taskId) => {
    return notes.find(note => note.taskId === taskId && note.userId === user.id);
  };

  const saveNote = (taskId, content) => {
    const existingNoteIndex = notes.findIndex(
      note => note.taskId === taskId && note.userId === user.id
    );

    if (existingNoteIndex >= 0) {
      setNotes(prev => prev.map((note, idx) => 
        idx === existingNoteIndex 
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      ));
    } else {
      setNotes(prev => [...prev, {
        id: Date.now(),
        taskId,
        userId: user.id,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPrivate: true
      }]);
    }
  };

  return (
    <PrivateNotesContext.Provider value={{ getNotesForTask, saveNote }}>
      {children}
    </PrivateNotesContext.Provider>
  );
};

export const usePrivateNotes = () => {
  const context = useContext(PrivateNotesContext);
  if (!context) {
    throw new Error('usePrivateNotes must be used within a PrivateNotesProvider');
  }
  return context;
};
