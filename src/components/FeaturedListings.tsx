
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const listings = [
  {
    id: 1,
    title: "Modern Laptop in Excellent Condition",
    price: "$899",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60",
    category: "Electronics"
  },
  {
    id: 2,
    title: "Professional Camera Kit",
    price: "$1,299",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
    category: "Photography"
  },
  {
    id: 3,
    title: "Vintage Book Collection",
    price: "$299",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60",
    category: "Books"
  },
  {
    id: 4,
    title: "Modern Office Desk",
    price: "$449",
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
    category: "Furniture"
  },
];

export const FeaturedListings = () => {
  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden card-hover">
              <CardContent className="p-0">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <Badge className="mb-2">{listing.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-2xl font-bold text-primary">{listing.price}</p>
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
      </div>
    </div>
  );
};
