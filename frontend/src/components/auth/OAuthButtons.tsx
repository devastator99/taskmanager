import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { FiChrome, FiGithub, FiTwitter } from 'react-icons/fi';

export const OAuthButtons: React.FC = () => {
  const { oauthLogin } = useAuth();

  const providers = [
    {
      name: 'Google',
      icon: FiChrome,
      color: 'hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20',
      provider: 'google',
    },
    {
      name: 'GitHub',
      icon: FiGithub,
      color: 'hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-950/20',
      provider: 'github',
    },
    {
      name: 'Twitter',
      icon: FiTwitter,
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