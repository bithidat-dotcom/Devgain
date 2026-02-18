import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Workspace } from './components/Workspace';
import { AppView, Project } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeProject, setActiveProject] = useState<Project | undefined>(undefined);

  const handleOpenProject = (project?: Project) => {
    setActiveProject(project);
    setCurrentView('workspace');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setActiveProject(undefined);
  };

  return (
    <>
      {currentView === 'dashboard' ? (
        <Dashboard onOpenProject={handleOpenProject} />
      ) : (
        <Workspace project={activeProject} onBack={handleBackToDashboard} />
      )}
    </>
  );
};

export default App;