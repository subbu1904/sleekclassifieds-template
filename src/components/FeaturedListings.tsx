import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/providers/LanguageProvider";
import { useState } from "react";
import { translateText } from "@/utils/translateContent";
import { SocialShare } from "@/components/SocialShare";
import { TranslationToggle } from "@/components/TranslationToggle";

export const FeaturedListings = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [translatedListings, setTranslatedListings] = useState<any[]>([]);
  
  const listings = [
    {
      id: 1,
      title: "Modern Laptop in Excellent Condition",
      title_hi: "उत्कृष्ट स्थिति में आधुनिक लैपटॉप",
      title_bn: "চমৎকার অবস্থায় আধুনিক ল্যাপটপ",
      title_ta: "சிறந்த நிலையில் நவீன லேப்டாப்",
      price: "₹64,999",
      location: "Mumbai, Maharashtra",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60",
      category: t('categories', 'electronics')
    },
    {
      id: 2,
      title: "Professional Camera Kit",
      title_hi: "पेशेवर कैमरा किट",
      title_bn: "পেশাদার ক্যামেরা কিট",
      title_ta: "தொழில்முறை கேமரா கிட்",
      price: "₹89,999",
      location: "Delhi, NCR",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
      category: t('categories', 'photography')
    },
    {
      id: 3,
      title: "Vintage Book Collection",
      title_hi: "विंटेज पुस्तक संग्रह",
      title_bn: "পুরানো বই সংগ্রহ",
      title_ta: "பழைய புத்தக சேகரிப்பு",
      price: "₹12,500",
      location: "Bengaluru, Karnataka",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60",
      category: t('categories', 'books')
    },
    {
      id: 4,
      title: "Modern Office Desk",
      title_hi: "आधुनिक कार्यालय डेस्क",
      title_bn: "আধুনিক অফিস ডেস্ক",
      title_ta: "நவீன அலுவலக மேசை",
      price: "₹22,999",
      location: "Chennai, Tamil Nadu",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
      category: t('categories', 'furniture')
    },
  ];

  const handleTranslationToggle = async (enabled: boolean) => {
    setAutoTranslate(enabled);
    
    if (enabled && translatedListings.length === 0) {
      const translated = await Promise.all(
        listings.map(async (listing) => {
          const translatedTitle = await translateText(listing.title, language);
          return {
            ...listing,
            translatedTitle
          };
        })
      );
      setTranslatedListings(translated);
    }
  };

  const getDisplayTitle = (listing: any) => {
    if (autoTranslate && translatedListings.length > 0) {
      const translatedListing = translatedListings.find(item => item.id === listing.id);
      if (translatedListing?.translatedTitle) {
        return translatedListing.translatedTitle;
      }
    }
    
    if (language === 'hi' && listing.title_hi) return listing.title_hi;
    if (language === 'bn' && listing.title_bn) return listing.title_bn;
    if (language === 'ta' && listing.title_ta) return listing.title_ta;
    return listing.title;
  };
  
  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{t('common', 'featuredListings')}</h2>
          <TranslationToggle 
            onToggle={handleTranslationToggle} 
            initialState={autoTranslate}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card 
              key={listing.id} 
              className="overflow-hidden card-hover cursor-pointer group"
            >
              <CardContent className="p-0 relative">
                <img
                  src={listing.image}
                  alt={getDisplayTitle(listing)}
                  className="w-full h-48 object-cover"
                  onClick={() => navigate(`/listing/${listing.id}`)}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <FavoriteButton listingId={listing.id} />
                  <SocialShare 
                    url={`${window.location.origin}/listing/${listing.id}`}
                    title={getDisplayTitle(listing)}
                    description={`Check out this ${listing.category}: ${getDisplayTitle(listing)}`}
                  />
                </div>
                <div className="p-4" onClick={() => navigate(`/listing/${listing.id}`)}>
                  <Badge className="mb-2">{listing.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {getDisplayTitle(listing)}
                  </h3>
                  <p className="text-2xl font-bold text-primary">{listing.price}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0" onClick={() => navigate(`/listing/${listing.id}`)}>
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
