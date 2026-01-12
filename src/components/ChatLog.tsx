import React, { useEffect, useRef } from 'react';
import { ChatMessage, UserRole } from '../types';

interface ChatLogProps {
  messages: ChatMessage[];
  currentRole: UserRole;
}

export const ChatLog: React.FC<ChatLogProps> = ({ messages, currentRole }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto w-full p-4 space-y-3 scrollbar-hide">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-cute-text/30 text-xs font-bold uppercase tracking-widest gap-2">
          <p>Sem novidades por enquanto</p>
        </div>
      )}
      
      {messages.map((msg) => {
        const isMe = msg.sender === currentRole;
        const isPet = msg.sender === 'pet';
        
        // Actions are centered, subtle logs
        if (msg.isAction) {
          return (
            <div key={msg.id} className="flex justify-center animate-pop">
              <span className="bg-cute-text/5 px-3 py-1 rounded-lg text-[10px] text-cute-text/50 font-bold uppercase tracking-wide">
                {msg.text}
              </span>
            </div>
          );
        }

        // Pet messages are cards
        if (isPet) {
             return (
                <div key={msg.id} className="flex gap-3 animate-pop">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-cute-pink flex-shrink-0 flex items-center justify-center text-sm shadow-sm">
                        🐾
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-cute-text leading-relaxed relative">
                        {msg.text}
                    </div>
                </div>
             )
        }

        // User messages are simpler, right aligned bubbles
        return (
          <div key={msg.id} className="flex justify-end animate-pop">
            <div className={`
                px-4 py-2 max-w-[80%] rounded-2xl text-xs font-medium shadow-sm
                ${isMe ? 'bg-cute-pink text-white rounded-tr-sm' : 'bg-cute-blue text-white rounded-tr-sm'}
            `}>
              {msg.text}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};