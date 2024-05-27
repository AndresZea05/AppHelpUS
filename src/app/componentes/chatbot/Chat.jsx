import React, { useState } from 'react';
import Groq from 'groq-sdk';
import '../../../assets/css/chat.css'; // Asegúrate de importar el archivo de estilos
import logoAzul from '../../../assets/img/Logoazul.jpg'; // Importa la imagen local



const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
       
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message.trim()) {
            const userMessage = { role: "user", content: message };
            setMessages([...messages, userMessage]);
            const chatResponse = await getGroqChatCompletion(message);
            const assistantMessage = { role: "stark", content: chatResponse };
            setMessages([...messages, userMessage, assistantMessage]);
            setMessage('');
        }
    };

    const getGroqChatCompletion = async (userMessage) => {
        const groq = new Groq({
            apiKey: import.meta.env.VITE_GROQ_API_KEY,
            dangerouslyAllowBrowser: true
        });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: (
                        "Eres un asistente de Help Us, un ecosistema que busca servirte para buscar un mejor futuro. " +
                        "Tu objetivo es proporcionar información clara y útil sobre Help Us, incluyendo sus objetivos, " +
                        "funcionamiento, beneficios, costos, y medidas de seguridad. También debes dar la bienvenida " +
                        "a los usuarios y ofrecer asistencia en sus consultas relacionadas con la búsqueda de propiedades. " +
                        "Evita compartir información sensible o confidencial del proyecto."
                    )
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            model: "llama3-8b-8192"
        });

        return chatCompletion.choices[0]?.message?.content || '';
    };

    return (
        <div className="chat">
            <div className="contact bar">
                <div className="pic stark" style={{ backgroundImage: `url(${logoAzul})` }}></div>
                <div className="name">Asistente Help Us!</div>
                <div className="seen"></div>
            </div>
            <div className="messages" id="chat">
                <div className="time"></div>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                <div className="message stark">
                    <div className="typing typing-1"></div>
                    <div className="typing typing-2"></div>
                    <div className="typing typing-3"></div>
                </div>
            </div>
            <div className="input">
                
                <input 
                    placeholder="Habla con el chatbot" 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <i className="fas fa-microphone"></i>
                <button onClick={handleSubmit}>Enviar</button>
            </div>
        </div>
    );
};

export default Chat;
