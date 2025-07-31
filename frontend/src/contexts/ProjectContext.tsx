import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Project {
  id: number;
  name: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // Add other project-related fields as needed
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  getProjectById: (id: number) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects/');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const addProject = async (project: Project) => {
    try {
      const response = await axios.post('/api/projects/', project);
      setProjects((prevProjects) => [...prevProjects, response.data]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      const response = await axios.patch(`/api/projects/${updatedProject.id}/`, updatedProject);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === updatedProject.id ? response.data : project
        )
      );
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await axios.delete(`/api/projects/${id}/`);
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getProjectById = (id: number) => {
    return projects.find((project) => project.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
