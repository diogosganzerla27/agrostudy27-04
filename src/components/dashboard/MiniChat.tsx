import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function MiniChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Como posso ajudá-lo com seus estudos agrícolas?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulação de resposta da IA (substituir por integração real)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Esta é uma resposta simulada da IA. A implementação completa será integrada em breve!',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-96 flex flex-col">
      {/* Messages Area */}
      <ScrollArea className="flex-1 pr-2 mb-3 min-h-0">
        <div className="space-y-3 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-agro-green text-white' 
                    : 'bg-gradient-to-r from-agro-green to-agro-sky text-white'
                }`}>
                  {message.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>
                <div className={`rounded-lg p-2 ${
                  message.sender === 'user'
                    ? 'bg-agro-green text-white'
                    : 'bg-muted'
                }`}>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                  <p className={`text-xs mt-1 opacity-70 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-agro-green to-agro-sky flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-muted rounded-lg p-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-agro-green rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-agro-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-agro-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex space-x-2 flex-shrink-0">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enviar mensagem para AgroStudyIA"
          className="flex-1 h-8 text-sm"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-agro-green hover:bg-agro-green/90 h-8 px-3"
          size="sm"
        >
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}