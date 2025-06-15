import React, { useState } from 'react';

interface AlithResponse {
  type: string;
  content: string;
  actionable: boolean;
  traits?: any;
}

interface AlithChatProps {
  isConnected: boolean;
  newBeingName?: string;
  onTraitsRecommended?: (traits: any) => void;
}

const AlithChat: React.FC<AlithChatProps> = ({ isConnected, newBeingName, onTraitsRecommended }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{
    type: 'user' | 'alith';
    content: string;
    timestamp: Date;
    response?: AlithResponse;
  }>>([
    {
      type: 'alith',
      content: '🤖 Hello! I\'m Alith, your AI assistant. I can analyze your society, suggest optimal AI being traits, and provide strategic advice. Ask me anything or use the quick actions below.',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const sendMessage = async () => {
    if (!input.trim() || !isConnected || isProcessing) return;

    const userMessage = {
      type: 'user' as const,
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setShowQuickActions(false);

    try {
      const response = await fetch('http://localhost:5000/api/alith/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: input.trim() })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.response) {
        const alithMessage = {
          type: 'alith' as const,
          content: data.response.content,
          timestamp: new Date(),
          response: data.response
        };

        setMessages(prev => [...prev, alithMessage]);

        // Check if Alith provided trait recommendations
        if (data.response.traits && onTraitsRecommended) {
          onTraitsRecommended(data.response.traits);
        }
      } else {
        throw new Error(data.error || 'Failed to process request');
      }
    } catch (error) {
      console.error('Alith chat error:', error);
      const errorMessage = {
        type: 'alith' as const,
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend is running.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Enhanced quick actions with trait suggestions
  const getMainQuickActions = () => [
    { 
      icon: '🎭', 
      text: 'Suggest Optimal Traits', 
      query: `Create an AI being optimized for the current market conditions${newBeingName ? ` with name "${newBeingName}"` : ''}` 
    },
    { icon: '📊', text: 'Market Analysis', query: 'Analyze current market trends and opportunities' },
    { icon: '⚡', text: 'Optimize Strategy', query: 'How can I improve my AI society\'s performance and earnings?' }
  ];

  const selectQuickAction = (query: string) => {
    setInput(query);
    setShowQuickActions(false);
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Alith AI</h3>
            <div className={`flex items-center space-x-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions Toggle */}
        <button
          onClick={toggleQuickActions}
          className="text-gray-400 hover:text-white transition-colors p-1"
          title={showQuickActions ? 'Hide quick actions' : 'Show quick actions'}
        >
          <span className="text-lg">{showQuickActions ? '−' : '+'}</span>
        </button>
      </div>

      {/* Quick Actions - Enhanced */}
      {showQuickActions && (
        <div className="p-3 border-b border-gray-600">
          <div className="space-y-2">
            {getMainQuickActions().map((action, index) => (
              <button
                key={index}
                onClick={() => selectQuickAction(action.query)}
                className="w-full flex items-center space-x-2 p-2 bg-blue-600 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all text-left"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-blue-200 text-sm font-medium">{action.text}</span>
              </button>
            ))}
          </div>
          
          {/* Additional Quick Actions */}
          <div className="mt-3 pt-2 border-t border-gray-600">
            <button
              onClick={() => {
                setInput('What collaboration opportunities exist in my AI society?');
                setShowQuickActions(false);
              }}
              className="w-full text-left p-2 text-gray-400 hover:text-white text-xs transition-colors rounded"
            >
              🤝 Collaboration Advice
            </button>
            <button
              onClick={() => {
                setInput('Analyze the personality traits of my current AI beings and suggest improvements');
                setShowQuickActions(false);
              }}
              className="w-full text-left p-2 text-gray-400 hover:text-white text-xs transition-colors rounded"
            >
              🧠 Trait Analysis
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl ${
              message.type === 'user'
                ? 'bg-blue-600 text-white ml-4'
                : 'bg-gray-700 text-gray-100 mr-4'
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
              <div className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
              
              {/* Show trait recommendations if available */}
              {message.response?.traits && (
                <div className="mt-2 p-2 bg-black bg-opacity-20 rounded-lg">
                  <div className="text-xs text-blue-200 mb-1">🎯 Recommended Traits:</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(message.response.traits).map(([trait, value]) => (
                      <div key={trait} className="flex justify-between">
                        <span className="capitalize">{trait.slice(0, 4)}</span>
                        <span className="font-bold">{value as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 px-3 py-2 rounded-2xl mr-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className="text-sm">Alith is analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-600">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Alith about traits, strategy, or market analysis..."
            disabled={!isConnected || isProcessing}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected || isProcessing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-1"
          >
            <span className="text-sm">🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlithChat;
