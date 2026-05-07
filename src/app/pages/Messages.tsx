import { useState } from "react";
import { Search, Send, Sparkles } from "lucide-react";

type Language = "EN" | "FR";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: "Client" | "Artisan";
  status: "open" | "resolved" | "handled";
  serviceRequest?: string;
}

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
  senderName?: string;
  avatar?: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop", lastMessage: "Thank you for the quick response", timestamp: "10:30 AM", unread: 3, type: "Client", status: "open", serviceRequest: "#SR-2024-1589" },
  { id: "2", name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop", lastMessage: "The electrician did an excellent job", timestamp: "9:45 AM", unread: 0, type: "Client", status: "resolved" },
  { id: "3", name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop", lastMessage: "Can I reschedule my carpentry appointment?", timestamp: "9:20 AM", unread: 1, type: "Client", status: "open" },
  { id: "4", name: "James Wilson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop", lastMessage: "Payment has been processed successfully", timestamp: "Yesterday", unread: 0, type: "Artisan", status: "handled" },
  { id: "5", name: "Lisa Anderson", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop", lastMessage: "Looking for HVAC maintenance service", timestamp: "Yesterday", unread: 0, type: "Client", status: "open" },
];

const MOCK_MESSAGES: Message[] = [
  { id: "1", sender: "user", text: "Hi, I need urgent help with a leaking pipe in my kitchen. Water is everywhere!", timestamp: "9:15 AM", senderName: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
  { id: "2", sender: "admin", text: "I understand this is urgent. I'm assigning our best plumber to your case right away. They will arrive within the next hour.", timestamp: "9:16 AM" },
  { id: "3", sender: "user", text: "Thank you! How much will this cost approximately?", timestamp: "9:20 AM", senderName: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
  { id: "4", sender: "admin", text: "Emergency plumbing services start at $85 for the first hour, plus parts. The plumber will provide a detailed estimate once they assess the situation.", timestamp: "9:22 AM" },
  { id: "5", sender: "user", text: "Thank you for the quick response, when will the plumber arrive?", timestamp: "10:30 AM", senderName: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
];

export default function Messages({ lang }: { lang: Language }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "open" | "resolved" | "handled">("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [messageInput, setMessageInput] = useState("");

  const t = {
    title: lang === "EN" ? "Messages" : "Messages",
    search: lang === "EN" ? "Search conversations..." : "Rechercher...",
    all: lang === "EN" ? "All" : "Tout",
    open: lang === "EN" ? "Open" : "Ouvert",
    resolved: lang === "EN" ? "Resolved" : "Résolu",
    handled: lang === "EN" ? "Handled" : "Traité",
    client: lang === "EN" ? "Client" : "Client",
    artisan: lang === "EN" ? "Artisan" : "Artisan",
    admin: lang === "EN" ? "Admin" : "Admin",
    aiAssisting: lang === "EN" ? "AI Assisting" : "IA en assistance",
    selectConversation: lang === "EN" ? "Select a conversation to start messaging" : "Sélectionnez une conversation",
  };

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv => {
    const matchesFilter = activeFilter === "all" || conv.status === activeFilter;
    const matchesSearch = !searchQuery ||
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
      {/* Left Panel - Conversations List */}
      <div className="w-full lg:w-96 border-r border-border flex flex-col bg-card">
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-border flex items-center gap-2 overflow-x-auto">
          {(["all", "open", "resolved", "handled"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {t[filter]}
              {filter === "open" && filteredConversations.filter(c => c.status === "open").length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                  {filteredConversations.filter(c => c.status === "open").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors text-left ${
                selectedConversation?.id === conv.id ? "bg-muted/80 border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="w-11 h-11 rounded-full object-cover" />
                  {conv.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold text-foreground truncate">{conv.name}</h3>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{conv.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-1">{conv.lastMessage}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    conv.type === "Client"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-orange-50 text-orange-600 border border-orange-200"
                  }`}>
                    {conv.type === "Client" ? t.client : t.artisan}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat View */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-foreground">{selectedConversation.name}</h2>
                  {selectedConversation.serviceRequest && (
                    <p className="text-xs text-primary">Service Request {selectedConversation.serviceRequest}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {MOCK_MESSAGES.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start gap-2 max-w-[70%] ${msg.sender === "admin" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.sender === "user" && msg.avatar && (
                      <img src={msg.avatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" />
                    )}
                    {msg.sender === "admin" && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">AD</span>
                      </div>
                    )}
                    <div className={`flex flex-col ${msg.sender === "admin" ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2.5 rounded-2xl ${
                        msg.sender === "admin"
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-card border border-border text-foreground rounded-tl-sm"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                        {msg.sender === "admin" && (
                          <span className="text-[10px] text-muted-foreground">{t.admin}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="relative">
                <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                <input
                  type="text"
                  placeholder={t.aiAssisting}
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 text-sm bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-primary"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted transition-colors">
                  <Send size={16} className="text-primary" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
                <Search size={28} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{t.selectConversation}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
