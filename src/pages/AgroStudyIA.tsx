import { useState } from "react";
import { Send, Bot, User, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AgroStudyIA() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou sua assistente de IA especializada em agronomia e estudos rurais. Como posso ajudá-lo hoje?',
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

    // Simulação de resposta da IA (remover quando integrar IA real)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Esta é uma resposta simulada. A integração com IA será implementada em breve!',
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

  const suggestedQuestions = [
    "Como melhorar a produtividade do milho?",
    "Quais são as melhores práticas de irrigação?",
    "Como identificar pragas em cultivos?",
    "Técnicas de rotação de culturas"
  ];

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-3 mb-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleGoBack}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-agro-green to-agro-sky rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-agro-green">AgroStudy IA</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Sua assistente inteligente para estudos agrícolas</p>
              </div>
            </div>
          </div>
        </div>
        
        <Badge variant="secondary" className="bg-agro-green/10 text-agro-green border-agro-green/20 mb-4 sm:mb-6">
          <Bot className="w-3 h-3 mr-1" />
          Versão Beta
        </Badge>
      </div>

      {/* Sugestões rápidas */}
      {messages.length <= 1 && (
        <Card className="mb-4 sm:mb-6 flex-shrink-0">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Perguntas Sugeridas</CardTitle>
            <CardDescription className="text-sm">Clique em uma pergunta para começar</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto p-3 hover:bg-agro-green/5 touch-manipulation"
                  onClick={() => setInputMessage(question)}
                >
                  <Bot className="w-4 h-4 mr-2 text-agro-green flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 p-4 sm:p-6 flex-shrink-0">
          <CardTitle className="text-base sm:text-lg">Conversa</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 pt-0 min-h-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 pr-2 sm:pr-4 mb-3 sm:mb-4 min-h-0">
            <div className="space-y-3 sm:space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-agro-green text-white' 
                        : 'bg-gradient-to-r from-agro-green to-agro-sky text-white'
                    }`}>
                      {message.sender === 'user' ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-agro-green text-white'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
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
                  <div className="flex space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-agro-green to-agro-sky flex items-center justify-center">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-agro-green rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-agro-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-agro-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex space-x-2 sm:space-x-3 flex-shrink-0">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre agronomia..."
              className="flex-1 h-10 sm:h-9 text-sm sm:text-base"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-agro-green hover:bg-agro-green/90 h-10 sm:h-9 px-3 sm:px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}