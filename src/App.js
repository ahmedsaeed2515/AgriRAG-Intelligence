import React, { useState } from "react";
import { useChat } from "./hooks/useChat";
import { chatStyles as styles } from "./utils/styles";

import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import WelcomeScreen from "./components/WelcomeScreen";
import Message from "./components/Message";
import ChatFooter from "./components/ChatFooter";

import "./styles.css";

export default function AgriRAG() {
  const {
    messages,
    input,
    setInput,
    busy,
    selectedImage,
    chatRef,
    inputRef,
    fileInputRef,
    sendMessage,
    handleImageSelect,
    removeImage,
    resetChat,
    regenerateLast
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Mobile overlay — tap outside sidebar to close */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div style={styles.body}>
        <Sidebar
          messages={messages}
          resetChat={resetChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div style={styles.main}>
          <ChatHeader onMenuClick={() => setSidebarOpen(prev => !prev)} />

          <div style={styles.chatWindow} ref={chatRef}>
            {isEmpty ? (
              <WelcomeScreen />
            ) : (
              messages.map((msg, i) => (
                <Message
                  key={i}
                  msg={msg}
                  isLast={i === messages.length - 1}
                  onRegenerate={regenerateLast}
                />
              ))
            )}
          </div>

          <ChatFooter
            busy={busy}
            sendMessage={sendMessage}
            input={input}
            setInput={setInput}
            inputRef={inputRef}
            fileInputRef={fileInputRef}
            selectedImage={selectedImage}
            handleImageSelect={handleImageSelect}
            removeImage={removeImage}
          />
        </div>
      </div>
    </>
  );
}
