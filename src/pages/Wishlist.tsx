
import { Navigation } from "@/components/Navigation";
import { useWishlist } from "@/providers/WishlistProvider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { favorites } = useWishlist();
  const navigate = useNavigate();
  
  // Get listings from localStorage
  const allListings = JSON.parse(localStorage.getItem("listings") || "[]");
  
  // Filter listings that match favorites ids
  const favoriteListings = allListings.filter((listing: any) => 
    favorites.includes(listing.id)
  );

  return (
    <div className="min-h-screen pb-12">
      <Navigation />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        
        {favoriteListings.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No saved listings yet</h2>
            <p className="text-gray-500 mb-6">
              Start browsing and add items to your wishlist
            </p>
            <button 
              onClick={() => navigate("/")}
              className="text-primary font-medium hover:underline"
            >
              Explore listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteListings.map((listing: any) => (
              <Card key={listing.id} className="overflow-hidden card-hover cursor-pointer" 
                    onClick={() => navigate(`/listing/${listing.id}`)}>
                <CardContent className="p-0 relative">
                  <img
                    src={listing.images?.[0] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60"}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <FavoriteButton listingId={listing.id} />
                  <div className="p-4">
                    <Badge className="mb-2">{listing.category}</Badge>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-2xl font-bold text-primary">${listing.price}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
