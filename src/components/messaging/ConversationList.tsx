
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ConversationListProps {
  userId: string;
  currentRecipientId: string | null;
}

type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

export const ConversationList = ({ userId, currentRecipientId }: ConversationListProps) => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<{userId: string, profile: UserProfile}[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Get all conversations for the current user
        const { data: conversationsData, error: conversationsError } = await supabase
          .rpc('get_user_conversations', { user_id: userId });
          
        if (conversationsError) throw conversationsError;
        
        if (!conversationsData || conversationsData.length === 0) {
          setLoading(false);
          return;
        }
        
        // For each conversation, get the other user's profile
        const conversationsWithProfiles = await Promise.all(
          conversationsData.map(async (conversation: any) => {
            const otherUserId = conversation.user1_id === userId 
              ? conversation.user2_id 
              : conversation.user1_id;
              
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', otherUserId)
              .single();
              
            if (profileError) throw profileError;
            
            return {
              userId: otherUserId,
              profile: profileData
            };
          })
        );
        
        setConversations(conversationsWithProfiles);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchConversations();
    }
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        fetchConversations();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center">
        <p className="text-muted-foreground">No conversations yet</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation, index) => (
        <div key={conversation.userId}>
          <button
            onClick={() => navigate(`/messages?id=${conversation.userId}`)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-accent transition-colors text-left ${
              currentRecipientId === conversation.userId ? "bg-accent" : ""
            }`}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.profile.avatar_url || "https://ui.shadcn.com/avatars/03.png"} />
              <AvatarFallback>
                {conversation.profile.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate">
                {conversation.profile.full_name || "User"}
              </p>
            </div>
          </button>
          {index < conversations.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};
