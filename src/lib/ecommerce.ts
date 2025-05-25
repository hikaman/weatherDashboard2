// E-commerce integration for WeatherSync Decision Hub
// Handles affiliate links, product recommendations, and purchase tracking

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  affiliateLink: string;
  store: 'amazon' | 'zappos' | 'nike' | 'instacart' | 'eventbrite';
  category: 'wardrobe' | 'fitness' | 'food' | 'activity';
  weatherSuitability: string[];
}

export interface PurchaseEvent {
  productId: string;
  productName: string;
  store: string;
  price?: string;
  timestamp: string;
  weatherState: string;
  category: string;
}

// Store configurations with affiliate tracking
const storeConfigs = {
  amazon: {
    baseUrl: 'https://amazon.com',
    affiliateTag: 'weathersync-20', // Example affiliate tag
    searchUrl: (query: string) => `https://amazon.com/s?k=${encodeURIComponent(query)}&tag=weathersync-20`
  },
  zappos: {
    baseUrl: 'https://zappos.com',
    affiliateTag: 'weathersync',
    searchUrl: (query: string) => `https://zappos.com/search?term=${encodeURIComponent(query)}`
  },
  nike: {
    baseUrl: 'https://nike.com',
    affiliateTag: 'weathersync',
    searchUrl: (query: string) => `https://nike.com/search?q=${encodeURIComponent(query)}`
  },
  instacart: {
    baseUrl: 'https://instacart.com',
    affiliateTag: 'weathersync',
    searchUrl: (query: string) => `https://instacart.com/store/search?query=${encodeURIComponent(query)}`
  },
  eventbrite: {
    baseUrl: 'https://eventbrite.com',
    affiliateTag: 'weathersync',
    searchUrl: (query: string) => `https://eventbrite.com/d/online/search/?q=${encodeURIComponent(query)}`
  }
};

// Weather-specific product recommendations
export const weatherProductMap: Record<string, Product[]> = {
  'Showery': [
    {
      id: 'rain-jacket-1',
      name: 'Lightweight Rain Jacket',
      description: 'Waterproof and breathable for showery weather',
      price: '$49.99',
      affiliateLink: storeConfigs.amazon.searchUrl('lightweight rain jacket'),
      store: 'amazon',
      category: 'wardrobe',
      weatherSuitability: ['Showery', 'Rainy']
    },
    {
      id: 'yoga-mat-1',
      name: 'Premium Yoga Mat',
      description: 'Perfect for indoor workouts during rainy weather',
      price: '$39.99',
      affiliateLink: storeConfigs.nike.searchUrl('yoga mat'),
      store: 'nike',
      category: 'fitness',
      weatherSuitability: ['Showery', 'Rainy', 'Stormy']
    },
    {
      id: 'soup-ingredients',
      name: 'Soup Ingredients Bundle',
      description: 'Warm comfort food for showery days',
      price: '$15.99',
      affiliateLink: storeConfigs.instacart.searchUrl('soup ingredients'),
      store: 'instacart',
      category: 'food',
      weatherSuitability: ['Showery', 'Rainy', 'Cold']
    }
  ],
  'Hot_Sunny': [
    {
      id: 'breathable-shirt-1',
      name: 'Moisture-Wicking T-Shirt',
      description: 'Stay cool in hot sunny weather',
      price: '$24.99',
      affiliateLink: storeConfigs.nike.searchUrl('moisture wicking shirt'),
      store: 'nike',
      category: 'wardrobe',
      weatherSuitability: ['Hot_Sunny', 'Heatwave']
    },
    {
      id: 'running-shorts-1',
      name: 'Lightweight Running Shorts',
      description: 'Perfect for hot weather workouts',
      price: '$29.99',
      affiliateLink: storeConfigs.nike.searchUrl('running shorts'),
      store: 'nike',
      category: 'fitness',
      weatherSuitability: ['Hot_Sunny', 'Heatwave', 'Sunny']
    },
    {
      id: 'cold-beverages',
      name: 'Refreshing Cold Beverages',
      description: 'Stay hydrated in the heat',
      price: '$12.99',
      affiliateLink: storeConfigs.instacart.searchUrl('cold beverages'),
      store: 'instacart',
      category: 'food',
      weatherSuitability: ['Hot_Sunny', 'Heatwave']
    }
  ],
  'Cold': [
    {
      id: 'winter-coat-1',
      name: 'Warm Winter Coat',
      description: 'Essential protection for cold weather',
      price: '$89.99',
      affiliateLink: storeConfigs.amazon.searchUrl('winter coat'),
      store: 'amazon',
      category: 'wardrobe',
      weatherSuitability: ['Cold', 'Freezing', 'Snowy']
    },
    {
      id: 'thermal-layers-1',
      name: 'Thermal Base Layers',
      description: 'Stay warm during cold weather activities',
      price: '$34.99',
      affiliateLink: storeConfigs.amazon.searchUrl('thermal base layers'),
      store: 'amazon',
      category: 'fitness',
      weatherSuitability: ['Cold', 'Freezing', 'Snowy']
    }
  ],
  'Sunny': [
    {
      id: 'sunglasses-1',
      name: 'UV Protection Sunglasses',
      description: 'Essential eye protection for sunny days',
      price: '$19.99',
      affiliateLink: storeConfigs.amazon.searchUrl('UV sunglasses'),
      store: 'amazon',
      category: 'wardrobe',
      weatherSuitability: ['Sunny', 'Hot_Sunny']
    },
    {
      id: 'outdoor-gear-1',
      name: 'Outdoor Activity Gear',
      description: 'Perfect for sunny day adventures',
      price: '$45.99',
      affiliateLink: storeConfigs.nike.searchUrl('outdoor gear'),
      store: 'nike',
      category: 'fitness',
      weatherSuitability: ['Sunny', 'Mild']
    }
  ]
};

