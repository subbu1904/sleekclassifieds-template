
import { Car, Home, Camera, Laptop, ShoppingBag, Brush, Book, Music } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Vehicles", icon: Car },
  { name: "Real Estate", icon: Home },
  { name: "Electronics", icon: Laptop },
  { name: "Fashion", icon: ShoppingBag },
  { name: "Art", icon: Brush },
  { name: "Books", icon: Book },
  { name: "Music", icon: Music },
  { name: "Photography", icon: Camera },
];

export const Categories = () => {
  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>
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
