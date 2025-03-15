
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Copy, 
  WhatsApp,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useCopy } from "@/hooks/use-copy";
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const SocialShare = ({ 
  url = window.location.href,
  title = document.title,
  description = "Check out this listing!", 
  className = ""
}: SocialShareProps) => {
  const { t } = useLanguage();
  const { copy, isCopied } = useCopy();
  const [isOpen, setIsOpen] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "bg-[#1877F2] hover:bg-[#1877F2]/90"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "bg-[#0A66C2] hover:bg-[#0A66C2]/90"
    },
    {
      name: "WhatsApp",
      icon: WhatsApp,
      url: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`,
      color: "bg-[#25D366] hover:bg-[#25D366]/90"
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: "bg-gray-600 hover:bg-gray-600/90"
    }
  ];
  
  const handleCopyLink = () => {
    copy(url);
    toast.success(t('share', 'linkCopied'));
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: url,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span>{t('common', 'share')}</span>
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-full mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 flex flex-col gap-2 min-w-[200px]">
          <div className="flex flex-wrap gap-2 justify-center">
            <TooltipProvider>
              {shareLinks.map((link) => (
                <Tooltip key={link.name}>
                  <TooltipTrigger asChild>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full text-white ${link.color}`}
                      onClick={(e) => {
                        if (link.name === "Email") return; // Don't prevent default for email
                        e.preventDefault();
                        window.open(link.url, '_blank', 'width=600,height=400');
                      }}
                    >
                      <link.icon className="h-5 w-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('share', link.name.toLowerCase())}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="rounded-full h-9 w-9 p-2"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? t('share', 'copied') : t('share', 'copyLink')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};
