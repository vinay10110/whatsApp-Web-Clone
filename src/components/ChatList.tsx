import { useState, useEffect } from 'react';
import { Chat } from '../types/whatsapp';
import { WhatsAppAPI } from '../api/whatsapp';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { formatSidebarTimestamp } from '../utils/date'; // Assuming you have a utility function for formatting timestamps
interface ChatListProps {
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

const ChatList = ({ selectedChatId, onChatSelect }: ChatListProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadChats = async () => {
      const chatData = await WhatsAppAPI.getChats();
     
      setChats(chatData);
    };
    loadChats();
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.content.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full border-r border-border flex flex-col" style={{ backgroundColor: '#F0F2F5' }}>
      {/* Header */}
      <div className="p-4 border-b border-border" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-whatsapp-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">SW</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border rounded-2xl focus:ring-0 focus:border-whatsapp-primary"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`p-3 cursor-pointer hover:bg-sidebar-hover transition-colors border-b border-border/50 ${
              selectedChatId === chat.id ? 'bg-sidebar-hover' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                 
                  <AvatarFallback className="bg-whatsapp-primary text-white">
                    {chat.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
                 <span className="text-xs text-muted-foreground">
  {formatSidebarTimestamp(chat.lastMessage.timestamp)}
</span>

                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 max-w-full">
                    {chat.lastMessage.from === 'system' && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {chat.lastMessage.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage.from === 'system' ? 'You: ' : ''}{chat.lastMessage.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;