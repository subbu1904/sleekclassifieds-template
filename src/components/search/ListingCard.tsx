
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ListingCardProps {
  listing: any;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      key={listing.id} 
      className="overflow-hidden card-hover cursor-pointer" 
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <CardContent className="p-0 relative">
        {listing.images && listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image</p>
          </div>
        )}
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
  );
};
