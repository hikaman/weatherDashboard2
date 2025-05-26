# Weather Recommendation System – Architecture

## 1. System Overview

```mermaid
flowchart TD
    User[User (Browser)]
    SvelteKit[SvelteKit Frontend/Backend]
    OpenMeteo[Open-Meteo API]
    Weaviate[Weaviate Vector Database]
    Embeddings[Transformers Embedding (Xenova)]
    S3[(S3/Cloud Storage)]
    Cron[Node-Cron Importer]

    User <--> |HTTP| SvelteKit
    SvelteKit <--> |REST| OpenMeteo
    SvelteKit <--> |REST| Weaviate
    SvelteKit <--> |local| Embeddings
    Cron --> |Batch| SvelteKit
    SvelteKit <--> |Assets| S3
```

---

## 2. Components & Responsibilities

| Component         | Responsibility                                                        |
|-------------------|-----------------------------------------------------------------------|
| **SvelteKit**     | Frontend, API routing, user interaction, recommendation logic          |
| **Open-Meteo**    | Weather data (hourly, daily, historical)                              |
| **Weaviate**      | Storage & semantic search for weather data, transitions, recommendations|
| **Embeddings**    | Converts weather data/recommendations to vectors (MiniLM, Xenova)      |
| **Node-Cron**     | Scheduled import of weather data/transitions                          |
| **S3/Cloud**      | (Optional) Storage for assets, backups                                |

---

## 3. Data Model (Mermaid Class Diagram)

```mermaid
classDiagram
    class WeatherData {
        string timestamp
        string location
        float temperature
        float precipitation
        float uv_index
        float humidity
        float wind_speed
        int weathercode
        string condition
        float[] vector
    }
    class WeatherTransition {
        string location
        string start_time
        string end_time
        int from_weathercode
        int to_weathercode
        float temperature_change
        float precipitation_change
        float uv_index_change
        string description
        float[] vector
    }
    class Recommendation {
        string category
        object attributes
        string suggestion
        object conditions
        object transition_conditions
        float[] vector
    }
    WeatherData <.. Recommendation : "recommended for"
    WeatherTransition <.. Recommendation : "recommended for"
```

---

## 4. Weather Data Import (Sequence Diagram)

```mermaid
sequenceDiagram
    participant Cron as Node-Cron
    participant SKit as SvelteKit
    participant OM as Open-Meteo
    participant Emb as Embedding
    participant Weav as Weaviate

    Cron->>SKit: Trigger Import
    SKit->>OM: Fetch hourly weather
    OM-->>SKit: Weather data
    SKit->>Emb: Generate Embedding (JSON)
    Emb-->>SKit: Vector
    SKit->>Weav: Store WeatherData (with vector)
    SKit->>Weav: Store WeatherTransition (with vector)
```

---

## 5. Recommendation Query (Sequence Diagram)

```mermaid
sequenceDiagram
    participant User
    participant SKit as SvelteKit
    participant Emb as Embedding
    participant Weav as Weaviate

    User->>SKit: Request (e.g. current weather)
    SKit->>Emb: Embedding for current state
    Emb-->>SKit: Vector
    SKit->>Weav: Query Recommendation (nearVector)
    Weav-->>SKit: Top-N Recommendations
    SKit-->>User: Show recommendations
```

---

## 6. Data Flow Diagram

```mermaid
flowchart LR
    OM[Open-Meteo API] -->|Weather data| SKit[SvelteKit]
    SKit -->|Embedding| Emb[Transformers]
    SKit -->|Objects+Vector| Weav[Weaviate]
    User[User] -->|Request| SKit
    SKit -->|Recommendations| User
```

---

## 7. Deployment Architecture

```mermaid
graph TD
    subgraph Cloud/Server
        SKit[SvelteKit (Node.js)]
        Weav[Weaviate (Docker)]
        Emb[Transformers (Node.js)]
        Cron[Node-Cron]
    end
    User[User (Browser)] --> SKit
    SKit <--> Weav
    SKit <--> Emb
    Cron --> SKit
    SKit <--> OM[Open-Meteo API]
```

---

## 8. Extensibility & AI Feedback

```mermaid
flowchart TD
    User -->|Feedback| SKit
    SKit -->|Store feedback| Weav
    SKit -->|Analyze feedback| Emb
    Emb -->|Model update| SKit
```

---

## 9. Example: Recommendation Query (Mermaid Pseudocode)

```mermaid
graph TD
    WeatherData -->|Embedding| Vector
    Vector -->|nearVector| Weaviate
    Weaviate -->|Top-N Recommendations| SvelteKit
    SvelteKit -->|Display| User
```

---

## 10. Summary

- **SvelteKit** is the central control and UI element.
- **Weaviate** stores all weather data, transitions, and recommendations as vector objects.
- **Embeddings** enable semantic search and AI-powered recommendations.
- **Open-Meteo** provides the raw data.
- **Node-Cron** automates the import.
- **The system is modular, scalable, and open for new weather codes, categories, and AI models.**

---

**Tip:**
You can visualize the Mermaid diagrams directly in Markdown viewers, VSCode plugins, or on [mermaid.live](https://mermaid.live/).

If you need a specific detail diagram (e.g. only recommendation flow, only data model, etc.) or a German version, just ask! 