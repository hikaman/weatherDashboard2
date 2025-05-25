# WeatherSync Decision Hub - Architecture Documentation

This document contains the Mermaid diagrams that visualize the key aspects of the WeatherSync Decision Hub system as specified in the PRD.

## System Architecture Diagram

Illustrates how user inputs, Open-Meteo data, and YAML transitions interact within the Decision Hub to generate recommendations.

```mermaid
graph TD
    A[User] --> B[Input Location/Preferences]
    B --> C[Weather Data Fetch (Open-Meteo API)]
    C --> D[Weather State Mapping (YAML)]
    D --> E[Transition Forecast]
    E --> F[Decision Hub]
    F --> G[Wardrobe Advisor]
    F --> H[Fitness Advisor]
    F --> I[Meal Planner]
    F --> J[Adventure Curator]
    G --> K[Clothing Recommendations]
    H --> L[Fitness Recommendations]
    I --> M[Meal Recommendations]
    J --> N[Activity Recommendations]
    K --> O[User Decision]
    L --> O
    M --> O
    N --> O
    O --> P[Feedback Loop]
    P --> A
```

## Data Flow Diagram

Shows how weather data and user preferences are processed to generate recommendations, with feedback improving future outputs.

```mermaid
graph TD
    A[Open-Meteo API] --> B[Weather Data]
    C[User Preferences] --> D[User Profile]
    B --> E[Weather State Mapper]
    D --> E
    E --> F[Transition Forecast]
    F --> G[Decision Engine]
    G --> H[Wardrobe Recommendations]
    G --> I[Fitness Recommendations]
    G --> J[Meal Recommendations]
    G --> K[Activity Recommendations]
    H --> L[User Interface]
    I --> L
    J --> L
    K --> L
    L --> M[User Feedback]
    M --> N[Feedback Processor]
    N --> O[User Profile Update]
    O --> C
```

## User Workflow Diagram

Depicts the user's interaction with the Hub, from setup to decision-making.

```mermaid
graph TD
    A[Start] --> B[Input Location]
    B --> C[Set Preferences]
    C --> D[View Dashboard]
    D --> E[Check Weather Forecast]
    E --> F[Receive Recommendations]
    F --> G[Make Decisions]
    G --> H[Provide Feedback]
    H --> I[End]
    D --> J[Adjust Preferences]
    J --> D
    F --> K[Explore More Options]
    K --> F
```

## Decision-Making Process Diagram

Illustrates how weather data and user context drive recommendations.

```mermaid
graph TD
    A[Weather Data] --> B[Weather State]
    C[User Preferences] --> D[User Context]
    B --> E[Transition Forecast]
    D --> E
    E --> F[Recommendation Engine]
    F --> G[Wardrobe Suggestions]
    F --> H[Fitness Suggestions]
    F --> I[Meal Suggestions]
    F --> J[Activity Suggestions]
    G --> K[User Decision]
    H --> K
    I --> K
    J --> K
```

## Feature Interactions Diagram

Shows how features collaborate to provide a cohesive experience.

```mermaid
graph TD
    A[Transition Forecast] --> B[Wardrobe Advisor]
    A --> C[Fitness Advisor]
    A --> D[Meal Planner]
    A --> E[Adventure Curator]
    B --> F[User Decision]
    C --> F
    D --> F
    E --> F
    F --> G[Feedback]
    G --> H[Improve Recommendations]
    H --> A
```

## E-commerce Integration Flow

Visualizes the e-commerce integration and purchase tracking system.

```mermaid
graph TD
    A[Weather State] --> B[Product Recommendations]
    B --> C[WeatherSync Mini-Shop]
    C --> D[User Clicks Product]
    D --> E[Generate Affiliate Link]
    E --> F[Track Purchase Intent]
    F --> G[Redirect to Store]
    G --> H[User Makes Purchase]
    H --> I[Commission Earned]
    I --> J[Revenue Analytics]
    F --> K[Update User Profile]
    K --> L[Badge System]
    L --> M[Gamification Rewards]
```

## Weather State Transition System

