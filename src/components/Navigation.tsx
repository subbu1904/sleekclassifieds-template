
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="w-full px-6 py-4 glass fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-2xl font-semibold text-primary">
          Classifieds
        </a>
        
        <div className="flex items-center space-x-4 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10 w-full" 
              placeholder="Search listings..."
              type="search"
            />
          </div>
        </div>

        <Button className="flex items-center gap-2">
          <PlusCircle size={20} />
          Post Ad
        </Button>
      </div>
    </nav>
  );
};
