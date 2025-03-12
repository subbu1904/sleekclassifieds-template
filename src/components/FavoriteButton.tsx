
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoriteButtonProps {
  listingId: number;
  variant?: "icon" | "default";
  className?: string;
}

export const FavoriteButton = ({ 
  listingId,
  variant = "icon",
  className 
}: FavoriteButtonProps) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useWishlist();
  const favorite = isFavorite(listingId);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(listingId);
      toast.success("Removed from favorites");
    } else {
      addToFavorites(listingId);
      toast.success("Added to favorites");
    }
  };

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("absolute top-2 right-2 z-10 bg-white/80 hover:bg-white", className)}
        onClick={handleToggleFavorite}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            favorite ? "fill-red-500 text-red-500" : "text-gray-500"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={favorite ? "default" : "outline"}
      size="sm"
      className={className}
      onClick={handleToggleFavorite}
    >
      <Heart
        className={cn(
          "h-4 w-4 mr-2",
          favorite ? "fill-white" : "fill-none"
        )}
      />
      {favorite ? "Saved" : "Save"}
    </Button>
  );
};
