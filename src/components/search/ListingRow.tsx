
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Listing } from "@/hooks/useListingsFilter";

interface ListingRowProps {
  listing: Listing;
}

export const ListingRow = ({ listing }: ListingRowProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      key={listing.id} 
      className="cursor-pointer overflow-hidden" 
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-48 md:h-auto relative">
          {listing.images && listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No image</p>
            </div>
          )}
          <FavoriteButton listingId={listing.id} className="absolute top-2 right-2" />
        </div>
        <div className="p-4 flex-1">
          <div className="flex justify-between">
            <Badge className="mb-2">{listing.category}</Badge>
            <span className="text-gray-500 text-sm">
              {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-semibold text-xl mb-2">{listing.title}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {listing.location}
            </div>
            <p className="text-2xl font-bold text-primary">${listing.price}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
