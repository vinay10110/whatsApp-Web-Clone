import { WhatsAppWebhookPayload, Chat, Message } from '../types/whatsapp';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// API Endpoints Structure
export class WhatsAppAPI {
  
  // GET /api/chats - Get all chats
  static async getChats(): Promise<Chat[]> {
    const response = await fetch(`${BASE_URL}/api/chats`);
  
    return response.json();
  }

  // GET /api/chats/:chatId/messages - Get messages for a specific chat
  static async getChatMessages(chatId: string): Promise<Message[]> {
    const response = await fetch(`${BASE_URL}/api/chats/${chatId}/messages`);
    return response.json();
  }

  // POST /api/messages - Send a new message
  static async sendMessage(chatId: string, content: string): Promise<Message> {
    const response = await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, content }),
    });
    return response.json();
  }

  // POST /api/webhook - Handle WhatsApp webhook payload
  static async handleWebhook(payload: WhatsAppWebhookPayload): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${BASE_URL}/api/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  }

  // GET /api/contacts - Get all contacts
  static async getContacts(): Promise<Chat[]> {
    const response = await fetch(`${BASE_URL}/api/contacts`);
    return response.json();
  }

  // PUT /api/chats/:chatId/read - Mark chat as read
  static async markChatAsRead(chatId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${BASE_URL}/api/chats/${chatId}/read`, {
      method: 'PUT',
    });
    return response.json();
  }

  // GET /api/user/status - Get user online status
  static async getUserStatus(userId: string): Promise<{ isOnline: boolean; lastSeen?: string }> {
    const response = await fetch(`${BASE_URL}/api/user/${userId}/status`);
    return response.json();
  }
}