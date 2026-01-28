import React from 'react';

interface TreeBackgroundProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'prominent' | 'minimal';
  showLeaves?: boolean;
}

export function TreeBackground({ 
  children, 
  variant = 'subtle', 
  showLeaves = false 
}: TreeBackgroundProps) {
  const getBackgroundClass = () => {
    switch (variant) {
      case 'prominent':
        return 'tree-background tree-silhouette';
      case 'minimal':
        return 'tree-background';
      default:
        return 'tree-background';
    }
  };

  return (
    <div className={`relative ${getBackgroundClass()}`}>
      {showLeaves && (
        <div className="floating-leaves">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="leaf" />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}