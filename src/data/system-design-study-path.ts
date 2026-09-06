export type SystemDesignQuestion = {
  id: number;
  question: string;
  difficulty: string;
  topicPattern: string;
  whatInterviewerTests: string;
  exampleInput: string;
  expectedOutput: string;
  constraints: string;
  hint: string;
};

export type SystemDesignLevel = {
  level: number;
  title: string;
  difficulty: string;
  questions: SystemDesignQuestion[];
};

export const SYSTEM_DESIGN_LEVELS: SystemDesignLevel[] = [
  {
    level: 1,
    title: "Very Easy",
    difficulty: "Very Easy",
    questions: [
      {
        id: 1,
        question:
          "Design a URL shortener service like bit.ly. How would you generate short URLs and handle redirects?",
        difficulty: "Very Easy",
        topicPattern: "Fundamentals / Hashing",
        whatInterviewerTests: "Understanding of hashing, base62 encoding, and HTTP redirects.",
        exampleInput: "Long URL: https://example.com/very/long/path",
        expectedOutput: "Short URL: https://bit.ly/abc123",
        constraints: "Must generate unique short URLs and handle 1B+ URLs.",
        hint: "Use base62 encoding of auto-increment IDs or hash of original URL.",
      },
      {
        id: 2,
        question:
          "Design a rate limiter API. How would you limit API requests per user to prevent abuse?",
        difficulty: "Very Easy",
        topicPattern: "Rate Limiting / Algorithms",
        whatInterviewerTests: "Knowledge of rate limiting algorithms and distributed systems.",
        exampleInput: "User makes 100 requests in 1 minute, limit is 50",
        expectedOutput: "Requests after 50th should be rejected with 429 status.",
        constraints: "Must work across multiple servers.",
        hint: "Consider token bucket, sliding window, or fixed window algorithms.",
      },
      {
        id: 3,
        question:
          "Design a key-value store like Redis. What data structures would you use and how would you persist data?",
        difficulty: "Very Easy",
        topicPattern: "Data Structures / Storage",
        whatInterviewerTests: "Understanding of in-memory storage and persistence strategies.",
        exampleInput: "Set and get operations on keys",
        expectedOutput: "Fast O(1) lookups and updates with optional persistence.",
        constraints: "Must handle millions of keys efficiently.",
        hint: "Use hash tables for O(1) operations and append-only files for persistence.",
      },
      {
        id: 4,
        question:
          "Design a web crawler that can fetch and parse web pages systematically. How would you ensure it doesn't revisit URLs?",
        difficulty: "Very Easy",
        topicPattern: "Crawling / Graph Traversal",
        whatInterviewerTests: "Understanding of BFS/DFS and deduplication.",
        exampleInput: "Starting URL: https://example.com",
        expectedOutput: "List of all reachable pages within depth limit.",
        constraints: "Must respect robots.txt and rate limits.",
        hint: "Use a queue for BFS and a Set to track visited URLs.",
      },
      {
        id: 5,
        question:
          "Design a notification system that can send push notifications, emails, and SMS. How would you make it extensible?",
        difficulty: "Very Easy",
        topicPattern: "System Design / Design Patterns",
        whatInterviewerTests: "Understanding of observer pattern and message queues.",
        exampleInput: "Notification request with user preferences",
        expectedOutput: "Notification sent via appropriate channel based on preferences.",
        constraints: "Must handle different notification types without code changes.",
        hint: "Use strategy pattern with a common interface for different notification providers.",
      },
      {
        id: 6,
        question:
          "Design a simple chat application that supports 1:1 messaging. How would you store and retrieve messages?",
        difficulty: "Very Easy",
        topicPattern: "Messaging / Data Storage",
        whatInterviewerTests: "Real-time messaging concepts and data modeling.",
        exampleInput: "Two users exchanging messages",
        expectedOutput: "Messages delivered in real-time and stored for history.",
        constraints: "Must handle offline users and message ordering.",
        hint: "Use WebSockets for real-time and a database for persistence.",
      },
      {
        id: 7,
        question:
          "Design a file storage system like Dropbox. How would you sync files across multiple devices?",
        difficulty: "Very Easy",
        topicPattern: "File Sync / Distributed Systems",
        whatInterviewerTests: "Understanding of file synchronization and conflict resolution.",
        exampleInput: "File modified on two devices simultaneously",
        expectedOutput: "Both changes synced with conflict resolution.",
        constraints: "Must handle large files and slow connections.",
        hint: "Use chunking for large files and vector clocks for conflict detection.",
      },
      {
        id: 8,
        question:
          "Design a search autocomplete system that suggests queries as users type. How would you implement prefix matching?",
        difficulty: "Very Easy",
        topicPattern: "Trie / Search Algorithms",
        whatInterviewerTests: "Knowledge of trie data structure and prefix matching.",
        exampleInput: "User types 'fac'",
        expectedOutput: "Suggestions: 'facebook', 'factory', 'facts'",
        constraints: "Must return suggestions within 100ms.",
        hint: "Use a trie data structure for efficient prefix matching.",
      },
      {
        id: 9,
        question:
          "Design a content delivery network (CDN) for serving static assets. How would you ensure low latency globally?",
        difficulty: "Very Easy",
        topicPattern: "CDN / Caching",
        whatInterviewerTests: "Understanding of CDN architecture and edge caching.",
        exampleInput: "User requests an image from a different continent",
        expectedOutput: "Image served from nearest edge location.",
        constraints: "Must handle cache invalidation and origin fallback.",
        hint: "Use geographic routing and cache hierarchy (edge → regional → origin).",
      },
      {
        id: 10,
        question:
          "Design a leaderboard system for a game that shows top 10 scores in real-time. How would you handle millions of players?",
        difficulty: "Very Easy",
        topicPattern: "Data Structures / Real-time",
        whatInterviewerTests: "Efficient ranking algorithms at scale.",
        exampleInput: "1 million players with scores",
        expectedOutput: "Top 10 scores updated in real-time.",
        constraints: "Must handle frequent score updates efficiently.",
        hint: "Use a sorted set or heap data structure with Redis.",
      },
    ],
  },
  {
    level: 2,
    title: "Easy",
    difficulty: "Easy",
    questions: [
      {
        id: 11,
        question:
          "Design a URL shortener with analytics. How would you track click counts and user demographics?",
        difficulty: "Easy",
        topicPattern: "Analytics / Time-series Data",
        whatInterviewerTests: "Combining core service with analytics pipeline.",
        exampleInput: "Short URL receives 1000 clicks",
        expectedOutput: "Click count, geographic distribution, referrer data.",
        constraints: "Analytics should not impact redirect performance.",
        hint: "Use async event logging and time-series database for analytics.",
      },
      {
        id: 12,
        question:
          "Design a distributed cache like Memcached. How would you handle cache eviction and consistency?",
        difficulty: "Easy",
        topicPattern: "Caching / Distributed Systems",
        whatInterviewerTests: "Cache strategies and distributed consistency.",
        exampleInput: "Cache with LRU eviction policy",
        expectedOutput: "Cached data with automatic eviction when full.",
        constraints: "Must handle cache misses gracefully.",
        hint: "Use consistent hashing for distribution and LRU for eviction.",
      },
      {
        id: 13,
        question:
          "Design a social media feed that shows posts from friends in chronological order. How would you generate the feed efficiently?",
        difficulty: "Easy",
        topicPattern: "Feed Generation / Pull vs Push",
        whatInterviewerTests: "Understanding of fanout-on-write vs fanout-on-read.",
        exampleInput: "User with 500 friends posting updates",
        expectedOutput: "Timeline with posts from all friends.",
        constraints: "Must handle users with millions of followers.",
        hint: "Use hybrid approach: push for regular users, pull for celebrities.",
      },
      {
        id: 14,
        question:
          "Design a ride-sharing service like Uber. How would you match riders with nearby drivers?",
        difficulty: "Easy",
        topicPattern: "Geospatial / Matching Algorithms",
        whatInterviewerTests: "Geospatial data structures and matching logic.",
        exampleInput: "Rider requests a ride in downtown area",
        expectedOutput: "Nearest available driver matched within 30 seconds.",
        constraints: "Must handle millions of concurrent requests.",
        hint: "Use quadtree or geohash for efficient location queries.",
      },
      {
        id: 15,
        question:
          "Design a real-time collaborative document editor like Google Docs. How would you handle concurrent edits?",
        difficulty: "Easy",
        topicPattern: "Real-time / Conflict Resolution",
        whatInterviewerTests: "Operational transforms and conflict resolution.",
        exampleInput: "Two users editing the same paragraph",
        expectedOutput: "Both edits merged without data loss.",
        constraints: "Must work offline and sync when reconnected.",
        hint: "Use operational transforms or CRDTs for conflict-free merging.",
      },
      {
        id: 16,
        question:
          "Design a video streaming service like YouTube. How would you handle video upload, processing, and playback?",
        difficulty: "Easy",
        topicPattern: "Video Processing / Streaming",
        whatInterviewerTests: "Video encoding pipeline and adaptive streaming.",
        exampleInput: "1 hour video upload (2GB)",
        expectedOutput: "Video processed and available for streaming in multiple qualities.",
        constraints: "Must handle different network conditions and devices.",
        hint: "Use FFmpeg for transcoding and HLS/DASH for adaptive streaming.",
      },
      {
        id: 17,
        question:
          "Design a payment system like Stripe. How would you ensure transactions are reliable and idempotent?",
        difficulty: "Easy",
        topicPattern: "Payment Processing / Reliability",
        whatInterviewerTests: "Idempotency and transaction safety.",
        exampleInput: "Payment request with potential network failures",
        expectedOutput: "Payment processed exactly once even with retries.",
        constraints: "Must handle partial failures and rollbacks.",
        hint: "Use idempotency keys and distributed transactions.",
      },
      {
        id: 18,
        question:
          "Design a search engine indexing system. How would you index documents and handle queries efficiently?",
        difficulty: "Easy",
        topicPattern: "Information Retrieval / Indexing",
        whatInterviewerTests: "Inverted index and ranking algorithms.",
        exampleInput: "Millions of documents to search",
        expectedOutput: "Relevant results returned within 200ms.",
        constraints: "Must handle multiple languages and synonyms.",
        hint: "Use inverted index with TF-IDF or BM25 for ranking.",
      },
      {
        id: 19,
        question:
          "Design a messaging queue like Kafka. How would you ensure message ordering and durability?",
        difficulty: "Easy",
        topicPattern: "Message Queues / Distributed Systems",
        whatInterviewerTests: "Message queue semantics and durability guarantees.",
        exampleInput: "Producer sends 1000 messages per second",
        expectedOutput: "Messages consumed in order by consumers.",
        constraints: "Must handle consumer failures without data loss.",
        hint: "Use partitioned topics with replication and consumer groups.",
      },
      {
        id: 20,
        question:
          "Design a user authentication system with OAuth. How would you handle token refresh and revocation?",
        difficulty: "Easy",
        topicPattern: "Authentication / Security",
        whatInterviewerTests: "OAuth flows and token management.",
        exampleInput: "User logs in via Google OAuth",
        expectedOutput: "Access token issued, refresh token for renewal.",
        constraints: "Must handle token revocation and session management.",
        hint: "Use short-lived access tokens with refresh token rotation.",
      },
    ],
  },
  {
    level: 3,
    title: "Easy-Medium",
    difficulty: "Easy-Medium",
    questions: [
      {
        id: 21,
        question:
          "Design a distributed file system like GFS. How would you handle chunk replication and failure recovery?",
        difficulty: "Easy-Medium",
        topicPattern: "Distributed Storage / Replication",
        whatInterviewerTests: "Chunk servers, master node, and replication strategy.",
        exampleInput: "100GB file to store",
        expectedOutput: "File split into chunks, replicated across servers.",
        constraints: "Must handle server failures without data loss.",
        hint: "Use 3-way replication with master node tracking chunks.",
      },
      {
        id: 22,
        question:
          "Design a distributed task scheduler like cron. How would you ensure tasks run on time across multiple servers?",
        difficulty: "Easy-Medium",
        topicPattern: "Task Scheduling / Coordination",
        whatInterviewerTests: "Distributed coordination and exactly-once execution.",
        exampleInput: "Task to run every 5 minutes",
        expectedOutput: "Task executed exactly once, even with server failures.",
        constraints: "Must handle clock skew and network partitions.",
        hint: "Use a distributed lock with ZooKeeper or etcd for coordination.",
      },
      {
        id: 23,
        question:
          "Design a real-time analytics platform for processing clickstream data. How would you handle high throughput?",
        difficulty: "Easy-Medium",
        topicPattern: "Stream Processing / Analytics",
        whatInterviewerTests: "Stream processing architectures and windowing.",
        exampleInput: "1 million events per second",
        expectedOutput: "Real-time aggregations with 1-second latency.",
        constraints: "Must handle late-arriving data and out-of-order events.",
        hint: "Use Apache Kafka for ingestion and Flink/Spark for processing.",
      },
      {
        id: 24,
        question:
          "Design a distributed lock service like ZooKeeper. How would you handle lock acquisition and release?",
        difficulty: "Easy-Medium",
        topicPattern: "Coordination / Distributed Locks",
        whatInterviewerTests: "Distributed consensus and lock semantics.",
        exampleInput: "Two processes trying to acquire same lock",
        expectedOutput: "Only one process holds the lock at a time.",
        constraints: "Must handle process crashes without deadlocks.",
        hint: "Use ephemeral nodes with lease-based expiration.",
      },
      {
        id: 25,
        question:
          "Design a recommendation engine like Netflix. How would you generate personalized recommendations?",
        difficulty: "Easy-Medium",
        topicPattern: "Machine Learning / Recommendations",
        whatInterviewerTests: "Collaborative filtering and content-based approaches.",
        exampleInput: "User watch history and ratings",
        expectedOutput: "List of recommended shows with confidence scores.",
        constraints: "Must handle cold start problem for new users.",
        hint: "Use hybrid approach combining collaborative filtering and content similarity.",
      },
      {
        id: 26,
        question:
          "Design a distributed configuration management system. How would you distribute config changes to all services?",
        difficulty: "Easy-Medium",
        topicPattern: "Configuration / Distribution",
        whatInterviewerTests: "Config propagation and consistency.",
        exampleInput: "Config change for 1000 service instances",
        expectedOutput: "All instances receive updated config within 5 seconds.",
        constraints: "Must handle network partitions gracefully.",
        hint: "Use push-based notifications with pull fallback for reliability.",
      },
      {
        id: 27,
        question:
          "Design a multi-region database with strong consistency. How would you handle cross-region writes?",
        difficulty: "Easy-Medium",
        topicPattern: "Distributed Databases / Consensus",
        whatInterviewerTests: "Multi-region replication and consistency models.",
        exampleInput: "Write from US, read from Europe",
        expectedOutput: "Read returns consistent data within latency SLA.",
        constraints: "Must handle region failures without downtime.",
        hint: "Use consensus algorithms like Raft for cross-region coordination.",
      },
      {
        id: 28,
        question:
          "Design a service mesh for microservices. How would you handle service discovery and load balancing?",
        difficulty: "Easy-Medium",
        topicPattern: "Microservices / Service Mesh",
        whatInterviewerTests: "Service mesh architecture and sidecar patterns.",
        exampleInput: "100 microservices communicating",
        expectedOutput: "Automatic service discovery with intelligent load balancing.",
        constraints: "Must add minimal latency overhead.",
        hint: "Use sidecar proxies like Envoy with a control plane.",
      },
      {
        id: 29,
        question:
          "Design a distributed task queue like Celery. How would you handle task prioritization and worker scaling?",
        difficulty: "Easy-Medium",
        topicPattern: "Task Queues / Worker Management",
        whatInterviewerTests: "Task distribution and worker lifecycle management.",
        exampleInput: "1000 tasks with different priorities",
        expectedOutput: "High-priority tasks processed first, workers scale based on load.",
        constraints: "Must handle worker failures and task retries.",
        hint: "Use priority queues with separate worker pools for different priorities.",
      },
      {
        id: 30,
        question:
          "Design a real-time leaderboard with geolocation. How would you show top players in a specific region?",
        difficulty: "Easy-Medium",
        topicPattern: "Geospatial / Ranking Systems",
        whatInterviewerTests: "Combining geospatial queries with ranking.",
        exampleInput: "Top 100 players in California",
        expectedOutput: "Ranked list of players with their scores and locations.",
        constraints: "Must update in real-time as scores change.",
        hint: "Use geohash for region filtering with sorted sets for ranking.",
      },
    ],
  },
  {
    level: 4,
    title: "Practical Web Developer",
    difficulty: "Easy-Medium",
    questions: [
      {
        id: 31,
        question:
          "Design a complete Instagram-like photo sharing service. How would you handle uploads, feed generation, and stories?",
        difficulty: "Easy-Medium",
        topicPattern: "Complete System Design",
        whatInterviewerTests: "End-to-end system architecture for a social media platform.",
        exampleInput: "User uploads photo and shares to feed",
        expectedOutput: "Photo processed, added to followers' feeds, available in stories.",
        constraints: "Must handle 1 billion users and 100 million daily active users.",
        hint: "Break down into services: upload, processing, feed, stories, notifications.",
      },
      {
        id: 32,
        question:
          "Design a real-time collaborative coding platform like CodePen. How would you sync code changes between users?",
        difficulty: "Easy-Medium",
        topicPattern: "Real-time Collaboration / Code Execution",
        whatInterviewerTests: "Real-time sync and sandboxed code execution.",
        exampleInput: "Two users editing same code file",
        expectedOutput: "Changes synced in real-time, code executes safely.",
        constraints: "Must prevent malicious code execution.",
        hint: "Use CRDTs for sync and Docker containers for code execution.",
      },
      {
        id: 33,
        question:
          "Design a distributed email system like Gmail. How would you handle email delivery, storage, and search?",
        difficulty: "Easy-Medium",
        topicPattern: "Email Systems / Storage",
        whatInterviewerTests: "Email protocols and distributed storage.",
        exampleInput: "User sends email to 100 recipients",
        expectedOutput: "Email delivered to all recipients, searchable in sender's sent folder.",
        constraints: "Must handle attachments up to 25MB.",
        hint: "Use SMTP for delivery, distributed storage, and Elasticsearch for search.",
      },
      {
        id: 34,
        question:
          "Design a payment processing system that handles millions of transactions daily. How would you ensure reliability?",
        difficulty: "Easy-Medium",
        topicPattern: "Payment Systems / Reliability",
        whatInterviewerTests: "Financial system design and compliance.",
        exampleInput: "Credit card transaction request",
        expectedOutput: "Payment authorized, captured, and settled.",
        constraints: "Must comply with PCI DSS and handle chargebacks.",
        hint: "Use idempotency, distributed transactions, and audit logging.",
      },
      {
        id: 35,
        question:
          "Design a video conferencing system like Zoom. How would you handle real-time video and screen sharing?",
        difficulty: "Easy-Medium",
        topicPattern: "Video Conferencing / WebRTC",
        whatInterviewerTests: "Real-time video/audio and SFU architecture.",
        exampleInput: "100 participants in a meeting",
        expectedOutput: "Real-time video/audio with minimal latency.",
        constraints: "Must handle network congestion and packet loss.",
        hint: "Use SFU for selective forwarding and simulcast for adaptive quality.",
      },
      {
        id: 36,
        question:
          "Design a content moderation system that scales. How would you handle image, video, and text moderation?",
        difficulty: "Easy-Medium",
        topicPattern: "Content Moderation / ML",
        whatInterviewerTests: "ML pipelines and content safety.",
        exampleInput: "Millions of user-submitted content pieces",
        expectedOutput: "Content reviewed within 24 hours with 99% accuracy.",
        constraints: "Must handle different content types and languages.",
        hint: "Use ML models for initial screening with human review for edge cases.",
      },
      {
        id: 37,
        question:
          "Design a location-based service like Foursquare. How would you find nearby places and handle check-ins?",
        difficulty: "Easy-Medium",
        topicPattern: "Geospatial Services / Place Data",
        whatInterviewerTests: "Geospatial indexing and place matching.",
        exampleInput: "User location with 1km radius",
        expectedOutput: "List of nearby places sorted by relevance.",
        constraints: "Must handle 100 million places worldwide.",
        hint: "Use geohash or quadtree for spatial indexing.",
      },
      {
        id: 38,
        question:
          "Design a social graph service like Facebook's friend system. How would you store and query relationships?",
        difficulty: "Easy-Medium",
        topicPattern: "Graph Databases / Social Graph",
        whatInterviewerTests: "Graph data modeling and query optimization.",
        exampleInput: "User with 1000 friends, friends of friends",
        expectedOutput: "Friend suggestions based on mutual connections.",
        constraints: "Must handle billions of relationships.",
        hint: "Use graph database or adjacency lists with caching.",
      },
      {
        id: 39,
        question:
          "Design a search-as-you-type system that provides instant results. How would you optimize for speed?",
        difficulty: "Easy-Medium",
        topicPattern: "Search / Performance Optimization",
        whatInterviewerTests: "Search optimization and caching strategies.",
        exampleInput: "User types 'react'",
        expectedOutput: "Instant suggestions: 'react tutorial', 'react hooks', etc.",
        constraints: "Must return results within 50ms.",
        hint: "Use trie with frequency ranking and client-side caching.",
      },
      {
        id: 40,
        question:
          "Design a webhook system that can deliver events to multiple endpoints. How would you ensure reliable delivery?",
        difficulty: "Easy-Medium",
        topicPattern: "Webhooks / Event Delivery",
        whatInterviewerTests: "Event-driven architecture and delivery guarantees.",
        exampleInput: "Event triggers 100 webhook endpoints",
        expectedOutput: "All endpoints receive event with retry on failure.",
        constraints: "Must handle endpoint downtime and rate limits.",
        hint: "Use queue-based delivery with exponential backoff and dead letter queues.",
      },
    ],
  },
  {
    level: 5,
    title: "Mock Interview",
    difficulty: "Easy-Medium",
    questions: [
      {
        id: 41,
        question:
          "Design a complete social media platform with posts, stories, messaging, and notifications. Scale to 1 billion users.",
        difficulty: "Easy-Medium",
        topicPattern: "Complete System / Scale",
        whatInterviewerTests: "End-to-end system design at massive scale.",
        exampleInput: "1 billion users, 100 million daily active users",
        expectedOutput: "Complete system architecture with all components.",
        constraints: "Must handle 99.99% availability and < 100ms latency.",
        hint: "Break into services: user, post, feed, message, notification, media.",
      },
      {
        id: 42,
        question:
          "Design a distributed monitoring and alerting system like Datadog. How would you collect, store, and alert on metrics?",
        difficulty: "Easy-Medium",
        topicPattern: "Monitoring / Time-series",
        whatInterviewerTests: "Metrics collection, storage, and alerting pipelines.",
        exampleInput: "10 million metrics per second",
        expectedOutput: "Real-time dashboards with alerts on anomalies.",
        constraints: "Must retain 90 days of data with 1-second resolution.",
        hint: "Use time-series database with downsampling and anomaly detection.",
      },
      {
        id: 43,
        question:
          "Design a distributed search engine like Elasticsearch. How would you index documents and handle queries across clusters?",
        difficulty: "Easy-Medium",
        topicPattern: "Search / Distributed Indexing",
        whatInterviewerTests: "Distributed indexing and query routing.",
        exampleInput: "100 million documents across 50 nodes",
        expectedOutput: "Full-text search results with relevance ranking.",
        constraints: "Must handle index updates without downtime.",
        hint: "Use sharding with consistent hashing and replica sets.",
      },
      {
        id: 44,
        question:
          "Design a real-time gaming leaderboard that handles 1 million concurrent players. How would you show global and regional rankings?",
        difficulty: "Easy-Medium",
        topicPattern: "Real-time Systems / Gaming",
        whatInterviewerTests: "High-throughput ranking systems.",
        exampleInput: "1 million players with frequent score updates",
        expectedOutput: "Global top 100 and regional rankings updated in real-time.",
        constraints: "Must handle 100,000 score updates per second.",
        hint: "Use sorted sets with Redis Cluster and periodic aggregation.",
      },
      {
        id: 45,
        question:
          "Design a content delivery network for video streaming. How would you optimize for different network conditions and devices?",
        difficulty: "Easy-Medium",
        topicPattern: "CDN / Video Optimization",
        whatInterviewerTests: "CDN architecture and adaptive bitrate streaming.",
        exampleInput: "Video viewed from different countries and devices",
        expectedOutput: "Optimized video quality based on network and device.",
        constraints: "Must handle 4K streaming and low-bandwidth connections.",
        hint: "Use edge caching with HLS/DASH and device-aware transcoding.",
      },
      {
        id: 46,
        question:
          "Design a distributed file sync system like Dropbox. How would you handle conflicts and offline changes?",
        difficulty: "Easy-Medium",
        topicPattern: "File Sync / Conflict Resolution",
        whatInterviewerTests: "Conflict resolution and sync protocols.",
        exampleInput: "File edited offline on two devices",
        expectedOutput: "Both changes synced with conflict resolution.",
        constraints: "Must handle large files and slow connections.",
        hint: "Use block-level sync with vector clocks for conflict detection.",
      },
      {
        id: 47,
        question:
          "Design a machine learning model serving infrastructure. How would you deploy and serve models at scale?",
        difficulty: "Easy-Medium",
        topicPattern: "ML Infrastructure / Model Serving",
        whatInterviewerTests: "ML model deployment and inference optimization.",
        exampleInput: "1000 inference requests per second",
        expectedOutput: "Models served with < 50ms latency.",
        constraints: "Must handle model updates without downtime.",
        hint: "Use model registry, A/B testing, and GPU optimization.",
      },
      {
        id: 48,
        question:
          "Design a distributed caching layer for a social media platform. How would you handle cache warming and invalidation?",
        difficulty: "Easy-Medium",
        topicPattern: "Caching / Invalidation Strategies",
        whatInterviewerTests: "Advanced caching patterns and consistency.",
        exampleInput: "Post goes viral, cache needs updating",
        expectedOutput: "Cache updated efficiently without stampede.",
        constraints: "Must handle 99% cache hit rate.",
        hint: "Use cache-aside with write-through and cache stampede prevention.",
      },
      {
        id: 49,
        question:
          "Design a service discovery system for microservices. How would you handle service registration and health checks?",
        difficulty: "Easy-Medium",
        topicPattern: "Service Discovery / Health Monitoring",
        whatInterviewerTests: "Service discovery patterns and health monitoring.",
        exampleInput: "500 microservices with varying health",
        expectedOutput: "Services discovered with health status and load info.",
        constraints: "Must handle network partitions and service failures.",
        hint: "Use gossip protocol for health and DNS/SRD for discovery.",
      },
      {
        id: 50,
        question:
          "Design a complete e-commerce platform like Amazon. How would you handle product catalog, orders, and recommendations?",
        difficulty: "Easy-Medium",
        topicPattern: "E-commerce / Complete Platform",
        whatInterviewerTests: "Complex system design with multiple integrated services.",
        exampleInput: "100 million products, 10 million orders per day",
        expectedOutput: "Complete e-commerce system with all core features.",
        constraints: "Must handle flash sales and inventory management.",
        hint: "Break into services: catalog, cart, order, payment, recommendation, inventory.",
      },
    ],
  },
];

