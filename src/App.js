import React, { useState, useRef } from "react";
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
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const currentScrollY = chatRef.current.scrollTop;
    
    // Prevent jittering
    if (Math.abs(currentScrollY - lastScrollY.current) < 15) return;

    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      // Scrolling down -> hide header
      setShowHeader(false);
    } else {
      // Scrolling up -> show header
      setShowHeader(true);
    }
    lastScrollY.current = currentScrollY;
  };

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
          <ChatHeader onMenuClick={() => setSidebarOpen(prev => !prev)} isVisible={showHeader} />

          <div 
            style={styles.chatWindow} 
            ref={chatRef} 
            className="chat-window"
            onScroll={handleScroll}
          >
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
