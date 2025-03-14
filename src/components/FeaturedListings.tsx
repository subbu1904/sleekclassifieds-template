
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/providers/LanguageProvider";

export const FeaturedListings = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const listings = [
    {
      id: 1,
      title: "Modern Laptop in Excellent Condition",
      title_hi: "उत्कृष्ट स्थिति में आधुनिक लैपटॉप",
      title_bn: "চমৎকার অবস্থায় আধুনিক ল্যাপটপ",
      title_ta: "சிறந்த நிலையில் நவீன லேப்டாப்",
      price: "$899",
      location: "San Francisco, CA",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60",
      category: t('categories', 'electronics')
    },
    {
      id: 2,
      title: "Professional Camera Kit",
      title_hi: "पेशेवर कैमरा किट",
      title_bn: "পেশাদার ক্যামেরা কিট",
      title_ta: "தொழில்முறை கேமரா கிட்",
      price: "$1,299",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
      category: t('categories', 'photography')
    },
    {
      id: 3,
      title: "Vintage Book Collection",
      title_hi: "विंटेज पुस्तक संग्रह",
      title_bn: "পুরানো বই সংগ্রহ",
      title_ta: "பழைய புத்தக சேகரிப்பு",
      price: "$299",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60",
      category: t('categories', 'books')
    },
    {
      id: 4,
      title: "Modern Office Desk",
      title_hi: "आधुनिक कार्यालय डेस्क",
      title_bn: "আধুনিক অফিস ডেস্ক",
      title_ta: "நவீன அலுவலக மேசை",
      price: "$449",
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
      category: "Furniture"
    },
  ];

  // Get translated title for each listing
  const getTranslatedTitle = (listing: any) => {
    if (language === 'hi' && listing.title_hi) return listing.title_hi;
    if (language === 'bn' && listing.title_bn) return listing.title_bn;
    if (language === 'ta' && listing.title_ta) return listing.title_ta;
    return listing.title;
  };
  
  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">{t('common', 'featuredListings')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card 
              key={listing.id} 
              className="overflow-hidden card-hover cursor-pointer"
              onClick={() => navigate(`/listing/${listing.id}`)}
            >
              <CardContent className="p-0 relative">
                <img
                  src={listing.image}
                  alt={getTranslatedTitle(listing)}
                  className="w-full h-48 object-cover"
                />
                <FavoriteButton listingId={listing.id} />
                <div className="p-4">
                  <Badge className="mb-2">{listing.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {getTranslatedTitle(listing)}
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
