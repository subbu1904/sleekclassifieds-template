
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "@/components/messaging/MessageList";
import { ConversationList } from "@/components/messaging/ConversationList";
import { Loader2, Send } from "lucide-react";
import { FeatureToggle } from "@/components/FeatureToggle";

const Messages = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get("id");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      toast.error("Please login to view messages");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipientId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user || !recipientId) return;
    
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content: message.trim()
        });
        
      if (error) {
        throw error;
      }
      
      setMessage("");
      toast.success("Message sent");
    } catch (error: any) {
      toast.error("Failed to send message: " + error.message);
    } finally {
      setSending(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>
        
        <FeatureToggle feature="chat">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[70vh]">
            <Card className="md:col-span-1 overflow-hidden flex flex-col">
              <CardHeader className="p-4">
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Your recent conversations</CardDescription>
              </CardHeader>
              <ConversationList 
                userId={user.id} 
                currentRecipientId={recipientId}
              />
            </Card>
            
            <Card className="md:col-span-2 flex flex-col">
              {recipientId ? (
                <>
                  <MessageList 
                    userId={user.id} 
                    recipientId={recipientId}
                    ref={messageEndRef}
                  />
                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={sending || !message.trim()}>
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list or start a new one
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </FeatureToggle>
        
        <FeatureToggle 
          feature="chat" 
          fallback={
            <Card className="p-8 text-center">
              <CardTitle className="mb-4">Messaging is not available</CardTitle>
              <CardDescription>
                The messaging feature is currently disabled by the administrator.
              </CardDescription>
            </Card>
          }
        />
      </main>
    </div>
  );
};

export default Messages;
