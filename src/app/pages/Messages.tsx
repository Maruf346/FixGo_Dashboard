import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Search, Sparkles } from "lucide-react";
import { loadStoredAuth } from "../../services/auth";
import { ChatSessionDetail, ChatSessionListItem, getChatSessionDetail, getChatSessions } from "../../services/chat";

type Language = "EN" | "FR";

function AvatarImg({ src, name, size = 32, className = "" }: { src?: string | null; name: string; size?: number; className?: string }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return src ? (
    <img
      src={src}
      alt={name}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 ${className}`}
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0 ${className}`}
    >
      {initial}
    </div>
  );
}

export default function Messages({ lang }: { lang: Language }) {
  const [sessions, setSessions] = useState<ChatSessionListItem[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSessionDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "client" | "artisan">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [listLoading, setListLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authState = loadStoredAuth();
  const accessToken = authState.accessToken;

  const t = {
    title: lang === "EN" ? "Messages" : "Messages",
    search: lang === "EN" ? "Search conversations..." : "Rechercher...",
    all: lang === "EN" ? "All" : "Tout",
    client: lang === "EN" ? "Client" : "Client",
    artisan: lang === "EN" ? "Artisan" : "Artisan",
    noSessions: lang === "EN" ? "No AI chat sessions found." : "Aucune session de chat IA trouvée.",
    selectConversation: lang === "EN" ? "Select a conversation to view the AI thread." : "Sélectionnez une conversation pour voir la discussion IA.",
    noConversation: lang === "EN" ? "No conversation selected." : "Aucune conversation sélectionnée.",
    loadingSessions: lang === "EN" ? "Loading sessions..." : "Chargement des sessions...",
    loadingConversation: lang === "EN" ? "Loading conversation..." : "Chargement de la conversation...",
    messageCount: lang === "EN" ? "Messages" : "Messages",
    user: lang === "EN" ? "User" : "Utilisateur",
    ai: lang === "EN" ? "AI" : "IA",
    pages: lang === "EN" ? "Pages" : "Pages",
    noToken: lang === "EN" ? "Not authenticated." : "Non authentifié.",
    userEmail: lang === "EN" ? "Email" : "Email",
    noPreview: lang === "EN" ? "No message preview available." : "Aucun aperçu du message disponible.",
  };

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) || null,
    [sessions, selectedSessionId],
  );

  useEffect(() => {
    async function fetchSessions() {
      if (!accessToken) {
        setError(t.noToken);
        return;
      }

      setListLoading(true);
      setError(null);
      try {
        const payload = await getChatSessions(
          {
            page,
            page_size: pageSize,
            search: searchQuery.trim() || undefined,
            user_type: activeFilter !== "all" ? activeFilter : undefined,
          },
          accessToken,
        );

        setSessions(payload.results);
        setTotalCount(payload.count);

        if (!selectedSessionId && payload.results.length > 0) {
          setSelectedSessionId(payload.results[0].id);
        }

        if (payload.results.length === 0) {
          setSelectedSessionId(null);
          setSelectedSession(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setListLoading(false);
      }
    }

    fetchSessions();
  }, [accessToken, activeFilter, page, pageSize, searchQuery, selectedSessionId, t.noToken]);

  useEffect(() => {
    async function fetchConversation() {
      if (!accessToken || !selectedSessionId) {
        setSelectedSession(null);
        return;
      }

      setDetailLoading(true);
      setError(null);
      try {
        const payload = await getChatSessionDetail(selectedSessionId, accessToken);
        setSelectedSession(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setSelectedSession(null);
      } finally {
        setDetailLoading(false);
      }
    }

    fetchConversation();
  }, [accessToken, selectedSessionId]);

  const selectedAvatar = activeSession?.user_picture || null;
  const selectedName = activeSession?.user_name || t.noConversation;
  const selectedEmail = activeSession?.user_email || "";
  const selectedTypeLabel = activeSession?.user_type === "artisan" ? t.artisan : t.client;

  return (
    <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
      <div className="w-full lg:w-96 border-r border-border flex flex-col bg-card shadow-sm ring-1 ring-border/10">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/60 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="px-4 py-3 border-b border-border flex items-center gap-2 overflow-x-auto">
          {(["all", "client", "artisan"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {filter === "all" ? t.all : filter === "client" ? t.client : t.artisan}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {listLoading ? (
            <div className="p-6 text-sm text-muted-foreground">{t.loadingSessions}</div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">{t.noSessions}</div>
          ) : (
            sessions.map((session) => {
              const lastMessage = session.last_message?.content || t.noPreview;
              const timestamp = session.last_message?.timestamp
                ? new Date(session.last_message.timestamp).toLocaleString()
                : new Date(session.created_at).toLocaleString();

              return (
                <button
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`w-full px-4 py-4 border-b border-border text-left hover:bg-muted/50 transition-colors ${
                    selectedSessionId === session.id ? "bg-muted/80 border-l-4 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AvatarImg
                      src={session.user_picture || null}
                      name={session.user_name || t.user}
                      size={44}
                      className="w-11 h-11"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">{session.user_name || t.user}</h3>
                          <p className="text-xs text-muted-foreground truncate">{session.user_email || "—"}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{lastMessage}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/70 text-foreground border border-border">
                          {session.message_count} {t.messageCount}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            session.user_type === "client"
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "bg-orange-50 text-orange-600 border border-orange-200"
                          }`}
                        >
                          {session.user_type === "client" ? t.client : t.artisan}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-3 border-t border-border bg-background flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.pages}: {page}</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-1 outline-none"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-background">
        <div className="px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <AvatarImg src={selectedAvatar} name={selectedName} size={48} className="w-12 h-12" />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-foreground truncate">{selectedName}</h2>
              <p className="text-xs text-muted-foreground truncate">{selectedEmail || "—"}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-muted text-foreground border border-border">
              {selectedTypeLabel}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {detailLoading ? (
            <div className="text-sm text-muted-foreground">{t.loadingConversation}</div>
          ) : selectedSession ? (
            selectedSession.messages.map((msg) => {
              const isUser = msg.sender === "user";
              const timestamp = new Date(msg.timestamp).toLocaleString();

              return (
                <div key={msg.id} className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${isUser ? "flex-row" : "flex-row-reverse"}`}>
                    {isUser ? (
                      <AvatarImg
                        src={selectedSession.user_picture || null}
                        name={selectedSession.user_name || t.user}
                        size={36}
                        className="w-9 h-9 mt-1"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 text-white">
                        <MessageSquare size={14} />
                      </div>
                    )}
                    <div className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}>
                      <div className={`px-4 py-3 rounded-3xl shadow-sm whitespace-pre-wrap ${
                        isUser
                          ? "bg-card border border-border text-foreground rounded-tl-none"
                          : "bg-primary text-white rounded-tr-none"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-muted-foreground">
                        <span>{timestamp}</span>
                        <span>{isUser ? t.user : t.ai}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-2">{t.noConversation}</p>
              <p className="text-sm text-muted-foreground">{t.selectConversation}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
