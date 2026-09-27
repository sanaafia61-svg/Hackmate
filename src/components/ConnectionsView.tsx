import React, { useState } from 'react';
import { Connection } from '../types';

interface ConnectionsViewProps {
  connections: Connection[];
  activeChatConnection: Connection | null;
  setActiveChatConnection: (conn: Connection | null) => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  connections,
  activeChatConnection,
  setActiveChatConnection
}) => {
  const [messages, setMessages] = useState<Record<string, Array<{ sender: 'me' | 'them'; text: string; time: string }>>>({
    'conn-elena': [
      { sender: 'them', text: 'Hey Alex! Ready for CalHacks this weekend?', time: '10:30 AM' },
      { sender: 'me', text: 'Hey Elena! Yes, finalizing the Next.js setup right now.', time: '10:34 AM' },
      { sender: 'them', text: 'Let’s sync on Discord tonight regarding the API schema!', time: '10:45 AM' }
    ],
    'conn-marcus': [
      { sender: 'them', text: 'Got the ESP32 board flashed with the demo payload.', time: 'Yesterday' },
      { sender: 'me', text: 'Awesome, I will hook up the websocket stream to the frontend cards.', time: 'Yesterday' }
    ],
    'conn-priya': [
      { sender: 'them', text: 'Reviewed the demo flow, looks incredibly crisp!', time: '2 days ago' },
      { sender: 'me', text: 'Thanks Priya! Preparing the slide deck architecture now.', time: '2 days ago' }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');
  const [discordSyncSuccess, setDiscordSyncSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const currentChatId = activeChatConnection ? activeChatConnection.id : connections[0]?.id;
  const currentChatDev = activeChatConnection || connections[0];
  const chatHistory = messages[currentChatId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentChatId) return;

    const newMsg = {
      sender: 'me' as const,
      text: inputMessage.trim(),
      time: 'Just now'
    };

    setMessages((prev) => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), newMsg]
    }));

    setInputMessage('');

    // Simulate realistic instant typing reply after 1.2s
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [currentChatId]: [
          ...(prev[currentChatId] || []),
          {
            sender: 'them' as const,
            text: 'Sounds great! I just confirmed our repository permissions and pinned the Discord voice channel.',
            time: 'Just now'
          }
        ]
      }));
    }, 1200);
  };

  const filteredConnections = connections.filter(
    (c) =>
      c.developer.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.status.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full pt-20 pb-16 bg-background min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col w-full gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[11px] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Encrypted Hackathon Network</span>
            </div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Your Team Connections</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Direct communication with matched developers, squad invites, and Discord synchronization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDiscordSyncSuccess(true);
                setTimeout(() => setDiscordSyncSuccess(false), 3500);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">sync_saved_locally</span>
              <span>{discordSyncSuccess ? 'Discord Synced! ✓' : 'Sync Discord Roster'}</span>
            </button>
          </div>
        </div>

        {/* Split Messaging & Connections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
          {/* Left Column: Connections List (4 cols) */}
          <div className="lg:col-span-5 bg-[#0c0d12] rounded-2xl border border-zinc-800/80 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-zinc-800/60">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Squad Members ({connections.length})
              </span>
              <span className="text-[11px] font-mono text-emerald-400">3 Online</span>
            </div>

            {/* Quick search inside connections */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search teammates by name or stack..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* List */}
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[500px]">
              {filteredConnections.map((conn) => {
                const isSelected = currentChatDev?.id === conn.id;
                return (
                  <div
                    key={conn.id}
                    onClick={() => setActiveChatConnection(conn)}
                    className={`flex items-start justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-800/80 border border-zinc-700/80 shadow-inner'
                        : 'hover:bg-zinc-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={conn.developer.avatar}
                          alt={conn.developer.name}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-700/60"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#0c0d12] ${
                            conn.developer.isOnline ? 'bg-emerald-400' : 'bg-zinc-500'
                          }`}
                        ></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-white">{conn.developer.name}</h4>
                          <span className="font-mono text-[10px] text-zinc-500">
                            {conn.developer.university.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{conn.status}</p>
                        <p className="text-[11px] text-zinc-500 line-clamp-1 italic mt-1 font-mono">
                          {conn.lastMessage || 'Direct connection established.'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {conn.lastMessageTime || 'Online'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Conversation (7 cols) */}
          <div className="lg:col-span-7 bg-[#0c0d12] rounded-2xl border border-zinc-800/80 flex flex-col justify-between overflow-hidden">
            {currentChatDev ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={currentChatDev.developer.avatar}
                        alt={currentChatDev.developer.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-700/60"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-black ${
                          currentChatDev.developer.isOnline ? 'bg-emerald-400' : 'bg-zinc-500'
                        }`}
                      ></span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{currentChatDev.developer.name}</h3>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {currentChatDev.developer.major || 'Software Developer'} • {currentChatDev.developer.university}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                      {currentChatDev.developer.matchScore}% Match
                    </span>
                    <button
                      onClick={() => alert(`Discord invite sent to ${currentChatDev.developer.name}`)}
                      className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                      title="Share Discord Invite"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                  </div>
                </div>

                {/* Message Log */}
                <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[320px]">
                  <div className="text-center my-2">
                    <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800/80 font-mono text-[10px] text-zinc-400">
                      Roster Matching for CalHacks Spring 2025
                    </span>
                  </div>

                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[80%] ${
                        msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'me'
                            ? 'bg-white text-black font-medium rounded-br-xs'
                            : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900/60 border-t border-zinc-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message ${currentChatDev.developer.name} (e.g. project pitch, repo link)...`}
                    className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Send</span>
                    <span className="material-symbols-outlined text-[14px]">send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                <p className="text-sm">Select a connection to start coordinating your hackathon squad.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