// Get product recommendations for weather state
export function getProductRecommendations(
  weatherState: string,
  category?: 'wardrobe' | 'fitness' | 'food' | 'activity',
  limit: number = 3
): Product[] {
  const products = weatherProductMap[weatherState] || [];
  
  let filtered = products;
  if (category) {
    filtered = products.filter(p => p.category === category);
  }
  
  return filtered.slice(0, limit);
}

// Generate affiliate link with tracking
export function generateAffiliateLink(
  store: keyof typeof storeConfigs,
  productQuery: string,
  additionalParams?: Record<string, string>
): string {
  const config = storeConfigs[store];
  let url = config.searchUrl(productQuery);
  
  // Add additional tracking parameters
  if (additionalParams) {
    const params = new URLSearchParams(additionalParams);
    url += (url.includes('?') ? '&' : '?') + params.toString();
  }
  
  // Add timestamp for tracking
  url += (url.includes('?') ? '&' : '?') + `utm_source=weathersync&utm_medium=app&utm_campaign=weather_decision&timestamp=${Date.now()}`;
  
  return url;
}

// Track purchase event
export function trackPurchase(purchase: PurchaseEvent): void {
  try {
    // Store in localStorage for analytics
    const purchases = JSON.parse(localStorage.getItem('weathersync_purchases') || '[]');
    purchases.push(purchase);
    localStorage.setItem('weathersync_purchases', JSON.stringify(purchases));
    
    // In a real implementation, this would also send to analytics service
    console.log('Purchase tracked:', purchase);
  } catch (error) {
    console.error('Error tracking purchase:', error);
  }
}

// Get purchase history
export function getPurchaseHistory(): PurchaseEvent[] {
  try {
    return JSON.parse(localStorage.getItem('weathersync_purchases') || '[]');
  } catch (error) {
    console.error('Error loading purchase history:', error);
    return [];
  }
}

