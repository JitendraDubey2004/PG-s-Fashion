import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { BsChatDots, BsSend, BsX } from 'react-icons/bs';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newUserMessage = { role: 'user', parts: message };
        setChatHistory([...chatHistory, newUserMessage]);
        setMessage('');
        setLoading(true);

        try {
            const { data } = await axios.post('/api/v1/chatbot', {
                message,
                history: chatHistory
            });

            if (data.success) {
                setChatHistory(prev => [...prev, { role: 'model', parts: data.message }]);
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            setChatHistory(prev => [...prev, { role: 'model', parts: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    <BsChatDots size={24} />
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>PG's Fashion Assistant</h3>
                        <button onClick={() => setIsOpen(false)}><BsX size={24} /></button>
                    </div>
                    <div className="chatbot-messages">
                        {chatHistory.length === 0 && (
                            <div className="message model">
                                Hello! How can I help you with your fashion choices today?
                            </div>
                        )}
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`message ${chat.role}`}>
                                {chat.parts}
                            </div>
                        ))}
                        {loading && <div className="message model loading">Typing...</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <form className="chatbot-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit"><BsSend size={20} /></button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
