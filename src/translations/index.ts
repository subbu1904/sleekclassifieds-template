
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

export const translations = {
  en,
  es,
  fr
};

export type SupportedLanguage = keyof typeof translations;
export type TranslationKey = keyof typeof en;

// Add additional translation texts for social login and search bar
if (!en.auth.orContinueWith) {
  en.auth.orContinueWith = "or continue with";
  es.auth.orContinueWith = "o continuar con";
  fr.auth.orContinueWith = "ou continuer avec";
}

if (!en.auth.loggingIn) {
  en.auth.loggingIn = "Logging in...";
  es.auth.loggingIn = "Iniciando sesión...";
  fr.auth.loggingIn = "Connexion en cours...";
}

if (!en.auth.login) {
  en.auth.login = "Login";
  es.auth.login = "Iniciar sesión";
  fr.auth.login = "Connexion";
}

if (!en.auth.welcomeBack) {
  en.auth.welcomeBack = "Welcome back to our marketplace";
  es.auth.welcomeBack = "Bienvenido de nuevo a nuestro marketplace";
  fr.auth.welcomeBack = "Bienvenue à notre marché";
}

if (!en.search) {
  en.search = {
    searchPlaceholder: "Search listings...",
    category: "Category",
    allCategories: "All Categories",
    search: "Search",
    priceRange: "Price Range",
    location: "Location",
    locationPlaceholder: "City, State",
    condition: "Condition",
    anyCondition: "Any condition",
    new: "New",
    likeNew: "Like New",
    used: "Used",
    showOnlyWithImages: "Show only listings with images"
  };
  
  es.search = {
    searchPlaceholder: "Buscar anuncios...",
    category: "Categoría",
    allCategories: "Todas las categorías",
    search: "Buscar",
    priceRange: "Rango de precios",
    location: "Ubicación",
    locationPlaceholder: "Ciudad, Estado",
    condition: "Condición",
    anyCondition: "Cualquier condición",
    new: "Nuevo",
    likeNew: "Como nuevo",
    used: "Usado",
    showOnlyWithImages: "Mostrar solo anuncios con imágenes"
  };
  
  fr.search = {
    searchPlaceholder: "Rechercher des annonces...",
    category: "Catégorie",
    allCategories: "Toutes les catégories",
    search: "Rechercher",
    priceRange: "Gamme de prix",
    location: "Emplacement",
    locationPlaceholder: "Ville, État",
    condition: "État",
    anyCondition: "Toute condition",
    new: "Neuf",
    likeNew: "Comme neuf",
    used: "Utilisé",
    showOnlyWithImages: "Afficher uniquement les annonces avec images"
  };
}

if (!en.auth.dontHaveAccount) {
  en.auth.dontHaveAccount = "Don't have an account?";
  es.auth.dontHaveAccount = "¿No tienes una cuenta?";
  fr.auth.dontHaveAccount = "Vous n'avez pas de compte?";
}

if (!en.auth.registerHere) {
  en.auth.registerHere = "Register here";
  es.auth.registerHere = "Regístrate aquí";
  fr.auth.registerHere = "Inscrivez-vous ici";
}
