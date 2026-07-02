import React, { useState, useEffect, useRef } from 'react';
import { Plane, Send, X, Bot, User, MessageSquare, Mic, MicOff, PhoneCall } from 'lucide-react';
import { ChatMessage, Booking } from '../types';
import { ALTERNATIVE_FLIGHTS } from '../mockData';
import OpenAI from 'openai';

interface ChatWidgetProps {
  booking: Booking;
  isOpen: boolean;
  onToggle: () => void;
  onNavigateToRebook?: () => void;
  onNavigateToRefund?: () => void;
  onConfirmRebook?: (pnr: string, flightCode: string) => void;
  onConfirmNewBooking?: (flightCode: string) => void;
}

const openai = new OpenAI({ 
  apiKey: (import.meta as any).env.VITE_OPENAI_API_KEY || 'placeholder',
  dangerouslyAllowBrowser: true 
});

const SYSTEM_PROMPT = `
You are a helpful customer support agent for SkyJet Airways.
The user is talking to you from their active flight disruption dashboard or main dashboard.
The user's current booking reference is \${booking.pnr} for flight \${booking.originalFlight.code}.
If they want to rebook an existing flight, use the 'navigate_to_rebook' tool.
If they want a refund for an existing flight, use the 'navigate_to_refund' tool.
If they want to explicitly confirm an existing flight rebooking and they know the new flight code, use 'rebook_flight'.
If they want to book a COMPLETELY NEW flight, first ask them for their origin, destination, and date. Then use the 'search_flights' tool to find options. Present the options clearly. Once they choose one, you MUST ask for their final confirmation before booking. Once they confirm, use 'book_new_flight'.
If they request human help or an agent, use the 'escalate_to_human' tool immediately.
Keep responses concise, friendly, and helpful. Do not mention the tool names to the user.
`;

