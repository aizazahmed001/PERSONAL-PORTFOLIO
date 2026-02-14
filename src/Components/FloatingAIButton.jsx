import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import './FloatingAIButton.css'

function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages([...messages, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Call Gemini API
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      
      if (!apiKey) {
        throw new Error('API key is not configured')
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: inputValue
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        throw new Error(data?.error?.message || 'API request failed')
      }

      // Extract text from Gemini API response
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again."
      
      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        text: botReply,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I couldn't process that. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="floating-ai-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <MessageCircle size={24} className="text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-modal"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="ai-chat-header">
              <div className="ai-chat-title">
                <div className="ai-bot-avatar">🤖</div>
                <div>
                  <h3>AI Assistant</h3>
                  <p className="ai-status">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ai-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="ai-messages-container">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`ai-message ${message.sender}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="ai-message-bubble">
                    {message.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="ai-message bot">
                  <div className="ai-message-bubble">
                    <div className="ai-loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <form onSubmit={handleSendMessage} className="ai-input-section">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="ai-input"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="ai-send-btn"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingAIButton
