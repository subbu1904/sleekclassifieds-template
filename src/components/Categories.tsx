
import { Car, Home, Camera, Laptop, ShoppingBag, Brush, Book, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

export const Categories = () => {
  const { t } = useLanguage();

  const categories = [
    { name: t('categories', 'vehicles'), icon: Car },
    { name: t('categories', 'realEstate'), icon: Home },
    { name: t('categories', 'electronics'), icon: Laptop },
    { name: t('categories', 'fashion'), icon: ShoppingBag },
    { name: t('categories', 'art'), icon: Brush },
    { name: t('categories', 'books'), icon: Book },
    { name: t('categories', 'music'), icon: Music },
    { name: t('categories', 'photography'), icon: Camera },
  ];

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">{t('categories', 'browseCategories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              className={cn(
                "flex flex-col items-center p-4 rounded-xl card-hover",
                "bg-white border border-gray-100",
                "hover:border-primary/20"
              )}
            >
              <category.icon className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium">{category.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
