
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Listing {
  id: number;
  title: string;
  price: string;
  category: string;
  createdAt: string;
  location: string;
  images: string[];
}

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      toast.error("Please login to view your listings");
      return;
    }
    
    // Get listings from localStorage
    const allListings = JSON.parse(localStorage.getItem("listings") || "[]");
    const userEmail = JSON.parse(user).email;
    
    // Filter listings by user
    const userListings = allListings.filter(
      (listing: any) => listing.createdBy === userEmail
    );
    
    setListings(userListings);
  }, [navigate]);
  
  const deleteListing = (id: number) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const allListings = JSON.parse(localStorage.getItem("listings") || "[]");
      const updatedListings = allListings.filter((listing: any) => listing.id !== id);
      localStorage.setItem("listings", JSON.stringify(updatedListings));
      
      // Update local state
      setListings(listings.filter(listing => listing.id !== id));
      toast.success("Listing deleted successfully");
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <Button onClick={() => navigate("/create-listing")}>
            <Plus className="mr-2 h-4 w-4" /> New Listing
          </Button>
        </div>
        
        {listings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No listings found</h3>
              <p className="text-gray-500 mb-6">You haven't created any listings yet</p>
              <Button onClick={() => navigate("/create-listing")}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 bg-gray-100">
                    {listing.images && listing.images.length > 0 ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                        <div className="flex items-center space-x-2 mb-4">
                          <Badge>{listing.category}</Badge>
                          <span className="text-gray-500 text-sm">
                            Listed on {formatDate(listing.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">${listing.price}</div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">{listing.location}</div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/edit-listing/${listing.id}`)}
                        >
                          <PencilLine className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteListing(listing.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyListings;