// Generate contextual shopping recommendations
export function generateShoppingRecommendations(
  weatherState: string,
  userPreferences?: {
    style?: string;
    fitnessLevel?: string;
    dietaryRestrictions?: string[];
    budget?: 'low' | 'medium' | 'high';
  }
): {
  wardrobe: Product[];
  fitness: Product[];
  food: Product[];
  activity: Product[];
} {
  const allProducts = getProductRecommendations(weatherState, undefined, 10);
  
  return {
    wardrobe: allProducts.filter(p => p.category === 'wardrobe').slice(0, 2),
    fitness: allProducts.filter(p => p.category === 'fitness').slice(0, 2),
    food: allProducts.filter(p => p.category === 'food').slice(0, 2),
    activity: allProducts.filter(p => p.category === 'activity').slice(0, 2)
  };
}

// Create WeatherSync Mini-Shop data
export function getMiniShopData(weatherState: string): {
  categories: Array<{
    name: string;
    emoji: string;
    products: Product[];
  }>;
} {
  const recommendations = generateShoppingRecommendations(weatherState);
  
  return {
    categories: [
      {
        name: `${weatherState} Essentials`,
        emoji: getWeatherEmoji(weatherState),
        products: [
          ...recommendations.wardrobe,
          ...recommendations.fitness,
          ...recommendations.food
        ].slice(0, 6)
      },
      {
        name: 'Wardrobe',
        emoji: '👗',
        products: recommendations.wardrobe
      },
      {
        name: 'Fitness',
        emoji: '💪',
        products: recommendations.fitness
      },
      {
        name: 'Food & Dining',
        emoji: '🍽️',
        products: recommendations.food
      }
    ]
  };
}

// Helper function to get weather emoji
function getWeatherEmoji(weatherState: string): string {
  const emojiMap: Record<string, string> = {
    'Heatwave': '🔥',
    'Hot_Sunny': '☀️',
    'Sunny': '🌞',
    'Mild': '🌤️',
    'Cloudy': '☁️',
    'Showery': '🌦️',
    'Rainy': '🌧️',
    'Stormy': '⛈️',
    'Windy': '💨',
    'Foggy': '🌫️',
    'Cold': '🥶',
    'Freezing': '🧊',
    'Snowy': '❄️',
    'Humid': '💧',
    'Dry': '🏜️'
  };
  return emojiMap[weatherState] || '🌡️';
}

// Revenue tracking for business metrics
export function calculateRevenue(): {
  totalPurchases: number;
  estimatedCommission: number;
  topCategories: Array<{ category: string; count: number; }>;
  topStores: Array<{ store: string; count: number; }>;
} {
  const purchases = getPurchaseHistory();
  
  // Estimate commission (typical affiliate rates)
  const commissionRates = {
    amazon: 0.04,    // 4%
    zappos: 0.06,    // 6%
    nike: 0.05,      // 5%
    instacart: 0.03, // 3%
    eventbrite: 0.08 // 8%
  };
  
  let estimatedCommission = 0;
  const categoryCount: Record<string, number> = {};
  const storeCount: Record<string, number> = {};
  
  purchases.forEach(purchase => {
    // Estimate commission
    if (purchase.price) {
      const price = parseFloat(purchase.price.replace(/[^0-9.]/g, ''));
      const rate = commissionRates[purchase.store as keyof typeof commissionRates] || 0.04;
      estimatedCommission += price * rate;
    }
    
    // Count categories and stores
    categoryCount[purchase.category] = (categoryCount[purchase.category] || 0) + 1;
    storeCount[purchase.store] = (storeCount[purchase.store] || 0) + 1;
  });
  
  return {
    totalPurchases: purchases.length,
    estimatedCommission,
    topCategories: Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
    topStores: Object.entries(storeCount)
      .map(([store, count]) => ({ store, count }))
      .sort((a, b) => b.count - a.count)
  };
} 