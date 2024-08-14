import React, { createContext, useContext, useState } from 'react';

// Lista de imágenes locales para el avatar
const avatarImages = [
  require('../../assets/images/avatar1.png'),
  require('../../assets/images/avatar2.png'),
  require('../../assets/images/avatar3.png'),
  require('../../assets/images/avatar4.png'),
  require('../../assets/images/avatar5.png'),
  require('../../assets/images/avatar6.png'),
  require('../../assets/images/avatar7.png'),
  require('../../assets/images/wallE.png'),
  require('../../assets/images/gunbal.png'),
  
];


const AvatarContext = createContext();


export const AvatarProvider = ({ children }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(avatarImages[0]);

    return (
        <AvatarContext.Provider value={{ selectedAvatar, setSelectedAvatar, avatarImages }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = () => useContext(AvatarContext);
