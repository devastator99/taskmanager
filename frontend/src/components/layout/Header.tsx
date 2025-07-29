import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiBell, FiMenu, FiSun, FiMoon, FiMonitor, FiPlus, FiFolder, FiChevronDown, FiHome, FiInbox, FiStar, FiClock, FiCalendar, FiBarChart2, FiSettings } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { NewTaskModal } from '@/components/dashboard/NewTaskModal';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { projects, selectedProject, setSelectedProject, metrics, searchQuery, setSearchQuery, notifications } = useTask();
  const { user, isAdmin, logout } = useAuth();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const navigationItems = [
    { icon: FiHome, label: 'Dashboard', href: '/' },
    { icon: FiInbox, label: 'My Tasks', href: '/tasks', badge: metrics.tasksInProgress },
    { icon: FiStar, label: 'Important', href: '/important' },
    { icon: FiClock, label: 'Due Today', href: '/due-today', badge: metrics.tasksDueToday },
    { icon: FiCalendar, label: 'Calendar', href: '/calendar' },
    { icon: FiBarChart2, label: 'Reports', href: '/reports' },
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
            {item.badge != null && item.badge > 0 && <Badge variant="default" className="ml-auto h-5 px-2 text-xs">{item.badge}</Badge>}
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

  const ProjectSwitcher: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn('gap-2', isMobile ? 'w-full justify-start' : 'w-auto')}>
          {selectedProject ? (
            <>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProject.color }} />
              {selectedProject.name}
            </>
          ) : 'Projects'}
          <FiChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {projects.map((project) => (
          <DropdownMenuItem key={project.id} onClick={() => setSelectedProject(project)}>
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: project.color }} />
            {project.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <FiPlus className="mr-2 h-4 w-4" />
          Create Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Section */}
        <div className="flex items-center gap-2">
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
            <ProjectSwitcher />
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden lg:flex items-center gap-2 flex-1 max-w-2xl">
          <NavLinks />
          <div className="relative w-full max-w-md ml-auto">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
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