export const SYSTEM_DESIGN_PREP_PLAN = {
  title: "30-Day System Design Preparation Plan",
  goal: "Master system design interviews by understanding core concepts and practicing real-world scenarios. Focus on trade-offs, not memorization. Study every day.",
  dailyRoutine: [
    "Pick 1–2 problems from the current day's list.",
    "Solve without looking anything up first (set a 20–30 min timer).",
    "If stuck, use only the hint. Try again.",
    "Draw diagrams to visualize the architecture.",
    "After solving, discuss trade-offs and alternative approaches.",
    "End by considering scalability and failure scenarios.",
  ],
  weeks: [
    {
      week: 1,
      title: "Fundamentals",
      days: [
        "Days 1–2: Questions 1–10 (Very Easy). Master basic concepts: hashing, rate limiting, caching.",
        "Days 3–4: Questions 11–15. Focus on analytics, distributed systems, and feed generation.",
        "Days 5–6: Questions 16–20. Video processing, payments, search, and messaging.",
        "Day 7: Review all of Week 1. Re-solve any that felt weak. Draw architecture diagrams.",
      ],
    },
    {
      week: 2,
      title: "Core Patterns",
      days: [
        "Days 8–9: Distributed storage and task scheduling (21, 22, 23).",
        "Days 10–11: Coordination, recommendations, and configuration (24, 25, 26).",
        "Days 12–13: Multi-region databases, service mesh, and task queues (27, 28, 29).",
        "Day 14: Full review of Level 3. Time yourself on 3 random problems.",
      ],
    },
    {
      week: 3,
      title: "Practical Systems",
      days: [
        "Days 15–16: Complete social media and collaborative coding (31, 32).",
        "Days 17–18: Email, payments, and video conferencing (33, 34, 35).",
        "Days 19–20: Content moderation, location services, and social graph (36, 37, 38).",
        "Day 21: Simulate a system design interview: design a complete system in 45 minutes.",
      ],
    },
    {
      week: 4,
      title: "Mock Interviews & Integration",
      days: [
        "Days 22–23: Search, webhooks, and complete social platform (39, 40, 41).",
        "Days 24–25: Monitoring, distributed search, and gaming leaderboard (42, 43, 44).",
        "Days 26–27: CDN, file sync, ML infrastructure (45, 46, 47).",
        "Day 28: Full mock: Pick 4 mixed problems (one from each Level 2–5). Solve under timed conditions (60 min each).",
        "Day 29: Review every problem you struggled with. Re-solve without looking at old diagrams.",
        "Day 30: Final mixed set of 5 problems. Focus on clear communication, trade-offs, and scalability.",
      ],
    },
  ],
  ongoingRules: [
    "Never jump to solutions. Struggle productively.",
    "When you later send me your design, I will review your approach first, point out issues, give progressive hints, and only reveal a full solution if you explicitly request it.",
    "Always discuss trade-offs: consistency vs availability, latency vs throughput, cost vs performance.",
    "After every problem, consider how you would monitor and scale the system.",
  ],
};
