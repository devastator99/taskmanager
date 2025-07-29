import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Github, Chrome, Twitter } from 'lucide-react';

export const OAuthButtons: React.FC = () => {
  const { oauthLogin } = useAuth();

  const providers = [
    {
      name: 'Google',
      icon: Chrome,
      color: 'hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20',
      provider: 'google',
    },
    {
      name: 'GitHub',
      icon: Github,
      color: 'hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-950/20',
      provider: 'github',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20',
      provider: 'twitter',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {providers.map((provider) => {
        const Icon = provider.icon;
        return (
          <Button
            key={provider.name}
            variant="outline"
            className={`h-10 transition-all duration-200 ${provider.color}`}
            onClick={() => oauthLogin(provider.provider)}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">Continue with {provider.name}</span>
          </Button>
        );
      })}
    </div>
  );
};