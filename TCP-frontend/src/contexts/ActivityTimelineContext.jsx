import { createContext, useContext, useState } from 'react';
import { mockUserActivity } from '../utils/mockData';

const ActivityTimelineContext = createContext(null);

export const ActivityTimelineProvider = ({ children }) => {
  const [activities, setActivities] = useState(mockUserActivity);

  const getUserActivity = (userId) => {
    return activities.find(activity => activity.userId === userId);
  };

  const addActivity = (userId, activityData) => {
    setActivities(prev => {
      const userActivityIndex = prev.findIndex(a => a.userId === userId);
      if (userActivityIndex >= 0) {
        const userActivity = prev[userActivityIndex];
        return prev.map((activity, idx) => 
          idx === userActivityIndex ? {
            ...activity,
            activities: [...activity.activities, activityData],
            summary: {
              ...activity.summary,
              ...updateSummary(activity.summary, activityData)
            }
          } : activity
        );
      }
      return [...prev, {
        id: Date.now(),
        userId,
        date: new Date().toISOString().split('T')[0],
        activities: [activityData],
        summary: initializeSummary(activityData)
      }];
    });
  };

  return (
    <ActivityTimelineContext.Provider value={{ getUserActivity, addActivity }}>
      {children}
    </ActivityTimelineContext.Provider>
  );
};

export const useActivityTimeline = () => {
  const context = useContext(ActivityTimelineContext);
  if (!context) {
    throw new Error('useActivityTimeline must be used within an ActivityTimelineProvider');
  }
  return context;
};
