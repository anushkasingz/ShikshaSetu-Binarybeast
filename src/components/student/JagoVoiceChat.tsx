import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StudentProfile } from '../../types/scholarship';
import { ChatMessage, askJagoAi, speakText, stopSpeaking } from '../../services/geminiJagoService';

interface JagoVoiceChatProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  language: 'en' | 'hi' | 'hinglish';
  setLanguage: (lang: 'en' | 'hi' | 'hinglish') => void;
  onNavigateToTab?: (tab: 'home' | 'wallet' | 'applications') => void;
}

export const JagoVoiceChat: React.FC<JagoVoiceChatProps> = ({
  isOpen,
  onClose,
  student,
  language,
  setLanguage,
  onNavigateToTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'jago',
      text: language === 'hi' 
        ? `नमस्ते ${student.fullName}! मैं जागो (JAGO) हूँ—आपका AI छात्रवृत्ति मित्र। आपकी AICTE प्रगति योजना और NSP केंद्रीय छात्रवृत्ति के लिए 98% पात्रता बन रही है। आप मुझसे कोई भी सवाल पूछ सकते हैं या बोल सकते हैं!`
        : `Namaste ${student.fullName}! I am JAGO, your AI Scholarship & Verification Guide. You have a 98% match for the AICTE Pragati Scholarship (₹50,000/yr). How can I assist you today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Check My Eligibility', action: 'eligibility' },
        { label: 'Why is Income Certificate flagged?', action: 'income_risk' },
        { label: 'Fix Name Mismatch', action: 'name_mismatch' },
        { label: 'DBT Bank Status', action: 'dbt_status' }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean up speech on close
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      setIsSpeaking(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
        setIsListening(false);
      }
    }
  }, [isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await askJagoAi(textToSend, [...messages, userMsg], student, language);
      
      const jagoMsg: ChatMessage = {
        id: `jago_${Date.now()}`,
        sender: 'jago',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, jagoMsg]);
      
      // Auto voice readout if enabled
      speakText(reply, language === 'hi' ? 'hi-IN' : 'en-IN');
      setIsSpeaking(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to initialize:', err);
      setIsListening(false);
    }
  };

  const handleToggleTtsPlayback = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakText(text, language === 'hi' ? 'hi-IN' : 'en-IN');
      setIsSpeaking(true);
    }
  };

  const handleQuickChip = (action: string) => {
    if (action === 'eligibility') {
      handleSend(language === 'hi' ? 'मेरी पात्रता की जांच करें' : 'Which scholarship schemes am I eligible for?');
    } else if (action === 'income_risk') {
      handleSend(language === 'hi' ? 'मेरा आय प्रमाण पत्र क्यों फ़्लैग हुआ है?' : 'Why is my income certificate marked expiring and how to renew?');
    } else if (action === 'name_mismatch') {
      handleSend(language === 'hi' ? 'आधार और 12वीं के नाम में अंतर कैसे ठीक करें?' : 'How can I fix the name mismatch between Aadhaar and Class XII?');
    } else if (action === 'dbt_status') {
      handleSend(language === 'hi' ? 'मेरी डीबीटी छात्रवृत्ति कब आएगी?' : 'What is my current DBT payment and PFMS sanction status?');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl h-[88vh] max-h-[750px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Bot className="w-5 h-5 text-slate-950" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  JAGO Voice & AI Assistant
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  National AI Guidance
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                जन जागृति एवं छात्रवृत्ति सहायता • Multilingual Voice Guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Pill Switcher */}
            <div className="flex bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-[11px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('hinglish')}
                className={`px-2 py-0.5 rounded ${language === 'hinglish' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                Hinglish
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Wave Animation when speaking/listening */}
        {(isListening || isSpeaking) && (
          <div className="bg-indigo-950/60 border-b border-indigo-800/40 px-4 py-2 flex items-center justify-between text-xs text-indigo-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
              <span>{isListening ? 'Listening to your voice... Speak now' : 'JAGO is speaking response'}</span>
            </div>
            {isSpeaking && (
              <button 
                onClick={stopSpeaking}
                className="text-[11px] underline hover:text-white flex items-center gap-1"
              >
                <VolumeX className="w-3.5 h-3.5" /> Stop Voice
              </button>
            )}
          </div>
        )}

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4 text-slate-950" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {isUser ? 'You' : 'JAGO Guidance Engine'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleToggleTtsPlayback(msg.text)}
                          title="Read out aloud"
                          className="p-1 rounded text-slate-400 hover:text-amber-400 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Optional Suggested Action Chips on first greeting or assistant replies */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickChip(chip.action)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-700/60 hover:bg-slate-700 text-amber-200 hover:text-white border border-slate-600 transition flex items-center gap-1"
                        >
                          <span>{chip.label}</span>
                          <span className="text-slate-400">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-200">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 flex items-center gap-2">
                <span>JAGO RAG engine searching official guidelines...</span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Context Bar */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5">
            <span className="font-semibold text-slate-300">Quick Prompts:</span>
            <button
              onClick={() => handleSend('How do I upload a renewed income certificate?')}
              className="hover:text-amber-300 underline"
            >
              Renew Income Cert
            </button>
            <span>•</span>
            <button
              onClick={() => handleSend('Is my bank account eligible for DBT transfer?')}
              className="hover:text-amber-300 underline"
            >
              Verify NPCI DBT
            </button>
            <span>•</span>
            <button
              onClick={() => handleSend('What documents are required for AICTE Pragati?')}
              className="hover:text-amber-300 underline"
            >
              Pragati Docs
            </button>
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            title={isListening ? 'Stop Listening' : 'Speak to JAGO'}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-amber-400" />}
          </button>

          {/* Text Input Field */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Listening to speech...' : 'Ask JAGO about schemes, deadlines, or defects...'}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0 shadow-md shadow-blue-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