Shows the 16 weather states and their transition relationships.

```mermaid
graph TD
    A[Heatwave] --> B[Hot_Sunny]
    A --> C[Showery]
    B --> A
    B --> C
    D[Sunny] --> B
    D --> E[Cloudy]
    F[Mild] --> D
    F --> E
    G[Cold] --> H[Freezing]
    G --> I[Snowy]
    H --> I
    H --> G
    I --> H
    I --> G
    C --> J[Rainy]
    C --> E
    J --> K[Stormy]
    J --> C
    K --> J
    K --> L[Windy]
    E --> C
    E --> D
    L --> K
    L --> E
    M[Foggy] --> E
    M --> D
    N[Humid] --> C
    N --> B
    O[Dry] --> D
    O --> L
```

## Component Architecture

Shows the relationship between UI components in the application.

```mermaid
graph TD
    A[Dashboard.svelte] --> B[DecisionTimeline.svelte]
    A --> C[WeatherMap.svelte]
    A --> D[WeatherDisplay.svelte]
    A --> E[CitySearch.svelte]
    A --> F[WardrobeSuggestions.svelte]
    A --> G[ExerciseSuggestions.svelte]
    A --> H[FoodSuggestions.svelte]
    A --> I[ActivitySuggestions.svelte]
    A --> J[WeatherSyncMiniShop.svelte]
    A --> K[DecisionJournal.svelte]
    A --> L[WeatherAlerts.svelte]
    
    M[weather.ts Store] --> A
    N[weatherStateMapper.ts] --> M
    O[ecommerce.ts] --> J
    P[weatherStatesData.ts] --> N
```

## API Integration Architecture

Illustrates the integration with external APIs and services.

```mermaid
graph TD
    A[WeatherSync Decision Hub] --> B[Open-Meteo API]
    B --> C[Current Weather]
    B --> D[Hourly Forecast]
    B --> E[Daily Forecast]
    B --> F[Air Quality]
    B --> G[Geocoding]
    
    A --> H[E-commerce APIs]
    H --> I[Amazon Associates]
    H --> J[Nike Affiliate]
    H --> K[Zappos Partner]
    H --> L[Instacart API]
    H --> M[Eventbrite API]
    
    A --> N[Optional Integrations]
    N --> O[Google Calendar]
    N --> P[Strava API]
    N --> Q[Spoonacular]
    N --> R[Google Places]
```

## Gamification System

Shows the badge system and user engagement mechanics.

```mermaid
graph TD
    A[User Actions] --> B[Decision Tracking]
    B --> C[Purchase Tracking]
    B --> D[Activity Completion]
    B --> E[Social Sharing]
    
    C --> F[Badge Evaluation]
    D --> F
    E --> F
    
    F --> G[Weather Wise Badge]
    F --> H[Rainy Explorer Badge]
    F --> I[Fashion Forward Badge]
    F --> J[Fitness Fanatic Badge]
    F --> K[Foodie Forecaster Badge]
    F --> L[Social Butterfly Badge]
    
    G --> M[User Profile Update]
    H --> M
    I --> M
    J --> M
    K --> M
    L --> M
    
    M --> N[Achievement Notification]
    N --> O[Increased Engagement]
```

## Data Storage and Caching

Visualizes the data persistence and caching strategy.

```mermaid
graph TD
    A[User Browser] --> B[localStorage]
    B --> C[Weather Data Cache]
    B --> D[User Preferences]
    B --> E[Purchase History]
    B --> F[Journal Entries]
    B --> G[Badge Progress]
    
    H[Open-Meteo API] --> I[Weather Data]
    I --> J[Cache Check]
    J --> K{Cache Valid?}
    K -->|Yes| L[Return Cached Data]
    K -->|No| M[Fetch New Data]
    M --> N[Update Cache]
    N --> L
    
    O[User Actions] --> P[Real-time Updates]
    P --> B
```

---

These diagrams provide a comprehensive visual overview of the WeatherSync Decision Hub architecture, helping developers understand the system's structure, data flow, and component interactions as specified in the Product Requirements Document. 