import { useState, useEffect, useRef } from 'react';
import { Message, Chat } from '../types/whatsapp';
import { WhatsAppAPI } from '../api/whatsapp';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { parseISO, format } from 'date-fns';
import { getMessageDayLabel } from '../utils/date';
import { io } from "socket.io-client";
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import {formatChatTimestamp } from '../utils/date'; // Assuming you have a utility function for formatting timestamps
interface ChatWindowProps {
  chatId: string | null;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const socket = useRef(io(import.meta.env.VITE_BACKEND_URL));  
  let lastDateKey = '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatId) {
      loadChatData();
    }
  }, [chatId]);
useEffect(() => {
  const currentSocket = socket.current;

  currentSocket.on("newMessage", (message: Message) => {
    if (message.chatId === chatId) {
      setMessages(prev => [...prev, message].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ));
    }
  });

  return () => {
    currentSocket.off("newMessage");
  }
}, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = async () => {
    if (!chatId) return;
    
    setIsLoading(true);
    try {
      const [chatMessages, allChats] = await Promise.all([
        WhatsAppAPI.getChatMessages(chatId),
        WhatsAppAPI.getChats()
      ]);
      
      // Sort messages by timestamp before setting them
      const sortedMessages = chatMessages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setMessages(sortedMessages);
      setChat(allChats.find(c => c.id === chatId) || null);
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    try {
      const message = await WhatsAppAPI.sendMessage(chatId, newMessage);
      setMessages(prev => [...prev, message].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-8 opacity-20">
            <svg viewBox="0 0 303 172" className="w-full h-full">
              <path d="M229.565 160.229c-15.908 5.564-37.108 12.648-59.984 12.648-44.27 0-63.839-7.998-63.839-21.943 0-28.75 103.47-38.748 123.823-59.099 20.354-20.352 30.025-63.14 0-93.166-30.024-30.025-72.813-20.353-93.166 0-20.352 20.355-30.35 103.823-59.099 123.823-14.07 0-21.943-19.569-21.943-63.839 0-22.876 7.084-44.076 12.648-59.984" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-light text-muted-foreground mb-2">
            Keep your phone connected
          </h2>
          <p className="text-muted-foreground">
            WhatsApp connects to your phone to sync messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-whatsapp-primary text-white">
                {chat?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">{chat?.name}</h3>
              <p className="text-xs text-muted-foreground">
                {chat?.id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundColor: '#EAE6DF'
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          <>
            

{messages.map((message) => {
  
  if (!message.timestamp) return null;

  const messageDate = parseISO(
    typeof message.timestamp === 'string'
      ? message.timestamp
      : new Date(message.timestamp).toISOString()
  );
  const currentDateKey = format(messageDate, 'yyyy-MM-dd'); // strict date part
  const showLabel = currentDateKey !== lastDateKey;
  lastDateKey = currentDateKey;

  return (
    <div key={message.id}>
      {showLabel && (
        <div className="flex justify-center my-2">
          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {getMessageDayLabel(message.timestamp)}
          </span>
        </div>
      )}
      <div className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.isSent
              ? 'bg-[#D9FDD3] text-foreground rounded-br-none'
              : 'bg-message-received text-foreground rounded-bl-none'
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <div
            className={`flex items-center justify-end mt-1 space-x-1 text-message-time`}
          >
            <span className="text-xs">{formatChatTimestamp(message.timestamp)}</span>
            {message.isSent && (
              <span className="text-xs text-message-time">
                {message.isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Smile className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-background border-border rounded-2xl focus:ring-0 focus:border-whatsapp-primary"
            />
          </div>
          <Button 
            variant="ghost"
            size="icon"
            className="bg-whatsapp-primary hover:bg-whatsapp-primary-light text-white rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;