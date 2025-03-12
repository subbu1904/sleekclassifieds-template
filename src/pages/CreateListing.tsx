import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ImagePlus, Trash2, FilmIcon } from "lucide-react";
import { GeoLocationPicker } from "@/components/GeoLocationPicker";

interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

const categories = [
  "Vehicles",
  "Real Estate",
  "Electronics",
  "Fashion",
  "Art",
  "Books",
  "Music",
  "Photography",
];

const CreateListing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [location, setLocation] = useState<Location>({ address: "" });
  const navigate = useNavigate();
  
  // Check if user is logged in
  const user = localStorage.getItem("user");
  if (!user) {
    navigate("/login");
    toast.error("Please login to create a listing");
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert files to array and create local URLs
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      newImages.push(imageUrl);
    }
    
    // Add to existing images
    setImages([...images, ...newImages]);
  };
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert files to array and create local URLs
    const newVideos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const videoUrl = URL.createObjectURL(file);
      newVideos.push(videoUrl);
    }
    
    // Add to existing videos
    setVideos([...videos, ...newVideos]);
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const removeVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };
  
  const handleLocationSelect = (locationData: Location) => {
    setLocation(locationData);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const listingData = {
      id: Date.now(), // Generate a unique ID
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      condition: formData.get("condition") as string,
      description: formData.get("description") as string,
      location: location.address,
      coordinates: { 
        lat: location.lat,
        lng: location.lng
      },
      images: images,
      videos: videos,
      createdBy: JSON.parse(user!).email,
      createdAt: new Date().toISOString(),
    };
    
    // Simulating saving to backend
    setTimeout(() => {
      // Save to localStorage as a simple demo
      const listings = JSON.parse(localStorage.getItem("listings") || "[]");
      listings.push(listingData);
      localStorage.setItem("listings", JSON.stringify(listings));
      
      setIsLoading(false);
      toast.success("Listing created successfully!");
      navigate("/my-listings");
    }, 1000);
  };
  
  return (
    <div className="min-h-screen pb-12">
      <Navigation />
      <main className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Listing</CardTitle>
            <CardDescription>
              Fill out the form below to list your item for sale
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Listing Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Enter a descriptive title" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="0.00" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Item Condition</Label>
                <RadioGroup name="condition" defaultValue="used" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">New</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="like-new" id="like-new" />
                    <Label htmlFor="like-new">Like New</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="used" id="used" />
                    <Label htmlFor="used">Used</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Describe your item in detail" 
                  className="min-h-32" 
                  required 
                />
              </div>
              
              <GeoLocationPicker 
                onLocationSelect={handleLocationSelect}
                initialAddress={location.address}
              />
              
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-32">
                      <img src={image} alt={`Listing ${index}`} className="w-full h-full object-cover" />
                      <Button 
                        type="button"
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 hover:border-primary transition-colors cursor-pointer">
                    <Label htmlFor="images" className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
                      <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Image</span>
                      <Input 
                        id="images" 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="sr-only" 
                        onChange={handleImageUpload}
                      />
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Upload up to 8 images. First image will be the cover.</p>
              </div>
              
              <div className="space-y-2">
                <Label>Videos</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-32 bg-gray-100">
                      <video src={video} className="w-full h-full object-cover" />
                      <Button 
                        type="button"
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeVideo(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 hover:border-primary transition-colors cursor-pointer">
                    <Label htmlFor="videos" className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
                      <FilmIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Video</span>
                      <Input 
                        id="videos" 
                        type="file" 
                        accept="video/*" 
                        multiple 
                        className="sr-only" 
                        onChange={handleVideoUpload}
                      />
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Upload up to 2 videos (max 30MB each)</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Listing"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateListing;
