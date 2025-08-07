import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiMenu, FiSun, FiMoon, FiMonitor, FiPlus, FiFolder, FiChevronDown, FiHome, FiInbox, FiCalendar, FiSettings, FiGrid, FiList, FiCheck } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { useTask } from '@/contexts/TaskContext';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { NewTaskModal } from '@/components/dashboard/NewTaskModal';
import { cn } from '@/lib/utils';
import { ViewSelector, ViewType } from '@/components/dashboard/ViewSelector';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { Project } from '@/types';

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  // Use ProjectContext for project state
  const { projects, selectedProject, setSelectedProject } = useProject();
  // Use TaskContext for notifications and search
  const { searchQuery, setSearchQuery, notifications } = useTask();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin, logout } = useAuth();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const navigate = useNavigate();

  const navigationItems = [
    { icon: FiHome, label: 'Overview', href: '/' },
    { icon: FiGrid, label: 'Kanban', href: '/kanban' },
    { icon: FiList, label: 'List', href: '/list' },
    { icon: FiCalendar, label: 'Calendar', href: '/calendar' },
  ];

  const adminNavItem = { icon: FiSettings, label: 'Admin', href: '/admin' };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <nav className={cn('items-center gap-1', isMobile ? 'flex flex-col w-full' : 'hidden lg:flex')}>
      {navigationItems.map((item) => (
        <Button asChild key={item.href} variant={location.pathname === item.href ? 'secondary' : 'ghost'} className={cn('w-full justify-start', !isMobile && 'w-auto')}>
          <Link to={item.href} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
      {isAdmin() && (
        <Button asChild variant={location.pathname === adminNavItem.href ? 'secondary' : 'ghost'} className={cn('w-full justify-start', !isMobile && 'w-auto')}>
          <Link to={adminNavItem.href} className="flex items-center gap-2">
            <adminNavItem.icon className="h-4 w-4" />
            {adminNavItem.label}
          </Link>
        </Button>
      )}
    </nav>
  );

    // Remove unused createProject since we're using it from the context

  const ProjectSwitcher: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const handleProjectCreated = (newProject: Project) => {
      setSelectedProject(newProject);
      setOpen(false); // Close the dropdown after creating a project
    };

    return (
      <DropdownMenu>  
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn('gap-2', isMobile ? 'w-full justify-start' : 'w-auto')}>
            {selectedProject ? (
              <>
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: selectedProject.color }} 
                />
                <span className="truncate max-w-[120px]">{selectedProject.name}</span>
              </>
            ) : (
              <span>Select Project</span>
            )}
            <FiChevronDown className="h-4 w-4 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 max-h-[400px] overflow-y-auto">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Your Projects
          </div>
          {isLoading ? (
            <div className="px-2 py-2 text-sm text-muted-foreground">Loading projects...</div>
          ) : error ? (
            <div className="px-2 py-2 text-sm text-destructive">{error}</div>
          ) : projects.length === 0 ? (
            <div className="px-2 py-2 text-sm text-muted-foreground">No projects found</div>
          ) : (
            <>
              {projects.map((project) => (
                <DropdownMenuItem 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center justify-between hover:bg-accent/50"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: project.color || '#3B82F6' }} 
                    />
                    <span className="truncate">{project.name}</span>
                  </div>
                  {selectedProject?.id === project.id && (
                    <FiCheck className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </>
          )}
          <DropdownMenuSeparator />
          <CreateProjectDialog onProjectCreated={handleProjectCreated}>
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              <span>Create Project</span>
            </DropdownMenuItem>
          </CreateProjectDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const currentView: ViewType = (() => {
    switch (location.pathname) {
      case '/': return 'overview';
      case '/kanban': return 'kanban';
      case '/list': return 'list';
      case '/calendar': return 'calendar';
      default: return 'overview'; // Default to overview if path doesn't match
    }
  })();

  const handleViewChange = (view: ViewType) => {
    switch (view) {
      case 'overview': navigate('/'); break;
      case 'kanban': navigate('/kanban'); break;
      case 'list': navigate('/list'); break;
      case 'calendar': navigate('/calendar'); break;
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Section */}
        <div className="flex items-center gap-5">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <FiMenu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <FiFolder className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="font-bold text-lg">TaskFlow</h1>
              </div>
              <div className="flex flex-col gap-2">
                <ProjectSwitcher isMobile />
                <NavLinks isMobile />
                <ViewSelector currentView={currentView} onViewChange={handleViewChange} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <FiFolder className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="font-bold text-lg">TaskFlow</h1>
            </div>
            <ViewSelector currentView={currentView} onViewChange={handleViewChange} />
            <ProjectSwitcher />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowNewTaskModal(true)}>
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <FiBell className="w-5 h-5" />
                {unreadCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 justify-center text-xs">{unreadCount}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              {/* ... Notifications content ... */}
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {theme === 'light' && <FiSun className="w-5 h-5" />}
                {theme === 'dark' && <FiMoon className="w-5 h-5" />}
                {theme === 'system' && <FiMonitor className="w-5 h-5" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}><FiSun className="w-4 h-4 mr-2" />Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}><FiMoon className="w-4 h-4 mr-2" />Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}><FiMonitor className="w-4 h-4 mr-2" />System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="p-2">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <NewTaskModal isOpen={showNewTaskModal} onClose={() => setShowNewTaskModal(false)} />
    </header>
  );
};
