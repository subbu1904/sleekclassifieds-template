
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, Trash2, FilmIcon } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

interface MediaUploaderProps {
  images: string[];
  videos: string[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
}

export const MediaUploader = ({ images, videos, onImagesChange, onVideosChange }: MediaUploaderProps) => {
  const { t } = useLanguage();
  
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
    onImagesChange([...images, ...newImages]);
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
    onVideosChange([...videos, ...newVideos]);
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };
  
  const removeVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    onVideosChange(newVideos);
  };

  return (
    <>
      <div className="space-y-2">
        <Label>{t('listings', 'images')}</Label>
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
        <p className="text-xs text-gray-500">{t('createListing', 'uploadImages')}</p>
      </div>
      
      <div className="space-y-2">
        <Label>{t('listings', 'videos')}</Label>
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
        <p className="text-xs text-gray-500">{t('createListing', 'uploadVideos')}</p>
      </div>
    </>
  );
};
