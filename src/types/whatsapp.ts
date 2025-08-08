export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text: {
    body: string;
  };
  type: "text" | "image" | "audio" | "video" | "document";
}

export interface WhatsAppContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

export interface WhatsAppWebhookPayload {
  payload_type: "whatsapp_webhook";
  _id: string;
  metaData: {
    entry: Array<{
      changes: Array<{
        field: string;
        value: {
          contacts: WhatsAppContact[];
          messages: WhatsAppMessage[];
          messaging_product: string;
          metadata: {
            display_phone_number: string;
            phone_number_id: string;
          };
        };
      }>;
      id: string;
    }>;
    gs_app_id: string;
    object: string;
  };
  createdAt: string;
  startedAt: string;
  completedAt: string;
  executed: boolean;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: {
    content: string;
    timestamp: string;
    from: string;
    isRead: boolean;
  };
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
}