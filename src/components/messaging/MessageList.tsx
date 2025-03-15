
import { useState, useEffect, forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface MessageListProps {
  userId: string;
  recipientId: string;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ userId, recipientId }, ref) => {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(null);
    
    useEffect(() => {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          
          // Fetch recipient profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', recipientId)
            .single();
            
          if (profileError) throw profileError;
          setRecipientProfile(profileData);
          
          // Fetch messages between the two users
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
            .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
            .order('created_at', { ascending: true });
            
          if (messagesError) throw messagesError;
          
          // Filter to only include messages between these two users
          const filteredMessages = messagesData.filter(msg => 
            (msg.sender_id === userId && msg.recipient_id === recipientId) || 
            (msg.sender_id === recipientId && msg.recipient_id === userId)
          );
          
          setMessages(filteredMessages);
          
          // Mark unread messages as read
          const unreadMessages = filteredMessages.filter(
            msg => !msg.is_read && msg.recipient_id === userId
          );
          
          if (unreadMessages.length > 0) {
            await Promise.all(
              unreadMessages.map(msg => 
                supabase
                  .from('messages')
                  .update({ is_read: true })
                  .eq('id', msg.id)
              )
            );
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoading(false);
        }
      };
      
      if (userId && recipientId) {
        fetchMessages();
      }
      
      // Set up real-time subscription for new messages
      const channel = supabase
        .channel('messages-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId},recipient_id=eq.${recipientId}`
        }, () => {
          fetchMessages();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${recipientId},recipient_id=eq.${userId}`
        }, () => {
          fetchMessages();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }, [userId, recipientId]);
    
    if (loading) {
      return (
        <>
          <CardHeader className="p-4 border-b">
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading conversation...
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-y-auto">
            <div className="p-6 flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </>
      );
    }
    
    return (
      <>
        <CardHeader className="p-4 border-b">
          <CardTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={recipientProfile?.avatar_url || "https://ui.shadcn.com/avatars/03.png"} />
              <AvatarFallback>
                {recipientProfile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span>{recipientProfile?.full_name || "User"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.sender_id === userId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === userId
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {format(new Date(message.created_at), "p · MMM d")}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={ref} />
          </div>
        </CardContent>
      </>
    );
  }
);

MessageList.displayName = "MessageList";
