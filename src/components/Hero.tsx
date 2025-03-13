
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageProvider";

export const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative h-[500px] flex items-center justify-center bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
          {t('hero', 'title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
          {t('hero', 'description')}
        </p>
        <Button size="lg" className="animate-float">
          {t('hero', 'cta')}
        </Button>
      </div>
    </div>
  );
};
