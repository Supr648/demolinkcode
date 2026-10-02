import React from 'react';
import { HelpCircle } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export const NotFound = () => {
  return (
    <EmptyState
      icon={HelpCircle}
      title="404 - Page Not Found"
      description="The page you are looking for might have been moved, removed, or never existed."
      actionText="Return to Home"
      actionLink="/"
    />
  );
};

export default NotFound;
