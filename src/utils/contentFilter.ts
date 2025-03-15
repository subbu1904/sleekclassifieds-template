
// Function to check for potentially harmful or spam content
export const filterContent = (content: string): { isClean: boolean; reason?: string } => {
  // Convert to lowercase for case-insensitive matching
  const lowerContent = content.toLowerCase();
  
  // List of spam/harmful keywords to filter
  const harmfulKeywords = [
    "viagra", "cialis", "casino", "lottery", "prize", "winner", 
    "free money", "get rich", "bitcoin investment", "crypto offer",
    "nigerian prince", "inheritance", "bank details", "password",
    "credit card number", "social security", "insurance claim"
  ];
  
  // Check for harmful keywords
  for (const keyword of harmfulKeywords) {
    if (lowerContent.includes(keyword)) {
      return { 
        isClean: false, 
        reason: `Content contains potentially inappropriate term: "${keyword}"` 
      };
    }
  }
  
  // Check for excessive punctuation (potential spam)
  const excessivePunctRegex = /[!?]{3,}/;
  if (excessivePunctRegex.test(content)) {
    return { 
      isClean: false, 
      reason: "Content contains excessive punctuation" 
    };
  }
  
  // Check for excessive capitalization (shouting/spam)
  const words = content.split(/\s+/);
  const capsWords = words.filter(word => word.length > 2 && word === word.toUpperCase());
  if (capsWords.length > words.length * 0.5 && words.length > 5) {
    return { 
      isClean: false, 
      reason: "Content contains too many capitalized words" 
    };
  }
  
  // All checks passed
  return { isClean: true };
};

// Rate limiting functions
const rateLimits: Record<string, { count: number, lastReset: number }> = {};

export const checkRateLimit = (userId: string, action: string, limit: number = 5): boolean => {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  
  // Initialize or reset if needed
  if (!rateLimits[key] || now - rateLimits[key].lastReset > hourInMs) {
    rateLimits[key] = { count: 0, lastReset: now };
  }
  
  // Increment count
  rateLimits[key].count += 1;
  
  // Check if over limit
  return rateLimits[key].count <= limit;
};

export const getRateLimitInfo = (userId: string, action: string): { 
  remaining: number, 
  resetInMinutes: number 
} => {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  
  if (!rateLimits[key]) {
    return { remaining: 5, resetInMinutes: 60 };
  }
  
  const timeSinceReset = now - rateLimits[key].lastReset;
  const resetInMs = Math.max(0, hourInMs - timeSinceReset);
  const resetInMinutes = Math.ceil(resetInMs / (60 * 1000));
  
  return {
    remaining: Math.max(0, 5 - rateLimits[key].count),
    resetInMinutes
  };
};
