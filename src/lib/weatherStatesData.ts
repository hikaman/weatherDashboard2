// Weather states data structure
export interface WeatherStateTransition {
  to: string;
  likelihood: 'Common' | 'Plausible' | 'Less_Likely';
  description: string;
  clothing: string;
  forecast_strings: string[];
  fitness_suggestions: string;
  meal_suggestions: string;
  activity_suggestions: string;
}

export interface WeatherStateData {
  description: string;
  transitions: WeatherStateTransition[];
}

export interface WeatherStatesConfig {
  weather_states: Record<string, WeatherStateData>;
}

// Weather states data (converted from YAML)
export const weatherStatesData: WeatherStatesConfig = {
  weather_states: {
    Heatwave: {
      description: "Extreme heat with temperatures above 35°C",
      transitions: [
        {
          to: "Showery",
          likelihood: "Common",
          description: "Heat-driven instability causes scattered showers",
          clothing: "Light rain jacket, quick-dry clothing, and a cap",
          forecast_strings: [
            "Scattered showers sprinkle through the heatwave tomorrow",
            "Heat-driven thunderstorms may develop"
          ],
          fitness_suggestions: "Indoor yoga, swimming, early morning runs",
          meal_suggestions: "Cold gazpacho, fruit salads, iced beverages",
          activity_suggestions: "Indoor museums, air-conditioned shopping, pool activities"
        },
        {
          to: "Hot_Sunny",
          likelihood: "Plausible",
          description: "Continued extreme heat with clear skies",
          clothing: "Lightweight breathable fabrics, wide-brimmed hat, sunglasses",
          forecast_strings: [
            "Relentless heat continues with blazing sunshine"
          ],
          fitness_suggestions: "Early morning or late evening outdoor activities",
          meal_suggestions: "Light salads, smoothies, hydrating foods",
          activity_suggestions: "Beach visits, water parks, shaded outdoor events"
        }
      ]
    },
    Hot_Sunny: {
      description: "Hot and sunny conditions, 25-35°C",
      transitions: [
        {
          to: "Heatwave",
          likelihood: "Plausible",
          description: "Temperature rises to extreme levels",
          clothing: "Ultra-light clothing, cooling accessories",
          forecast_strings: [
            "Scorching heat wave approaches"
          ],
          fitness_suggestions: "Indoor activities, water sports",
          meal_suggestions: "Frozen treats, cold soups",
          activity_suggestions: "Indoor venues, water activities"
        },
        {
          to: "Showery",
          likelihood: "Common",
          description: "Afternoon thunderstorms develop",
          clothing: "Light rain jacket, breathable layers",
          forecast_strings: [
            "Afternoon showers interrupt the sunshine"
          ],
          fitness_suggestions: "Flexible indoor/outdoor plans",
          meal_suggestions: "Light meals, warm beverages for rain",
          activity_suggestions: "Indoor backup plans, covered venues"
        }
      ]
    },
    Showery: {
      description: "Intermittent light rain and showers",
      transitions: [
        {
          to: "Rainy",
          likelihood: "Common",
          description: "Showers intensify to steady rain",
          clothing: "Waterproof jacket, rain boots, umbrella",
          forecast_strings: [
            "Light showers develop into steady rainfall"
          ],
          fitness_suggestions: "Indoor workouts, yoga, gym sessions",
          meal_suggestions: "Warm soups, hot beverages, comfort food",
          activity_suggestions: "Museums, indoor markets, cozy cafes"
        },
        {
          to: "Cloudy",
          likelihood: "Plausible",
          description: "Clouds remain but rain stops",
          clothing: "Light jacket, layers for changing conditions",
          forecast_strings: [
            "Showers clear leaving overcast skies"
          ],
          fitness_suggestions: "Outdoor walks, light jogging",
          meal_suggestions: "Seasonal comfort foods",
          activity_suggestions: "Outdoor markets, walking tours"
        }
      ]
    },
    Rainy: {
      description: "Steady, continuous rainfall",
      transitions: [
        {
          to: "Stormy",
          likelihood: "Plausible",
          description: "Rain intensifies with strong winds",
          clothing: "Heavy rain gear, waterproof boots, storm jacket",
          forecast_strings: [
            "Rain strengthens into stormy conditions"
          ],
          fitness_suggestions: "Indoor gym, home workouts, swimming pools",
          meal_suggestions: "Hearty stews, hot chocolate, warming spices",
          activity_suggestions: "Indoor entertainment, libraries, cooking classes"
        },
        {
          to: "Showery",
          likelihood: "Common",
          description: "Steady rain breaks into intermittent showers",
          clothing: "Light rain jacket, quick-dry materials",
          forecast_strings: [
            "Steady rain eases to scattered showers"
          ],
          fitness_suggestions: "Indoor activities with outdoor options",
          meal_suggestions: "Light soups, warm drinks",
          activity_suggestions: "Flexible indoor/outdoor plans"
        }
      ]
    },
    Stormy: {
      description: "Heavy rain with strong winds and possible thunder",
      transitions: [
        {
          to: "Rainy",
          likelihood: "Common",
          description: "Storm weakens to steady rain",
          clothing: "Waterproof layers, secure rain gear",
          forecast_strings: [
            "Storm conditions ease to steady rainfall"
          ],
          fitness_suggestions: "Indoor activities only",
          meal_suggestions: "Comfort foods, hot meals",
          activity_suggestions: "Stay indoors, home activities"
        },
        {
          to: "Windy",
          likelihood: "Plausible",
          description: "Rain stops but strong winds continue",
          clothing: "Windproof jacket, secure accessories",
          forecast_strings: [
            "Storm clears but winds remain strong"
          ],
          fitness_suggestions: "Indoor workouts, avoid outdoor activities",
          meal_suggestions: "Warming foods, hot beverages",
          activity_suggestions: "Indoor venues, avoid outdoor events"
        }
      ]
    },
    Cloudy: {
      description: "Overcast skies with no precipitation",
      transitions: [
        {
          to: "Showery",
          likelihood: "Common",
          description: "Clouds develop into light showers",
          clothing: "Light jacket, umbrella just in case",
          forecast_strings: [
            "Overcast skies may bring light showers"
          ],
          fitness_suggestions: "Outdoor activities with indoor backup",
          meal_suggestions: "Seasonal comfort foods",
          activity_suggestions: "Outdoor events with covered areas"
        },
        {
          to: "Sunny",
          likelihood: "Plausible",
          description: "Clouds clear revealing sunshine",
          clothing: "Layers for changing conditions",
          forecast_strings: [
            "Clouds part to reveal sunny skies"
          ],
          fitness_suggestions: "Outdoor activities, hiking, cycling",
          meal_suggestions: "Fresh salads, outdoor dining",
          activity_suggestions: "Outdoor markets, festivals, sports"
        }
      ]
    },
    Sunny: {
      description: "Clear skies with bright sunshine, 15-25°C",
      transitions: [
        {
          to: "Hot_Sunny",
          likelihood: "Common",
          description: "Temperature rises significantly",
          clothing: "Lighter fabrics, sun protection",
          forecast_strings: [
            "Sunshine intensifies with rising temperatures"
          ],
          fitness_suggestions: "Morning or evening outdoor activities",
          meal_suggestions: "Light meals, cold beverages",
          activity_suggestions: "Outdoor festivals, beach visits"
        },
        {
          to: "Cloudy",
          likelihood: "Plausible",
          description: "Clouds move in covering the sun",
          clothing: "Light layers for changing conditions",
          forecast_strings: [
            "Clouds gather dimming the sunshine"
          ],
          fitness_suggestions: "Outdoor activities while conditions last",
          meal_suggestions: "Seasonal foods",
          activity_suggestions: "Outdoor events, nature walks"
        }
      ]
    },
    Windy: {
      description: "Strong winds with clear or partly cloudy skies",
      transitions: [
        {
          to: "Stormy",
          likelihood: "Plausible",
          description: "Winds bring storm clouds",
          clothing: "Windproof and waterproof layers",
          forecast_strings: [
            "Strong winds usher in stormy weather"
          ],
          fitness_suggestions: "Indoor activities, avoid outdoor sports",
          meal_suggestions: "Warming foods, hot drinks",
          activity_suggestions: "Indoor venues, secure outdoor events"
        },
        {
          to: "Cloudy",
          likelihood: "Common",
          description: "Winds calm down, clouds remain",
          clothing: "Light jacket, comfortable layers",
          forecast_strings: [
            "Winds subside leaving overcast conditions"
          ],
          fitness_suggestions: "Outdoor activities resume",
          meal_suggestions: "Seasonal comfort foods",
          activity_suggestions: "Outdoor markets, walking tours"
        }
      ]
    },
    Foggy: {
      description: "Dense fog reducing visibility",
      transitions: [
        {
          to: "Cloudy",
          likelihood: "Common",
          description: "Fog lifts revealing overcast skies",
          clothing: "Layers for changing visibility and temperature",
          forecast_strings: [
            "Morning fog clears to cloudy conditions"
          ],
          fitness_suggestions: "Indoor activities until visibility improves",
          meal_suggestions: "Warm beverages, comfort foods",
          activity_suggestions: "Indoor venues, delayed outdoor plans"
        },
        {
          to: "Sunny",
          likelihood: "Plausible",
          description: "Fog burns off revealing sunshine",
          clothing: "Layers that can be removed as fog clears",
          forecast_strings: [
            "Fog lifts revealing bright sunshine"
          ],
          fitness_suggestions: "Outdoor activities once fog clears",
          meal_suggestions: "Fresh foods, outdoor dining",
          activity_suggestions: "Outdoor events, nature activities"
        }
      ]
    },
    Cold: {
      description: "Cold temperatures, 0-10°C, clear or partly cloudy",
      transitions: [
        {
          to: "Freezing",
          likelihood: "Plausible",
          description: "Temperature drops below freezing",
          clothing: "Heavy winter coat, thermal layers, gloves",
          forecast_strings: [
            "Cold conditions intensify to freezing"
          ],
          fitness_suggestions: "Indoor workouts, heated gyms",
          meal_suggestions: "Hot soups, warming spices, hot beverages",
          activity_suggestions: "Indoor entertainment, heated venues"
        },
        {
          to: "Snowy",
          likelihood: "Common",
          description: "Cold air brings snow",
          clothing: "Winter coat, waterproof boots, warm accessories",
          forecast_strings: [
            "Cold temperatures bring snowfall"
          ],
          fitness_suggestions: "Winter sports, indoor activities",
          meal_suggestions: "Hearty stews, hot chocolate",
          activity_suggestions: "Winter festivals, indoor venues"
        }
      ]
    },
    Freezing: {
      description: "Below freezing temperatures, under 0°C",
      transitions: [
        {
          to: "Snowy",
          likelihood: "Common",
          description: "Freezing conditions bring snow",
          clothing: "Heavy winter gear, multiple layers, face protection",
          forecast_strings: [
            "Freezing temperatures trigger snowfall"
          ],
          fitness_suggestions: "Indoor activities only, heated gyms",
          meal_suggestions: "Hot meals, warming foods, hot drinks",
          activity_suggestions: "Indoor venues, winter sports facilities"
        },
        {
          to: "Cold",
          likelihood: "Plausible",
          description: "Temperature rises slightly above freezing",
          clothing: "Warm winter coat, layers",
          forecast_strings: [
            "Freezing conditions moderate to cold"
          ],
          fitness_suggestions: "Indoor workouts, brief outdoor activities",
          meal_suggestions: "Warm comfort foods",
          activity_suggestions: "Indoor entertainment, brief outdoor visits"
        }
      ]
    },
    Snowy: {
      description: "Active snowfall with cold temperatures",
      transitions: [
        {
          to: "Freezing",
          likelihood: "Common",
          description: "Snow stops but freezing conditions remain",
          clothing: "Heavy winter gear, ice-appropriate footwear",
          forecast_strings: [
            "Snowfall ends leaving icy conditions"
          ],
          fitness_suggestions: "Indoor activities, winter sports",
          meal_suggestions: "Hot meals, warming beverages",
          activity_suggestions: "Indoor venues, winter activities"
        },
        {
          to: "Cold",
          likelihood: "Plausible",
          description: "Snow stops and temperature moderates",
          clothing: "Warm coat, waterproof boots",
          forecast_strings: [
            "Snow clears with moderating temperatures"
          ],
          fitness_suggestions: "Outdoor winter activities, indoor workouts",
          meal_suggestions: "Seasonal comfort foods",
          activity_suggestions: "Winter outdoor events, indoor venues"
        }
      ]
    },
    Humid: {
      description: "High humidity with warm temperatures",
      transitions: [
        {
          to: "Showery",
          likelihood: "Common",
          description: "Humidity leads to shower development",
          clothing: "Breathable fabrics, light rain protection",
          forecast_strings: [
            "Humid conditions trigger afternoon showers"
          ],
          fitness_suggestions: "Indoor air-conditioned activities",
          meal_suggestions: "Light meals, hydrating foods",
          activity_suggestions: "Indoor venues, covered outdoor areas"
        },
        {
          to: "Hot_Sunny",
          likelihood: "Plausible",
          description: "Humidity combines with intense heat",
          clothing: "Ultra-breathable fabrics, cooling accessories",
          forecast_strings: [
            "Humid heat intensifies to sweltering conditions"
          ],
          fitness_suggestions: "Early morning activities, swimming",
          meal_suggestions: "Cold foods, electrolyte drinks",
          activity_suggestions: "Air-conditioned venues, water activities"
        }
      ]
    },
    Mild: {
      description: "Pleasant moderate temperatures, 10-20°C",
      transitions: [
        {
          to: "Sunny",
          likelihood: "Common",
          description: "Mild conditions become sunny and bright",
          clothing: "Comfortable layers, light jacket option",
          forecast_strings: [
            "Mild weather brightens with sunshine"
          ],
          fitness_suggestions: "Perfect for all outdoor activities",
          meal_suggestions: "Fresh seasonal foods, outdoor dining",
          activity_suggestions: "Outdoor festivals, hiking, cycling"
        },
        {
          to: "Cloudy",
          likelihood: "Plausible",
          description: "Clouds move in over mild temperatures",
          clothing: "Light layers, jacket for comfort",
          forecast_strings: [
            "Mild conditions turn overcast"
          ],
          fitness_suggestions: "Outdoor activities, indoor backup plans",
          meal_suggestions: "Seasonal comfort foods",
          activity_suggestions: "Outdoor markets, covered events"
        }
      ]
    },
    Dry: {
      description: "Very low humidity with clear skies",
      transitions: [
        {
          to: "Sunny",
          likelihood: "Common",
          description: "Dry conditions with bright sunshine",
          clothing: "Moisturizing skincare, comfortable fabrics",
          forecast_strings: [
            "Dry air continues with bright sunshine"
          ],
          fitness_suggestions: "Outdoor activities with hydration focus",
          meal_suggestions: "Hydrating foods, plenty of fluids",
          activity_suggestions: "Outdoor events, desert activities"
        },
        {
          to: "Windy",
          likelihood: "Plausible",
          description: "Dry air becomes windy",
          clothing: "Windproof layers, eye protection",
          forecast_strings: [
            "Dry conditions turn breezy and windy"
          ],
          fitness_suggestions: "Indoor activities, wind-protected outdoor areas",
          meal_suggestions: "Hydrating foods, warm beverages",
          activity_suggestions: "Indoor venues, sheltered outdoor events"
        }
      ]
    }
  }
}; 