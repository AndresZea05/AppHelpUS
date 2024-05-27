import React, { useState } from 'react';
import Chat from './Chat';
import '../../../assets/css/ChatWrapper.css'; // Asegúrate de importar el archivo de estilos

const ChatWrapper = () => {
    const [isChatVisible, setIsChatVisible] = useState(false);

    const toggleChatVisibility = () => {
        setIsChatVisible(!isChatVisible);
    };

    return (
        <div>
            {!isChatVisible && (
                <button className="chat-toggle-button" onClick={toggleChatVisibility}>
                    Abrir Chat
                </button>
            )}
            {isChatVisible && (
                <div className="chat-container">
                    <Chat />
                    <button className="close-chat-button" onClick={toggleChatVisibility}>
                        Cerrar Chat
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatWrapper;
