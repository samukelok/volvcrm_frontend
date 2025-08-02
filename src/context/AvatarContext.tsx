import React, { createContext, useContext, useState } from 'react';

interface AvatarContextType {
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
}

const AvatarContext = createContext<AvatarContextType>({
  avatar: null,
  setAvatar: () => {},
});

export const AvatarProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [avatar, setAvatar] = useState<string | null>((window as any).__USER__?.avatar || null);
  
  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);