const tools = [
  {
    type: "function",
    function: {
      name: "navigate_to_rebook",
      description: "Navigates the user to the flight rebooking screen."
    }
  },
  {
    type: "function",
    function: {
      name: "navigate_to_refund",
      description: "Navigates the user to the refund screen."
    }
  },
  {
    type: "function",
    function: {
      name: "rebook_flight",
      description: "Rebooks the user onto a specific new flight.",
      parameters: {
        type: "object",
        properties: {
          pnr: { type: "string" },
          newFlightCode: { type: "string" }
        },
        required: ["pnr", "newFlightCode"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_flights",
      description: "Searches for flights based on criteria.",
      parameters: {
        type: "object",
        properties: {
          origin: { type: "string" },
          destination: { type: "string" },
          date: { type: "string" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "book_new_flight",
      description: "Books a new flight.",
      parameters: {
        type: "object",
        properties: {
          flightCode: { type: "string" }
        },
        required: ["flightCode"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "escalate_to_human",
      description: "Escalates to a human agent."
    }
  }
];

export default function ChatWidget({ 
  booking, 
  isOpen, 
  onToggle, 
  onNavigateToRebook, 
  onNavigateToRefund,
  onConfirmRebook,
  onConfirmNewBooking
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      sender: 'agent',
      text: "नमस्ते! I'm your SkyJet Assistant. I can help you rebook your cancelled flight or process a refund. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chips: ['Check flight status', 'Rebook my flight', 'Am I eligible for a refund?']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  
  // State for OpenAI conversation history
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const handleSendRef = useRef<any>(null);
  
  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      let silenceTimer: any;

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        
        const setInputTextRef = (window as any).__setInputText;
        if (setInputTextRef) setInputTextRef(transcript);

        if (silenceTimer) clearTimeout(silenceTimer);
        
        silenceTimer = setTimeout(() => {
          if (transcript.trim() && handleSendRef.current) {
            recognition.stop();
            const setIsListeningRef = (window as any).__setIsListening;
            if (setIsListeningRef) setIsListeningRef(false);
            handleSendRef.current(transcript);
          }
        }, 2500);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        const setIsListeningRef = (window as any).__setIsListening;
        if (setIsListeningRef) setIsListeningRef(false);
      };

      recognition.onend = () => {
        const setIsListeningRef = (window as any).__setIsListening;
        if (setIsListeningRef) setIsListeningRef(false);
      };

      recognitionRef.current = recognition;
    }
  }, [booking.pnr]);

  // Initialize OpenAI System Prompt
  useEffect(() => {
    setConversationHistory([
      {
        role: "system",
        content: SYSTEM_PROMPT.replace('\${booking.pnr}', booking.pnr)
          .replace('\${booking.originalFlight.code}', booking.originalFlight.code)
      }
    ]);
  }, [booking.pnr]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isEscalated]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    (window as any).__setInputText = setInputText;
    (window as any).__setIsListening = setIsListening;
  }, [setInputText, setIsListening]);

  const handleSend = async (text: string) => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    if (!text.trim() || isEscalated) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const updatedHistory = [...conversationHistory, { role: "user", content: text }];
    setConversationHistory(updatedHistory);

    try {
      let currentHistory = [...updatedHistory];
      let finalReplyText = "";
      let shouldEscalate = false;

      while (true) {
        let response;
        try {
          response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: currentHistory as any,
            tools: tools as any,
            temperature: 0.3
          });
        } catch (err: any) {
          console.error("OpenAI request failed", err);
          throw err;
        }

        const choice = response.choices[0];
        const message = choice.message;

        currentHistory.push(message);

        if (message.tool_calls && message.tool_calls.length > 0) {
          for (const call of message.tool_calls) {
            let toolResponse: any = {};
            const args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
            const name = call.function.name;

            if (name === 'escalate_to_human') {
              shouldEscalate = true;
              finalReplyText = "I have notified a human agent. They will join shortly.";
              toolResponse = { status: 'success' };
            } else if (name === 'navigate_to_rebook') {
              onNavigateToRebook && onNavigateToRebook();
              toolResponse = { status: 'success', message: 'Navigated to rebook screen' };
            } else if (name === 'navigate_to_refund') {
              onNavigateToRefund && onNavigateToRefund();
              toolResponse = { status: 'success', message: 'Navigated to refund screen' };
            } else if (name === 'rebook_flight') {
              onConfirmRebook && onConfirmRebook(args.pnr, args.newFlightCode);
              toolResponse = { status: 'success', message: `Successfully rebooked onto ${args.newFlightCode}` };
            } else if (name === 'search_flights') {
              toolResponse = { status: 'success', flights: ALTERNATIVE_FLIGHTS };
            } else if (name === 'book_new_flight') {
              onConfirmNewBooking && onConfirmNewBooking(args.flightCode);
              toolResponse = { status: 'success', message: `Successfully booked new flight ${args.flightCode}` };
            }

            currentHistory.push({
              role: "tool",
              tool_call_id: call.id,
              name: name,
              content: JSON.stringify(toolResponse)
            });
          }
        } else {
          finalReplyText = message.content || finalReplyText;
          break;
        }
      }

      setConversationHistory(currentHistory);

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: finalReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);
      speak(finalReplyText);

      if (shouldEscalate) {
        setIsEscalated(true);
      }

    } catch (error) {
      console.error('OpenAI error:', error);
      const errorMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: "Sorry, I am having trouble connecting right now. Let me pass you to a human agent.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsEscalated(true);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const handleChipClick = (chipText: string) => {
    handleSend(chipText);
  };

  return (
    <div id="chat-widget-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      
      {/* Chat Panel (Toggled display) */}
      {isOpen && (
        <div 
          id="chat-panel" 
          className="w-[380px] max-w-[90vw] h-[520px] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/40 pointer-events-auto animate-fade-in-up"
        >
          {/* Header */}
          <div id="chat-header" className={`p-5 flex items-center justify-between text-white transition-colors ${isEscalated ? 'bg-error' : 'bg-primary'}`}>
            <div id="chat-header-agent-info" className="flex items-center gap-3">
              <div id="chat-agent-avatar" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                {isEscalated ? (
                  <PhoneCall className="text-white w-5 h-5 animate-pulse" />
                ) : (
                  <Plane id="chat-header-plane-icon" className="text-secondary-container w-5 h-5 rotate-90" />
                )}
              </div>
              <div>
                <h3 id="chat-agent-name" className="font-bold text-sm text-white">
                  {isEscalated ? 'Human Agent' : 'SkyJet Assistant'}
                </h3>
                <p id="chat-agent-status" className="text-xxs text-white/85 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full animate-ping inline-block ${isEscalated ? 'bg-white' : 'bg-[#137333]'}`}></span>
                  {isEscalated ? 'Connecting...' : 'Online · Ready to assist'}
                </p>
              </div>
            </div>
            <button 
              id="btn-close-chat-panel"
              onClick={onToggle}
              className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div id="chat-messages-area" className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-surface-container-low">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                id={`chat-msg-row-${msg.id}`}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar icon */}
                <div 
                  id={`chat-msg-avatar-${msg.id}`}
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary/15 text-primary'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div id={`chat-msg-bubble-container-${msg.id}`} className="flex flex-col gap-1 max-w-[80%]">
                  <div 
                    id={`chat-msg-bubble-${msg.id}`}
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-on-primary rounded-tr-none' 
                        : 'bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  <span id={`chat-msg-time-${msg.id}`} className={`text-[10px] text-outline px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>

                  {/* Chips for Agent quick reply */}
                  {msg.chips && msg.chips.length > 0 && (
                    <div id={`chat-chips-container-${msg.id}`} className="flex flex-wrap gap-1.5 mt-2">
                      {msg.chips.map((chip, cIdx) => (
                        <button 
                          key={cIdx}
                          id={`chat-chip-${msg.id}-${cIdx}`}
                          onClick={() => handleChipClick(chip)}
                          className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant hover:border-primary rounded-full text-xxs font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Simulated typing indicator */}
            {isTyping && (
              <div id="chat-typing-row" className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-2xl rounded-tl-none max-w-[80%] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            
            {isEscalated && (
              <div className="bg-error-container text-on-error-container text-xs p-3 rounded-xl text-center mt-2 border border-error/20 animate-pulse flex flex-col gap-2">
                <span>A live human agent has been notified and will join this chat shortly...</span>
                <button 
                  onClick={() => setIsEscalated(false)} 
                  className="bg-white/20 hover:bg-white/30 text-on-error-container px-3 py-1.5 rounded-lg text-xxs font-bold cursor-pointer transition-colors w-fit mx-auto"
                >
                  Cancel Request
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Area */}
          <form 
            id="chat-input-form" 
            className="p-3 border-t border-outline-variant bg-surface flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
          >
            <div id="chat-input-wrapper" className={`flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2 border flex-1 ${isListening ? 'border-error ring-2 ring-error/20' : 'border-outline-variant/60'}`}>
              <button
                type="button"
                onClick={toggleListen}
                disabled={isEscalated}
                className={`${isListening ? 'text-error animate-pulse' : 'text-on-surface-variant'} hover:text-primary transition-colors cursor-pointer disabled:opacity-30`}
                title="Speak to Assistant (Hindi/English)"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              
              <input 
                id="chat-text-input"
                className="bg-transparent border-none outline-hidden text-xs flex-1 text-on-surface placeholder-on-surface-variant/50" 
                placeholder={isEscalated ? "Waiting for agent..." : (isListening ? "Listening..." : "Ask or speak a question...")}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isEscalated}
              />
              <button 
                id="btn-chat-send"
                type="submit" 
                disabled={!inputText.trim() || isEscalated}
                className="text-primary hover:text-primary-container disabled:opacity-30 cursor-pointer font-bold transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Bubble Icon */}
      <button 
        id="chat-toggle-bubble" 
        onClick={onToggle}
        className={`w-14 h-14 ${isEscalated ? 'bg-error' : 'bg-primary'} hover:brightness-110 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all pointer-events-auto cursor-pointer`}
      >
        {isOpen ? (
          <X id="bubble-close-icon" className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare id="bubble-chat-icon" className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
