import { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const WhatsAppLayout = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsMobileMenuOpen(false); // Close mobile menu when chat is selected
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Chat List Sidebar */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative fixed inset-y-0 left-0 z-20
        w-80 md:w-96 transition-transform duration-300 ease-in-out
      `}>
        <ChatList 
          selectedChatId={selectedChatId} 
          onChatSelect={handleChatSelect}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with menu toggle */}
        <div className="md:hidden p-4 bg-whatsapp-primary text-white flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-whatsapp-primary-light rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-4 text-lg font-semibold">WhatsApp</h1>
        </div>

        <ChatWindow chatId={selectedChatId} />
      </div>
    </div>
  );
};

export default WhatsAppLayout;