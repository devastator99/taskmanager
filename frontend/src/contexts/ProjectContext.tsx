import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { User } from '../types';

export interface Project {
  id: number;
  name: string;
  color: string;
  description: string | null;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: User;
  created_at: string;
  updated_at: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  getProjectById: (id: number) => Project | undefined;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
        console.log('Fetching projects...');
        console.log('Token:', token);
        const response = await axios.get('/api/projects/');
        console.log('Projects fetched:', response.data);
        setProjects(response.data);
        console.log('Projects set:', projects);
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
        selectedProject,
        setSelectedProject,
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
