
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageProvider";
import { SearchFilters } from "@/components/SearchFilters";
import { useIsMobile } from "@/hooks/use-mobile";

export const Hero = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <div className="relative min-h-[600px] flex flex-col items-center justify-center bg-gradient-to-r from-primary/5 to-primary/10 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50" />
      </div>
      
      <div className="relative max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
          {t('hero', 'title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
          {t('hero', 'description')}
        </p>
      </div>

      <div className="relative w-full max-w-4xl mx-auto z-10 animate-fade-in">
        <SearchFilters 
          isExpanded={!isMobile} 
          onToggleExpand={() => {}} 
        />
      </div>
      
      <div className="relative mt-8">
        <Button size="lg" className="animate-float">
          {t('hero', 'cta')}
        </Button>
      </div>
    </div>
  );
};
