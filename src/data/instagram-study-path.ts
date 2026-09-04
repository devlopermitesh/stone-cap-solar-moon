export type InstagramQuestion = {
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

export type InstagramLevel = {
  level: number;
  title: string;
  difficulty: string;
  questions: InstagramQuestion[];
};

export const INSTAGRAM_LEVELS: InstagramLevel[] = [
  {
    level: 1,
    title: "Very Easy",
    difficulty: "Very Easy",
    questions: [
      {
        id: 1,
        question:
          "Create a simple React Native component that displays a user's name and profile picture using a reusable Avatar component.",
        difficulty: "Very Easy",
        topicPattern: "React Native / Component Composition",
        whatInterviewerTests: "Basic component creation and props handling.",
        exampleInput: 'name="John Doe", avatarUrl="https://example.com/john.jpg"',
        expectedOutput: "A card showing the user's name and circular profile picture.",
        constraints: "Component must be reusable with different names and images.",
        hint: "Use Image and Text components from react-native.",
      },
      {
        id: 2,
        question:
          "Build a Like button component that toggles between filled and outline heart icons when pressed, with a counter.",
        difficulty: "Very Easy",
        topicPattern: "React Native / State Management",
        whatInterviewerTests: "Using useState for toggle functionality and event handling.",
        exampleInput: 'initialCount=0',
        expectedOutput: "Heart icon toggles between filled/outline, count increments/decrements.",
        constraints: "Must animate the heart icon on press.",
        hint: "Use useState for like state and Animated API for animation.",
      },
      {
        id: 3,
        question:
          "Create a horizontal ScrollView that displays a list of story circles with user avatars.",
        difficulty: "Very Easy",
        topicPattern: "React Native / ScrollView",
        whatInterviewerTests: "Understanding of ScrollView and horizontal scrolling.",
        exampleInput: "Array of 10 user objects with name and avatar",
        expectedOutput: "Horizontally scrollable row of circular story avatars.",
        constraints: "Stories should be scrollable horizontally.",
        hint: "Use ScrollView with horizontal prop and FlatList as alternative.",
      },
      {
        id: 4,
        question:
          "Implement a search bar component with a text input and a search icon that updates state as the user types.",
        difficulty: "Very Easy",
        topicPattern: "React Native / TextInput",
        whatInterviewerTests: "Handling text input and controlled components.",
        exampleInput: "User types 'hello'",
        expectedOutput: "TextInput shows 'hello', search icon is visible.",
        constraints: "Must have a search icon and clear button when text is present.",
        hint: "Use TextInput with onChangeText and conditional rendering for clear button.",
      },
      {
        id: 5,
        question:
          "Create a bottom tab navigator with 4 tabs: Home, Search, Reels, and Profile using React Navigation.",
        difficulty: "Very Easy",
        topicPattern: "React Navigation / Tab Navigation",
        whatInterviewerTests: "Setting up tab navigation in React Native.",
        exampleInput: "4 screens to navigate between",
        expectedOutput: "Bottom tab bar with 4 icons and labels.",
        constraints: "Must use React Navigation's bottom tabs.",
        hint: "Install @react-navigation/bottom-tabs and configure Tab.Navigator.",
      },
      {
        id: 6,
        question:
          "Build a simple post card component that displays user info, post image, like/comment/share buttons, and caption.",
        difficulty: "Very Easy",
        topicPattern: "React Native / UI Components",
        whatInterviewerTests: "Building complex UI layouts with nested components.",
        exampleInput: "Post data with user, image, caption, likeCount, commentCount",
        expectedOutput: "Instagram-like post card with all elements properly laid out.",
        constraints: "Must handle long captions with 'see more' option.",
        hint: "Use View, Image, TouchableOpacity, and Text components in a card layout.",
      },
      {
        id: 7,
        question:
          "Implement a profile header component showing username, bio, follower/following counts, and edit profile button.",
        difficulty: "Very Easy",
        topicPattern: "React Native / Profile UI",
        whatInterviewerTests: "Building a standard profile layout with proper spacing.",
        exampleInput: "Profile data with username, bio, followers, following, posts count",
        expectedOutput: "Profile header with avatar, stats, and action buttons.",
        constraints: "Must be responsive for different screen sizes.",
        hint: "Use a combination of View, Text, Image, and TouchableOpacity.",
      },
      {
        id: 8,
        question:
          "Create a notification item component that displays different types of notifications (like, comment, follow) with appropriate icons.",
        difficulty: "Very Easy",
        topicPattern: "React Native / Conditional Rendering",
        whatInterviewerTests: "Rendering different UI based on notification type.",
        exampleInput: 'notificationType="like", username="jane", postImage="..."',
        expectedOutput: "Notification with correct icon, text, and timestamp.",
        constraints: "Must handle at least 3 notification types.",
        hint: "Use a switch statement or object map to render different icons and text.",
      },
      {
        id: 9,
        question:
          "Build a simple camera screen component with a capture button and gallery access button.",
        difficulty: "Very Easy",
        topicPattern: "React Native / Camera UI",
        whatInterviewerTests: "Creating camera interface UI layout.",
        exampleInput: "Camera permissions granted",
        expectedOutput: "Camera view with capture and gallery buttons.",
        constraints: "UI only, actual camera functionality is optional.",
        hint: "Use react-native-camera or expo-camera for actual functionality.",
      },
      {
        id: 10,
        question:
          "Implement a hashtag and mention highlighting component that parses text and renders clickable links.",
        difficulty: "Very Easy",
        topicPattern: "React Native / Text Parsing",
        whatInterviewerTests: "String manipulation and conditional text rendering.",
        exampleInput: 'text="Hello @john check out #reactnative"',
        expectedOutput: "Text with @john and #reactnative highlighted as links.",
        constraints: "Must handle multiple hashtags and mentions in one message.",
        hint: "Use regex to match patterns and Text components with onPress for each.",
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
          "Build a pull-to-refresh feed component using FlatList that loads more posts when scrolling down.",
        difficulty: "Easy",
        topicPattern: "React Native / FlatList",
        whatInterviewerTests: "Implementing infinite scroll and pull-to-refresh.",
        exampleInput: "Initial list of 20 posts, API to fetch more",
        expectedOutput: "Scrollable feed with refresh on pull and load more on scroll.",
        constraints: "Must handle loading states and empty states.",
        hint: "Use onRefresh, refreshing, onEndReached, and ListFooterComponent props.",
      },
      {
        id: 12,
        question:
          "Implement a stories carousel that auto-plays stories with a progress bar and skips to next story on tap.",
        difficulty: "Easy",
        topicPattern: "React Native / Animation",
        whatInterviewerTests: "Handling timed animations and gesture detection.",
        exampleInput: "Array of 5 stories with duration",
        expectedOutput: "Auto-playing stories with progress bar, tap to skip.",
        constraints: "Each story should have configurable duration.",
        hint: "Use Animated API with useEffect and timers for auto-advance.",
      },
      {
        id: 13,
        question:
          "Create a direct message list showing conversations with last message, timestamp, and unread count.",
        difficulty: "Easy",
        topicPattern: "React Native / List Rendering",
        whatInterviewerTests: "Building complex list items with multiple data points.",
        exampleInput: "Array of conversation objects with messages and timestamps",
        expectedOutput: "List of conversations sorted by last message time.",
        constraints: "Must format timestamps as '2h ago', 'Yesterday', etc.",
        hint: "Use FlatList with a custom renderItem and timestamp formatting logic.",
      },
      {
        id: 14,
        question:
          "Build an image grid for the profile page that displays posts in a 3-column layout with aspect ratio.",
        difficulty: "Easy",
        topicPattern: "React Native / Grid Layout",
        whatInterviewerTests: "Creating grid layouts without ScrollView nesting issues.",
        exampleInput: "Array of 12 post images",
        expectedOutput: "3-column grid of square images.",
        constraints: "Must maintain equal spacing and handle images with different aspect ratios.",
        hint: "Use FlatList with numColumns=3 and proper styling.",
      },
      {
        id: 15,
        question:
          "Implement a caption composer with character count, hashtag suggestions, and mention autocomplete.",
        difficulty: "Easy",
        topicPattern: "React Native / TextInput Advanced",
        whatInterviewerTests: "Advanced text input handling and suggestions UI.",
        exampleInput: "User typing a caption with @ symbol",
        expectedOutput: "Autocomplete dropdown showing matching users.",
        constraints: "Must show suggestions after typing @ or #.",
        hint: "Use TextInput with onKeyPress to detect @ and # triggers.",
      },
      {
        id: 16,
        question:
          "Create a reel player component with vertical scrolling between reels and double-tap to like animation.",
        difficulty: "Easy",
        topicPattern: "React Native / Gesture Handling",
        whatInterviewerTests: "Implementing gesture-based interactions and animations.",
        exampleInput: "Array of reel video URLs",
        expectedOutput: "Vertical scrollable reels with like animation on double-tap.",
        constraints: "Must handle gesture conflicts between scroll and tap.",
        hint: "Use react-native-gesture-handler for gestures and Animated for heart animation.",
      },
      {
        id: 17,
        question:
          "Build a settings screen with multiple sections (Account, Privacy, Notifications) using SectionList.",
        difficulty: "Easy",
        topicPattern: "React Native / SectionList",
        whatInterviewerTests: "Using SectionList for grouped settings items.",
        exampleInput: "Settings data organized in sections",
        expectedOutput: "Grouped settings list with section headers and separators.",
        constraints: "Must support different item types (toggle, navigation, info).",
        hint: "Use SectionList with renderItem and renderSectionHeader.",
      },
      {
        id: 18,
        question:
          "Implement a photo filter selection UI with horizontal scrollable filter thumbnails and live preview.",
        difficulty: "Easy",
        topicPattern: "React Native / Image Processing",
        whatInterviewerTests: "Building image manipulation UI and preview functionality.",
        exampleInput: "Original image and list of filter options",
        expectedOutput: "Filter thumbnails with selected filter applied to preview.",
        constraints: "Filters should apply in real-time as user selects.",
        hint: "Use react-native-image-filter-kit or similar library for filters.",
      },
      {
        id: 19,
        question:
          "Create a hashtag trending page that displays top hashtags with post counts and tap to view posts.",
        difficulty: "Easy",
        topicPattern: "React Native / Data Display",
        whatInterviewerTests: "Displaying trending data and navigation.",
        exampleInput: "Array of hashtags with post counts",
        expectedOutput: "List of trending hashtags with counts, tappable.",
        constraints: "Must refresh data periodically.",
        hint: "Use FlatList with pull-to-refresh and navigation to hashtag posts.",
      },
      {
        id: 20,
        question:
          "Build a simple Instagram login screen with username/password fields, login button, and error handling.",
        difficulty: "Easy",
        topicPattern: "React Native / Form Handling",
        whatInterviewerTests: "Form validation and API integration basics.",
        exampleInput: "Username and password input",
        expectedOutput: "Login form with validation errors and loading state.",
        constraints: "Must validate email format and password length.",
        hint: "Use useState for form state, KeyboardAvoidingView for keyboard handling.",
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
          "Implement an optimized image cache system for the feed that loads images lazily and caches them locally.",
        difficulty: "Easy-Medium",
        topicPattern: "Performance / Image Caching",
        whatInterviewerTests: "Optimizing image loading and memory management.",
        exampleInput: "Feed with 50+ images",
        expectedOutput: "Smooth scrolling with cached images, no flickering.",
        constraints: "Must handle image loading states and error fallbacks.",
        hint: "Use FastImage or expo-image with caching strategies.",
      },
      {
        id: 22,
        question:
          "Build a real-time direct messaging system with typing indicators and online status.",
        difficulty: "Easy-Medium",
        topicPattern: "Real-time / WebSocket",
        whatInterviewerTests: "Implementing real-time communication and state sync.",
        exampleInput: "Two users in a chat",
        expectedOutput: "Messages appear instantly, typing indicator shows when other user types.",
        constraints: "Must handle connection drops and reconnection.",
        hint: "Use Socket.io or Firebase Realtime Database for real-time sync.",
      },
      {
        id: 23,
        question:
          "Implement infinite scroll with cursor-based pagination for the explore page grid.",
        difficulty: "Easy-Medium",
        topicPattern: "Pagination / Infinite Scroll",
        whatInterviewerTests: "Efficient data fetching and scroll performance.",
        exampleInput: "Initial 30 items, API returns cursor for next page",
        expectedOutput: "Seamless loading of new items as user scrolls.",
        constraints: "Must not duplicate items or cause layout shifts.",
        hint: "Use FlatList with onEndReached and cursor-based API pagination.",
      },
      {
        id: 24,
        question:
          "Create a story creation flow with camera, gallery picker, text overlay, and drawing tools.",
        difficulty: "Easy-Medium",
        topicPattern: "Story Creation / Multi-step Flow",
        whatInterviewerTests: "Building complex multi-step UI flows.",
        exampleInput: "User captures photo or selects from gallery",
        expectedOutput: "Story editor with text, drawing, and sticker tools.",
        constraints: "Must save story locally before sharing.",
        hint: "Use a step-based flow with state management for each editing tool.",
      },
      {
        id: 25,
        question:
          "Build a location tagging feature that shows nearby places and adds location to posts.",
        difficulty: "Easy-Medium",
        topicPattern: "Location Services / Maps",
        whatInterviewerTests: "Integrating location APIs and map components.",
        exampleInput: "User's current location",
        expectedOutput: "List of nearby places to tag, map preview.",
        constraints: "Must request location permissions and handle denial.",
        hint: "Use react-native-maps and a places API like Google Places.",
      },
      {
        id: 26,
        question:
          "Implement a carousel component for multi-image posts with pagination dots and gesture navigation.",
        difficulty: "Easy-Medium",
        topicPattern: "React Native / Carousel",
        whatInterviewerTests: "Building custom carousel with gestures and indicators.",
        exampleInput: "Post with 5 images",
        expectedOutput: "Swipeable carousel with dots indicating current position.",
        constraints: "Must handle fast swipes and snap to images.",
        hint: "Use FlatList with horizontal scroll and pagingEnabled, or react-native-reanimated-carousel.",
      },
      {
        id: 27,
        question:
          "Create a saved posts collection feature with folders and offline access.",
        difficulty: "Easy-Medium",
        topicPattern: "Data Persistence / Offline",
        whatInterviewerTests: "Local storage and offline data management.",
        exampleInput: "Posts to save, folders to organize",
        expectedOutput: "Saved posts accessible offline in organized folders.",
        constraints: "Must sync saved posts when online.",
        hint: "Use AsyncStorage or Realm for local storage with sync.",
      },
      {
        id: 28,
        question:
          "Build a notification system with push notifications, in-app alerts, and notification preferences.",
        difficulty: "Easy-Medium",
        topicPattern: "Push Notifications / User Preferences",
        whatInterviewerTests: "Handling push notifications and user settings.",
        exampleInput: "Notification preferences and device token",
        expectedOutput: "Push notifications delivered based on preferences.",
        constraints: "Must handle different notification types and channels.",
        hint: "Use expo-notifications or react-native-push-notification.",
      },
      {
        id: 29,
        question:
          "Implement a dark mode toggle that persists across app restarts and applies system-wide.",
        difficulty: "Easy-Medium",
        topicPattern: "Theme System / State Persistence",
        whatInterviewerTests: "Theming system and persistent state.",
        exampleInput: "User toggles dark mode",
        expectedOutput: "App switches between light and dark themes instantly.",
        constraints: "Must remember preference across app restarts.",
        hint: "Use React Context for theme state and AsyncStorage for persistence.",
      },
      {
        id: 30,
        question:
          "Create a reel creation flow with video trimming, effects, music selection, and cover photo.",
        difficulty: "Easy-Medium",
        topicPattern: "Video Processing / Media",
        whatInterviewerTests: "Complex media editing workflow.",
        exampleInput: "Raw video file",
        expectedOutput: "Edited reel with effects, music, and custom cover.",
        constraints: "Must handle video processing in background.",
        hint: "Use expo-av for video and a video editing library for trimming/effects.",
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
          "Implement optimistic UI updates for like/comment actions that rollback on API failure.",
        difficulty: "Easy-Medium",
        topicPattern: "Optimistic Updates / Error Handling",
        whatInterviewerTests: "Handling UI state with API failures gracefully.",
        exampleInput: "User likes a post",
        expectedOutput: "Like count updates immediately, rolls back if API fails.",
        constraints: "Must show error message on rollback.",
        hint: "Update state immediately, then call API, rollback on error.",
      },
      {
        id: 32,
        question:
          "Build a deep linking system that handles different URL schemes for posts, profiles, and hashtags.",
        difficulty: "Easy-Medium",
        topicPattern: "Deep Linking / Navigation",
        whatInterviewerTests: "Setting up deep links and handling different routes.",
        exampleInput: "URL like instagram://post/123 or https://instagram.com/p/123",
        expectedOutput: "App opens to the correct screen based on URL.",
        constraints: "Must handle both universal links and custom URL schemes.",
        hint: "Use React Navigation's linking configuration.",
      },
      {
        id: 33,
        question:
          "Implement a skeleton loading screen that matches the actual content layout while data loads.",
        difficulty: "Easy-Medium",
        topicPattern: "Loading States / UX",
        whatInterviewerTests: "Creating smooth loading experiences.",
        exampleInput: "Feed with posts loading",
        expectedOutput: "Skeleton placeholders that animate while content loads.",
        constraints: "Must match actual content layout proportions.",
        hint: "Use react-native-reanimated for shimmer animation effects.",
      },
      {
        id: 34,
        question:
          "Create a keyboard-aware scroll view for forms that adjusts when keyboard appears.",
        difficulty: "Easy-Medium",
        topicPattern: "Keyboard Handling / Forms",
        whatInterviewerTests: "Handling keyboard interactions in forms.",
        exampleInput: "Form with multiple inputs",
        expectedOutput: "Form scrolls to keep focused input visible when keyboard appears.",
        constraints: "Must work on both iOS and Android.",
        hint: "Use KeyboardAvoidingView or react-native-keyboard-aware-scroll-view.",
      },
      {
        id: 35,
        question:
          "Build a gesture-based navigation system with swipe back and forward between screens.",
        difficulty: "Easy-Medium",
        topicPattern: "Gesture Navigation / Transitions",
        whatInterviewerTests: "Implementing gesture-driven navigation.",
        exampleInput: "User swipes from left edge",
        expectedOutput: "Previous screen slides in from left.",
        constraints: "Must handle gesture conflicts with scrollable content.",
        hint: "Use react-native-gesture-handler with Animated transitions.",
      },
      {
        id: 36,
        question:
          "Implement a multi-step onboarding flow with swipeable pages and skip option.",
        difficulty: "Easy-Medium",
        topicPattern: "Onboarding / User Experience",
        whatInterviewerTests: "Building guided user flows with persistence.",
        exampleInput: "First app launch",
        expectedOutput: "Swipeable onboarding pages with progress indicators.",
        constraints: "Must remember if user completed onboarding.",
        hint: "Use FlatList with horizontal scroll and AsyncStorage for completion state.",
      },
      {
        id: 37,
        question:
          "Create a media picker that allows selecting multiple images from the gallery with a limit.",
        difficulty: "Easy-Medium",
        topicPattern: "Media Selection / Gallery",
        whatInterviewerTests: "Handling media selection with constraints.",
        exampleInput: "Gallery with 100 photos, limit of 10",
        expectedOutput: "Multi-select gallery with counter and selection limit.",
        constraints: "Must show selection order and handle deselect.",
        hint: "Use expo-image-picker or react-native-image-crop-picker.",
      },
      {
        id: 38,
        question:
          "Build an analytics dashboard showing post performance metrics with charts.",
        difficulty: "Easy-Medium",
        topicPattern: "Data Visualization / Analytics",
        whatInterviewerTests: "Displaying data with charts and graphs.",
        exampleInput: "Post engagement data over time",
        expectedOutput: "Charts showing likes, comments, reach over time.",
        constraints: "Must handle date ranges and export data.",
        hint: "Use react-native-chart-kit or victory-native for charts.",
      },
      {
        id: 39,
        question:
          "Implement a comment threading system with nested replies and expand/collapse.",
        difficulty: "Easy-Medium",
        topicPattern: "Nested Data / UI",
        whatInterviewerTests: "Handling hierarchical data structures in UI.",
        exampleInput: "Comments with nested replies up to 3 levels",
        expectedOutput: "Threaded comments with indentation and collapse controls.",
        constraints: "Must handle infinite nesting depth gracefully.",
        hint: "Use recursive component rendering with depth-based styling.",
      },
      {
        id: 40,
        question:
          "Create a video player component with playback controls, quality selection, and picture-in-picture.",
        difficulty: "Easy-Medium",
        topicPattern: "Video Player / Media Controls",
        whatInterviewerTests: "Building custom video player with advanced features.",
        exampleInput: "Video URL with multiple quality options",
        expectedOutput: "Video player with controls, quality picker, PiP mode.",
        constraints: "Must handle buffering and error states.",
        hint: "Use expo-av or react-native-video for playback.",
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
          "Design and implement a complete Instagram feed with posts, stories, and explore sections using React Native.",
        difficulty: "Easy-Medium",
        topicPattern: "Architecture / Full App Design",
        whatInterviewerTests: "End-to-end app architecture and component design.",
        exampleInput: "Complete app requirements",
        expectedOutput: "Working feed with all three main sections.",
        constraints: "Must handle navigation, state management, and API integration.",
        hint: "Start with navigation setup, then build each section independently.",
      },
      {
        id: 42,
        question:
          "Implement a real-time collaboration feature for creating group stories with multiple contributors.",
        difficulty: "Easy-Medium",
        topicPattern: "Real-time / Collaboration",
        whatInterviewerTests: "Handling concurrent user actions and state sync.",
        exampleInput: "Multiple users contributing to a story",
        expectedOutput: "Real-time updates showing all contributors' additions.",
        constraints: "Must handle conflicts when two users edit simultaneously.",
        hint: "Use operational transforms or last-write-wins strategy with Firebase.",
      },
      {
        id: 43,
        question:
          "Build an AI-powered content recommendation system that suggests posts based on user engagement.",
        difficulty: "Easy-Medium",
        topicPattern: "Machine Learning / Recommendations",
        whatInterviewerTests: "Integrating ML models and recommendation logic.",
        exampleInput: "User engagement history",
        expectedOutput: "Personalized feed based on interests and behavior.",
        constraints: "Must update recommendations in real-time.",
        hint: "Use TensorFlow.js for on-device ML or a cloud ML API.",
      },
      {
        id: 44,
        question:
          "Create a content moderation system that detects and filters inappropriate images and text.",
        difficulty: "Easy-Medium",
        topicPattern: "Content Moderation / Safety",
        whatInterviewerTests: "Implementing content safety features.",
        exampleInput: "User-submitted content",
        expectedOutput: "Content flagged or blocked based on safety rules.",
        constraints: "Must handle false positives and appeals process.",
        hint: "Use cloud-based content moderation APIs like AWS Rekognition.",
      },
      {
        id: 45,
        question:
          "Implement a complete Instagram Shopping feature with product tagging, checkout, and order tracking.",
        difficulty: "Easy-Medium",
        topicPattern: "E-commerce / Shopping",
        whatInterviewerTests: "Building complex e-commerce features.",
        exampleInput: "Products to tag in posts",
        expectedOutput: "Shoppable posts with checkout flow and order status.",
        constraints: "Must integrate with payment processors securely.",
        hint: "Use Stripe for payments and a commerce API for product management.",
      },
      {
        id: 46,
        question:
          "Build an accessibility-first Instagram clone that works with VoiceOver/TalkBack and keyboard navigation.",
        difficulty: "Easy-Medium",
        topicPattern: "Accessibility / Inclusive Design",
        whatInterviewerTests: "Implementing accessibility best practices.",
        exampleInput: "App with accessibility features",
        expectedOutput: "Fully navigable app with screen reader support.",
        constraints: "Must meet WCAG 2.1 AA standards.",
        hint: "Use accessibilityLabel, accessibilityRole, and proper semantic structure.",
      },
      {
        id: 47,
        question:
          "Design a complete Instagram Business profile with insights, promotions, and contact options.",
        difficulty: "Easy-Medium",
        topicPattern: "Business Features / Analytics",
        whatInterviewerTests: "Building business-specific features.",
        exampleInput: "Business account data",
        expectedOutput: "Business profile with analytics dashboard and promotion tools.",
        constraints: "Must handle different business categories and verification.",
        hint: "Use Instagram Graph API for business features.",
      },
      {
        id: 48,
        question:
          "Implement a multi-language support system with RTL layout for Arabic/Hebrew.",
        difficulty: "Easy-Medium",
        topicPattern: "Internationalization / RTL",
        whatInterviewerTests: "Handling internationalization and layout direction.",
        exampleInput: "App with English and Arabic",
        expectedOutput: "App switches languages with proper RTL layout.",
        constraints: "Must handle dynamic text sizing and locale-specific formatting.",
        hint: "Use i18next for translations and flexDirection: 'row-reverse' for RTL.",
      },
      {
        id: 49,
        question:
          "Create an Instagram Clone with performance optimizations that achieves 60fps scrolling with 1000+ posts.",
        difficulty: "Easy-Medium",
        topicPattern: "Performance Optimization",
        whatInterviewerTests: "Optimizing React Native performance at scale.",
        exampleInput: "Feed with 1000+ posts",
        expectedOutput: "Smooth 60fps scrolling with proper memory management.",
        constraints: "Must profile and optimize render cycles.",
        hint: "Use React.memo, useMemo, useCallback, and virtualized lists.",
      },
      {
        id: 50,
        question:
          "Design a complete Instagram Live feature with real-time streaming, comments, and virtual gifts.",
        difficulty: "Easy-Medium",
        topicPattern: "Live Streaming / Real-time",
        whatInterviewerTests: "Building complex real-time features.",
        exampleInput: "Live stream setup",
        expectedOutput: "Working live stream with viewer interaction.",
        constraints: "Must handle stream quality and connection issues.",
        hint: "Use WebRTC for streaming and Socket.io for real-time chat.",
      },
    ],
  },
];

export const INSTAGRAM_PREP_PLAN = {
  title: "30-Day Instagram Clone Preparation Plan",
  goal: "Master React Native development by building an Instagram clone. Focus on practical skills for mobile app development. Code every day.",
  dailyRoutine: [
    "Pick 1–2 problems from the current day's list.",
    "Solve without looking anything up first (set a 20–30 min timer).",
    "If stuck, use only the hint. Try again.",
    "Write clean, readable JavaScript/TypeScript.",
    "After solving, test on both iOS and Android if possible.",
    "End by writing 2–3 test cases (including edge cases).",
  ],
  weeks: [
    {
      week: 1,
      title: "Foundations",
      days: [
        "Days 1–2: Questions 1–10 (Very Easy). Master basic components and props.",
        "Days 3–4: Questions 11–15. Focus on FlatList, ScrollView, and navigation.",
        "Days 5–6: Questions 16–20. Gesture handling, forms, and camera UI.",
        "Day 7: Review all of Week 1. Re-solve any that felt weak.",
      ],
    },
    {
      week: 2,
      title: "Core Patterns",
      days: [
        "Days 8–9: Image caching, infinite scroll, and pagination (21, 23, 31).",
        "Days 10–11: Real-time features, push notifications, and deep linking (22, 32, 33).",
        "Days 12–13: Media handling, dark mode, and keyboard management (28, 29, 34).",
        "Day 14: Full review of Level 3. Build a mini-feature combining multiple concepts.",
      ],
    },
    {
      week: 3,
      title: "Advanced Features",
      days: [
        "Days 15–16: Gesture navigation, onboarding, and media picker (35, 36, 37).",
        "Days 17–18: Analytics, threaded comments, and video player (38, 39, 40).",
        "Days 19–20: Complete feed implementation with all features (41, 42).",
        "Day 21: Simulate building a complete feature from scratch in 60–75 minutes.",
      ],
    },
    {
      week: 4,
      title: "Mock Interviews & Integration",
      days: [
        "Days 22–23: AI recommendations and content moderation (43, 44).",
        "Days 24–25: E-commerce and accessibility features (45, 46).",
        "Days 26–27: Business features, i18n, and performance (47, 48, 49).",
        "Day 28: Full mock: Pick 4 mixed problems (one from each Level 2–5). Solve under timed conditions (90 min).",
        "Day 29: Review every problem you struggled with. Re-solve without looking at old code.",
        "Day 30: Final mixed set of 5 problems. Focus on clean code, explaining approach out loud.",
      ],
    },
  ],
  ongoingRules: [
    "Never jump to solutions. Struggle productively.",
    "When you later send me code, I will review your approach first, point out issues, give progressive hints, and only reveal a full solution if you explicitly request it.",
    "Always discuss performance implications and how an interviewer would evaluate the solution.",
    "After every problem, invent 1–2 follow-up variations yourself.",
  ],
};
