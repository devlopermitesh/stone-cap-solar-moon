export type ShortQuestion = {
  id: number;
  topic: string;
  question: string;
  answer: string;
};

export const SHORT_QUESTIONS: ShortQuestion[] = [
  {
    id: 1,
    topic: "JavaScript",
    question: "What is the difference between var, let, and const?",
    answer:
      "var is function-scoped and hoisted; let and const are block-scoped. const cannot be reassigned after declaration.",
  },
  {
    id: 2,
    topic: "JavaScript",
    question: "Explain closures in JavaScript.",
    answer:
      "A closure is a function that remembers variables from its outer scope even after that outer function has finished executing.",
  },
  {
    id: 3,
    topic: "JavaScript",
    question: "What is the difference between == and === in JavaScript?",
    answer:
      "== compares values after type coercion, while === compares both value and type without coercion.",
  },
  {
    id: 4,
    topic: "JavaScript",
    question: "What is hoisting?",
    answer:
      "Hoisting is JavaScript's default behavior of moving variable and function declarations to the top of their scope before code execution.",
  },
  {
    id: 5,
    topic: "Node.js",
    question: "Explain the concept of the event loop.",
    answer:
      "The event loop lets Node.js perform non-blocking I/O by pushing callbacks to a queue and executing them once the call stack is empty.",
  },
  {
    id: 6,
    topic: "JavaScript",
    question: "What are promises and how do they work?",
    answer:
      "Promises represent the eventual result of an async operation, with states pending, fulfilled, or rejected, and are handled using .then/.catch or async/await.",
  },
  {
    id: 7,
    topic: "General",
    question: "Difference between synchronous and asynchronous code?",
    answer:
      "Synchronous code runs line by line and blocks execution, while asynchronous code allows other operations to continue while waiting for a task to complete.",
  },
  {
    id: 8,
    topic: "JavaScript",
    question: "What is the 'this' keyword and how does it behave differently in arrow functions?",
    answer:
      "'this' refers to the object that calls the function; arrow functions don't have their own 'this' and inherit it from the enclosing lexical scope.",
  },
  {
    id: 9,
    topic: "JavaScript",
    question: "What is event bubbling and capturing?",
    answer:
      "Bubbling propagates an event from the target element up to its ancestors; capturing propagates from the root down to the target.",
  },
  {
    id: 10,
    topic: "JavaScript",
    question: "What is debouncing and throttling?",
    answer:
      "Debouncing delays a function call until after a pause in events; throttling limits a function to run at most once in a fixed time interval.",
  },
  {
    id: 11,
    topic: "JavaScript",
    question: "Explain prototypal inheritance in JavaScript.",
    answer:
      "Objects can inherit properties and methods directly from other objects through the prototype chain, rather than classical class-based inheritance.",
  },
  {
    id: 12,
    topic: "JavaScript",
    question: "What is the difference between null and undefined?",
    answer:
      "undefined means a variable has been declared but not assigned a value; null is an explicit assignment representing 'no value'.",
  },
  {
    id: 13,
    topic: "JavaScript",
    question: "What are higher-order functions?",
    answer:
      "Functions that take other functions as arguments or return a function, such as map, filter, and reduce.",
  },
  {
    id: 14,
    topic: "JavaScript",
    question: "What is destructuring in ES6?",
    answer:
      "A syntax to unpack values from arrays or properties from objects into distinct variables, e.g. const {name} = user.",
  },
  {
    id: 15,
    topic: "JavaScript",
    question: "Explain async/await and how it differs from promises.",
    answer:
      "async/await is syntactic sugar over promises that lets asynchronous code be written and read like synchronous code, improving readability.",
  },
  {
    id: 16,
    topic: "React",
    question: "What is React and why is it used?",
    answer:
      "React is a JavaScript library for building UIs using reusable components and a virtual DOM for efficient rendering.",
  },
  {
    id: 17,
    topic: "React",
    question: "What is the Virtual DOM?",
    answer:
      "An in-memory representation of the real DOM that React uses to calculate the minimal set of changes needed before updating the actual DOM.",
  },
  {
    id: 18,
    topic: "General",
    question: "Difference between functional and class components?",
    answer:
      "Functional components are plain JS functions that use hooks for state and lifecycle; class components use ES6 classes with lifecycle methods.",
  },
  {
    id: 19,
    topic: "React",
    question: "What are React hooks?",
    answer:
      "Functions like useState and useEffect that let functional components use state and lifecycle features without writing a class.",
  },
  {
    id: 20,
    topic: "React",
    question: "Explain useState and useEffect.",
    answer:
      "useState manages local component state; useEffect runs side effects like data fetching or subscriptions after render, based on a dependency array.",
  },
  {
    id: 21,
    topic: "React",
    question: "What is the useContext hook used for?",
    answer:
      "It lets components access values from React Context directly, avoiding prop drilling through many component levels.",
  },
  {
    id: 22,
    topic: "React",
    question: "What is prop drilling and how do you avoid it?",
    answer:
      "Passing props through many nested components to reach a deeply nested child; it can be avoided using Context API or state management libraries.",
  },
  {
    id: 23,
    topic: "React",
    question: "What are keys in React lists and why are they important?",
    answer:
      "Keys are unique identifiers that help React efficiently identify which list items changed, were added, or removed during re-renders.",
  },
  {
    id: 24,
    topic: "React",
    question: "What is the difference between controlled and uncontrolled components?",
    answer:
      "Controlled components have their form data managed by React state; uncontrolled components manage their own state internally via the DOM using refs.",
  },
  {
    id: 25,
    topic: "React",
    question: "What is React.memo used for?",
    answer:
      "It memoizes a component so it only re-renders when its props actually change, improving performance.",
  },
  {
    id: 26,
    topic: "React",
    question: "Explain useMemo and useCallback.",
    answer:
      "useMemo memoizes a computed value; useCallback memoizes a function reference, both to avoid unnecessary recalculations or re-renders.",
  },
  {
    id: 27,
    topic: "React",
    question: "What is the purpose of useRef?",
    answer:
      "useRef creates a mutable reference that persists across renders without causing a re-render, often used to access DOM elements directly.",
  },
  {
    id: 28,
    topic: "General",
    question: "What are custom hooks?",
    answer:
      "Reusable functions prefixed with 'use' that extract and share stateful logic between multiple components.",
  },
  {
    id: 29,
    topic: "React",
    question: "How does React Router work?",
    answer:
      "It enables client-side navigation by mapping URL paths to components without a full page reload, using components like Routes and Route.",
  },
  {
    id: 30,
    topic: "React",
    question: "What is the significance of the dependency array in useEffect?",
    answer:
      "It tells React when to re-run the effect; an empty array runs it once on mount, while listing variables re-runs it when those change.",
  },
  {
    id: 31,
    topic: "React",
    question: "What is state lifting in React?",
    answer:
      "Moving shared state up to the nearest common ancestor component so multiple children can access and update it consistently.",
  },
  {
    id: 32,
    topic: "React",
    question: "What is the difference between state and props?",
    answer:
      "Props are read-only data passed from parent to child; state is data managed internally within a component and can change over time.",
  },
  {
    id: 33,
    topic: "React",
    question: "What is React's reconciliation algorithm?",
    answer:
      "The diffing process React uses to compare the new virtual DOM tree with the previous one and update only the changed parts in the real DOM.",
  },
  {
    id: 34,
    topic: "React",
    question: "How do you handle forms in React?",
    answer:
      "Using controlled components where input values are tied to state via value and onChange, often combined with libraries like Formik or React Hook Form.",
  },
  {
    id: 35,
    topic: "React",
    question: "What is server-side rendering (SSR) and how does Next.js implement it?",
    answer:
      "SSR renders pages on the server for each request; Next.js supports this via getServerSideProps or the App Router's server components.",
  },
  {
    id: 36,
    topic: "Node.js",
    question: "What is Node.js and why is it used for backend development?",
    answer:
      "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows non-blocking, event-driven server-side development using JavaScript.",
  },
  {
    id: 37,
    topic: "Node.js",
    question: "What is the difference between Node.js and traditional server-side languages?",
    answer:
      "Node.js uses a single-threaded, non-blocking event loop, whereas traditional servers often use multi-threaded, blocking I/O models.",
  },
  {
    id: 38,
    topic: "Node.js",
    question: "What is npm and package.json?",
    answer:
      "npm is Node's package manager for installing dependencies; package.json lists project metadata, dependencies, and scripts.",
  },
  {
    id: 39,
    topic: "Node.js",
    question: "What is middleware in Express.js?",
    answer:
      "Functions that have access to the request, response, and next object, used to process requests before they reach the route handler.",
  },
  {
    id: 40,
    topic: "Node.js",
    question: "How do you handle errors in Express applications?",
    answer:
      "Using try/catch with async routes and a centralized error-handling middleware with four parameters (err, req, res, next).",
  },
  {
    id: 41,
    topic: "Node.js",
    question: "What is the difference between require and import in Node.js?",
    answer:
      "require is CommonJS's synchronous module loading, while import is ES module syntax that supports static analysis and tree-shaking.",
  },
  {
    id: 42,
    topic: "Node.js",
    question: "Explain the Node.js event-driven architecture.",
    answer:
      "Node uses an event loop and callbacks/events to handle multiple operations concurrently without creating new threads for each request.",
  },
  {
    id: 43,
    topic: "Node.js",
    question: "What are streams in Node.js?",
    answer:
      "Objects that let you read or write data piece by piece rather than loading it all into memory, useful for large files or network data.",
  },
  {
    id: 44,
    topic: "REST APIs",
    question: "What is the purpose of the package-lock.json file?",
    answer:
      "It locks exact dependency versions to ensure consistent installs across different environments and machines.",
  },
  {
    id: 45,
    topic: "Node.js",
    question: "How do you create a REST API in Express?",
    answer:
      "By defining routes for HTTP methods (GET, POST, PUT, DELETE) mapped to controller functions that interact with a database and return JSON.",
  },
  {
    id: 46,
    topic: "Node.js",
    question: "What is CORS and how do you handle it in Node.js?",
    answer:
      "CORS is a browser security feature restricting cross-origin requests; it's handled in Express using the cors middleware to allow specific origins.",
  },
  {
    id: 47,
    topic: "Node.js",
    question: "How does Node.js handle concurrency with a single thread?",
    answer:
      "It uses the event loop and libuv's thread pool to offload I/O operations, allowing non-blocking concurrent handling of requests.",
  },
  {
    id: 48,
    topic: "Node.js",
    question: "What is JWT and how is it used for authentication?",
    answer:
      "JSON Web Token is a signed token containing user claims; the server issues it on login and verifies it on protected routes to authenticate requests.",
  },
  {
    id: 49,
    topic: "Node.js",
    question: "Difference between session-based and token-based authentication?",
    answer:
      "Session-based auth stores state on the server with a session ID in a cookie; token-based auth is stateless, with the client sending a token like JWT on each request.",
  },
  {
    id: 50,
    topic: "Node.js",
    question: "What is the purpose of environment variables and dotenv?",
    answer:
      "They store configuration like API keys and DB URLs outside code; dotenv loads them from a .env file into process.env during development.",
  },
  {
    id: 51,
    topic: "Node.js",
    question: "How do you connect Node.js to a MongoDB database?",
    answer:
      "Using an ODM like Mongoose to define schemas and models, then connecting via mongoose.connect with the database URI.",
  },
  {
    id: 52,
    topic: "Node.js",
    question: "What is Socket.IO used for?",
    answer:
      "It enables real-time, bidirectional communication between client and server over WebSockets, useful for chat apps and live updates.",
  },
  {
    id: 53,
    topic: "JavaScript",
    question: "What is rate limiting and why is it important?",
    answer:
      "Restricting the number of requests a client can make in a time window to prevent abuse, brute force attacks, and server overload.",
  },
  {
    id: 54,
    topic: "React",
    question: "How do you handle file uploads in Node.js?",
    answer:
      "Using middleware like multer to parse multipart/form-data and store or stream uploaded files to disk or cloud storage.",
  },
  {
    id: 55,
    topic: "Node.js",
    question: "What is the difference between process.nextTick and setImmediate?",
    answer:
      "process.nextTick queues a callback to run immediately after the current operation, before the event loop continues; setImmediate runs it in the next event loop iteration.",
  },
  {
    id: 56,
    topic: "Databases",
    question: "What is the difference between SQL and NoSQL databases?",
    answer:
      "SQL databases are relational with fixed schemas and use tables (e.g. PostgreSQL); NoSQL databases are schema-flexible and store data as documents, key-value, or graphs (e.g. MongoDB).",
  },
  {
    id: 57,
    topic: "General",
    question: "What is indexing in databases and why is it important?",
    answer:
      "Indexing creates a data structure that speeds up query lookups on specific columns, improving read performance at the cost of extra storage and slower writes.",
  },
  {
    id: 58,
    topic: "Databases",
    question: "What is normalization in databases?",
    answer:
      "Organizing data to reduce redundancy by splitting it into related tables, ensuring consistency and reducing update anomalies.",
  },
  {
    id: 59,
    topic: "Node.js",
    question: "What is Prisma and how does it help in Node.js apps?",
    answer:
      "Prisma is a type-safe ORM that lets you define a schema and generates a client to query the database with auto-completion and migrations.",
  },
  {
    id: 60,
    topic: "Databases",
    question: "What is a database transaction?",
    answer:
      "A sequence of operations executed as a single unit, following ACID properties, so either all operations succeed or none are applied.",
  },
  {
    id: 61,
    topic: "Databases",
    question: "What is the difference between one-to-many and many-to-many relationships?",
    answer:
      "One-to-many links one record to multiple related records; many-to-many links multiple records on both sides, usually via a junction table.",
  },
  {
    id: 62,
    topic: "React",
    question: "What are database migrations?",
    answer:
      "Version-controlled scripts that incrementally change the database schema, keeping it in sync across environments as the application evolves.",
  },
  {
    id: 63,
    topic: "Databases",
    question: "What is connection pooling?",
    answer:
      "Reusing a fixed set of database connections across requests instead of opening a new connection each time, improving performance and resource usage.",
  },
  {
    id: 64,
    topic: "Databases",
    question: "How do you prevent SQL injection?",
    answer:
      "By using parameterized queries or ORMs that automatically escape inputs instead of concatenating raw user input into SQL strings.",
  },
  {
    id: 65,
    topic: "Databases",
    question: "What is the difference between SQL JOIN types (INNER, LEFT, RIGHT)?",
    answer:
      "INNER JOIN returns matching rows in both tables; LEFT JOIN returns all rows from the left table plus matches; RIGHT JOIN does the same from the right table.",
  },
  {
    id: 66,
    topic: "Databases",
    question: "What is REST API and its key principles?",
    answer:
      "An architectural style for APIs using stateless HTTP requests, standard methods (GET/POST/PUT/DELETE), and resource-based URLs.",
  },
  {
    id: 67,
    topic: "REST APIs",
    question: "What is the difference between REST and GraphQL?",
    answer:
      "REST exposes fixed endpoints returning fixed data shapes, while GraphQL lets clients query exactly the fields they need through a single endpoint.",
  },
  {
    id: 68,
    topic: "Node.js",
    question: "How do you secure a Node.js/Express API?",
    answer:
      "Using HTTPS, input validation, rate limiting, helmet for security headers, JWT authentication, and sanitizing inputs against injection attacks.",
  },
  {
    id: 69,
    topic: "React",
    question: "What is the purpose of NextAuth or Clerk in a Next.js app?",
    answer:
      "They provide ready-made authentication solutions handling sessions, OAuth providers, and token management so you don't build auth from scratch.",
  },
  {
    id: 70,
    topic: "DevOps",
    question: "How do payment gateways like Stripe or Razorpay integrate into a fullstack app?",
    answer:
      "The frontend collects payment details via their SDK, the backend creates an order/payment intent and verifies webhooks to confirm successful transactions.",
  },
  {
    id: 71,
    topic: "Node.js",
    question: "What is the role of Redis in a fullstack application?",
    answer:
      "Redis is an in-memory data store used for caching, session storage, and rate limiting to reduce database load and improve response times.",
  },
  {
    id: 72,
    topic: "Security",
    question: "What is the difference between authentication and authorization?",
    answer:
      "Authentication verifies who a user is; authorization determines what actions or resources that authenticated user is allowed to access.",
  },
  {
    id: 73,
    topic: "React",
    question: "How would you structure a fullstack MERN application?",
    answer:
      "Separate client (React) and server (Express/Node) folders, with clear layers for routes, controllers, models, and shared config, connected via REST or GraphQL APIs.",
  },
  {
    id: 74,
    topic: "DevOps",
    question: "What is CI/CD and why is it useful?",
    answer:
      "Continuous Integration/Continuous Deployment automates testing and deploying code changes, catching issues early and enabling faster, reliable releases.",
  },
  {
    id: 75,
    topic: "DevOps",
    question: "What is the difference between monolithic and microservices architecture?",
    answer:
      "A monolith is one deployable codebase for the whole app, while microservices split functionality into independently deployable services communicating over APIs.",
  },
  {
    id: 76,
    topic: "React",
    question: "How do you handle state management in large React applications?",
    answer:
      "Using tools like Redux, Zustand, or Context API to centralize and manage shared state predictably across many components.",
  },
  {
    id: 77,
    topic: "REST APIs",
    question: "What is API versioning and why is it needed?",
    answer:
      "Adding version identifiers (e.g. /api/v1/) to APIs so you can evolve them without breaking existing client integrations.",
  },
  {
    id: 78,
    topic: "REST APIs",
    question: "What is a webhook and how is it used in payment systems?",
    answer:
      "A webhook is a server endpoint that a third-party service (like Stripe) calls automatically to notify your app of events such as successful payments.",
  },
  {
    id: 79,
    topic: "React",
    question: "How do you optimize a React application for performance?",
    answer:
      "Techniques include code splitting, lazy loading, memoization (React.memo/useMemo), avoiding unnecessary re-renders, and optimizing images/assets.",
  },
  {
    id: 80,
    topic: "Node.js",
    question: "What is Payload CMS and why would you use it?",
    answer:
      "Payload is a headless, code-first CMS built on Node.js that gives full control over the admin panel, schema, and API for content-driven apps.",
  },
  {
    id: 81,
    topic: "Git",
    question: "What is the difference between git merge and git rebase?",
    answer:
      "Merge combines branch histories with a new merge commit preserving history; rebase replays commits onto another branch for a linear history.",
  },
  {
    id: 82,
    topic: "Git",
    question: "What is the purpose of a .gitignore file?",
    answer:
      "It specifies files and folders (like node_modules or .env) that Git should not track or commit to the repository.",
  },
  {
    id: 83,
    topic: "React",
    question: "How do you deploy a Node.js/React application to production?",
    answer:
      "Common approaches include building the frontend, hosting the backend on services like Render/Railway/AWS, and using environment variables and a reverse proxy like Nginx.",
  },
  {
    id: 84,
    topic: "DevOps",
    question: "What is Docker and why is it useful in development?",
    answer:
      "Docker packages an application with its dependencies into a container, ensuring consistent behavior across different environments.",
  },
  {
    id: 85,
    topic: "REST APIs",
    question: "What is the difference between GET and POST requests?",
    answer:
      "GET retrieves data and is typically cached/idempotent with parameters in the URL; POST submits data to the server, often changing state, with data in the request body.",
  },
  {
    id: 86,
    topic: "JavaScript",
    question: "Tell me about yourself.",
    answer:
      "A brief walkthrough of your background, key skills (MERN, TypeScript), relevant projects, and what you're looking for in this role.",
  },
  {
    id: 87,
    topic: "Behavioral",
    question: "Why do you want to work as a Web Developer at our company?",
    answer:
      "Connect your skills and interests to the company's work, showing genuine enthusiasm for the role and growth opportunities.",
  },
  {
    id: 88,
    topic: "General",
    question: "What are your strengths and weaknesses?",
    answer:
      "Mention strengths relevant to development (problem-solving, quick learner) and a genuine weakness paired with how you're improving it.",
  },
  {
    id: 89,
    topic: "Behavioral",
    question: "Describe a challenging project you worked on.",
    answer:
      "Briefly explain the problem, your approach/technologies used, obstacles faced, and the outcome or what you learned.",
  },
  {
    id: 90,
    topic: "General",
    question: "How do you handle tight deadlines?",
    answer:
      "Explain your approach to prioritizing tasks, breaking work into smaller steps, and communicating proactively about blockers.",
  },
  {
    id: 91,
    topic: "Node.js",
    question: "Where do you see yourself in the next few years?",
    answer:
      "Express a realistic growth path, such as deepening technical expertise and taking on more ownership within a development team.",
  },
  {
    id: 92,
    topic: "Behavioral",
    question: "How do you stay updated with new technologies?",
    answer:
      "Mention following documentation, building side projects, tutorials, and communities to keep learning continuously.",
  },
  {
    id: 93,
    topic: "Behavioral",
    question: "How do you handle feedback or criticism on your code?",
    answer:
      "Describe an open, growth-oriented approach — viewing code reviews as a way to learn and improve rather than taking it personally.",
  },
  {
    id: 94,
    topic: "Node.js",
    question: "Are you comfortable working in a team environment?",
    answer:
      "Affirm your comfort with collaboration, mentioning experience with version control, code reviews, and clear communication.",
  },
  {
    id: 95,
    topic: "Behavioral",
    question: "Do you have any questions for us?",
    answer:
      "Prepare thoughtful questions about the tech stack, team structure, project expectations, or growth opportunities at the company.",
  },
  {
    id: 96,
    topic: "Node.js",
    question: "How would you design a URL shortener service?",
    answer:
      "Generate a unique short code (hash or counter-based) mapped to the original URL in a database, with a redirect endpoint and optional analytics/caching.",
  },
  {
    id: 97,
    topic: "Node.js",
    question: "How would you scale a Node.js application to handle more traffic?",
    answer:
      "Use load balancing across multiple instances, caching with Redis, database indexing/read replicas, and horizontal scaling behind a reverse proxy.",
  },
  {
    id: 98,
    topic: "Databases",
    question: "What is caching and why is it important in system design?",
    answer:
      "Caching stores frequently accessed data in fast storage (like Redis) to reduce repeated expensive computations or database calls, improving response times.",
  },
  {
    id: 99,
    topic: "Node.js",
    question: "How would you design a real-time chat application?",
    answer:
      "Use WebSockets (e.g. Socket.IO) for real-time messaging, a database for message persistence, and rooms/namespaces to manage separate conversations.",
  },
  {
    id: 100,
    topic: "General",
    question: "What is load balancing?",
    answer:
      "Distributing incoming network traffic across multiple servers to prevent any single server from becoming a bottleneck and to improve reliability.",
  },
  {
    id: 101,
    topic: "React",
    question: "What is React and why is it popular?",
    answer:
      "React is a JavaScript library for building user interfaces using reusable components. It uses a Virtual DOM for efficient updates and has a large ecosystem, making it ideal for dynamic web apps.",
  },
  {
    id: 102,
    topic: "React",
    question: "What is the difference between state and props in React?",
    answer:
      "Props are read-only data passed from parent to child. State is mutable data managed inside a component that triggers re-renders when updated.",
  },
  {
    id: 103,
    topic: "React",
    question: "Explain useState Hook.",
    answer:
      "useState lets you add state to functional components. It returns the current state value and a setter function. Example: const [count, setCount] = useState(0);",
  },
  {
    id: 104,
    topic: "React",
    question: "Explain useEffect Hook and its dependency array.",
    answer:
      "useEffect runs side effects after render. Empty dependency array [] runs once on mount. Including values re-runs the effect when those values change. Always clean up subscriptions in the return function.",
  },
  {
    id: 105,
    topic: "React",
    question: "What causes a React component to re-render?",
    answer:
      "A component re-renders when its state changes, its props change, or its parent re-renders. React then diffs the new Virtual DOM and updates only changed parts of the real DOM.",
  },
  {
    id: 106,
    topic: "React",
    question: "What is React Context API?",
    answer:
      "A way to share data across the component tree without prop drilling. You create a Context, wrap components with a Provider, and consume values using useContext.",
  },
  {
    id: 107,
    topic: "React",
    question: "When would you use useMemo?",
    answer:
      "useMemo memoizes the result of an expensive calculation so it only recomputes when dependencies change. Use it for costly computations, not for simple values.",
  },
  {
    id: 108,
    topic: "React",
    question: "When would you use useCallback?",
    answer:
      "useCallback memoizes a function reference so it stays stable across renders. Useful when passing callbacks to memoized child components (React.memo) to prevent unnecessary re-renders.",
  },
  {
    id: 109,
    topic: "React",
    question: "What is React.memo?",
    answer:
      "A higher-order component that memoizes a functional component. It skips re-rendering if props haven't changed (shallow comparison).",
  },
  {
    id: 110,
    topic: "React",
    question: "What are the rules of Hooks?",
    answer:
      "1. Only call Hooks at the top level (not inside loops, conditions, or nested functions). 2. Only call Hooks from React function components or custom Hooks. This ensures consistent order of Hook calls.",
  },
  {
    id: 111,
    topic: "React",
    question: "What is a custom Hook?",
    answer:
      "A JavaScript function starting with 'use' that encapsulates reusable stateful logic using other Hooks. Example: useFetch, useLocalStorage, useDebounce.",
  },
  {
    id: 112,
    topic: "React",
    question: "What is the key prop in React lists and why is it important?",
    answer:
      "Key is a unique identifier for list items. It helps React efficiently identify which items changed, were added, or removed during reconciliation. Avoid using array index as key when possible.",
  },
  {
    id: 113,
    topic: "React",
    question: "What is lazy loading in React?",
    answer:
      "Loading components or resources only when needed. Use React.lazy() + Suspense for code-splitting components, or Intersection Observer for images.",
  },
  {
    id: 114,
    topic: "React",
    question: "How do you optimize performance in a React app?",
    answer:
      "Use React.memo, useMemo, useCallback, code-splitting (React.lazy), avoid unnecessary state, virtualize long lists, and profile with React DevTools.",
  },
  {
    id: 115,
    topic: "React",
    question: "What is the difference between useEffect and useLayoutEffect?",
    answer:
      "useEffect runs asynchronously after the browser paints. useLayoutEffect runs synchronously after DOM mutations but before paint. Prefer useEffect unless you need to measure or mutate the DOM before paint.",
  },
  {
    id: 116,
    topic: "React",
    question: "What is JSX?",
    answer:
      "JSX is a syntax extension that looks like HTML but is written in JavaScript. It gets transpiled to React.createElement calls.",
  },
  {
    id: 117,
    topic: "JavaScript",
    question: "What is the difference between functional and class components?",
    answer:
      "Functional components are simpler functions that use Hooks for state and effects. Class components use this.state and lifecycle methods. Functional + Hooks is the modern standard.",
  },
  {
    id: 118,
    topic: "React",
    question: "What is lifting state up in React?",
    answer:
      "Moving shared state to the closest common parent component so multiple children can access and update it via props.",
  },
  {
    id: 119,
    topic: "React",
    question: "What is reconciliation in React?",
    answer:
      "The process React uses to compare the new Virtual DOM with the previous one and calculate the minimal set of changes to apply to the real DOM.",
  },
  {
    id: 120,
    topic: "Node.js",
    question: "What is Node.js?",
    answer:
      "A JavaScript runtime built on Chrome's V8 engine that allows running JavaScript on the server. It is event-driven and non-blocking, ideal for I/O-heavy applications.",
  },
  {
    id: 121,
    topic: "Node.js",
    question: "What is the Node.js Event Loop?",
    answer:
      "A mechanism that handles asynchronous operations. It continuously checks the call stack and callback queues, allowing non-blocking I/O on a single thread.",
  },
  {
    id: 122,
    topic: "Node.js",
    question: "What is Express.js?",
    answer:
      "A minimal and flexible Node.js web framework that simplifies routing, middleware, and handling HTTP requests/responses for building APIs and web apps.",
  },
  {
    id: 123,
    topic: "Node.js",
    question: "What is middleware in Express?",
    answer:
      "Functions that have access to req, res, and next. They can execute code, modify request/response, end the cycle, or call next() to pass control. Examples: body-parser, auth, logging.",
  },
  {
    id: 124,
    topic: "Node.js",
    question: "How do you create a basic Express server?",
    answer:
      "const express = require('express'); const app = express(); app.get('/', (req, res) => res.send('Hello')); app.listen(3000);",
  },
  {
    id: 125,
    topic: "Node.js",
    question: "What is the difference between app.get() and app.post()?",
    answer:
      "app.get() handles GET requests (retrieve data). app.post() handles POST requests (create/submit data). They match HTTP methods to route handlers.",
  },
  {
    id: 126,
    topic: "Node.js",
    question: "How do you handle errors in Express?",
    answer:
      "Use a four-parameter error-handling middleware: (err, req, res, next). Place it last. For async routes, wrap handlers or use a helper to catch and pass errors to next(err).",
  },
  {
    id: 127,
    topic: "Node.js",
    question: "What is CORS and how do you enable it in Express?",
    answer:
      "Cross-Origin Resource Sharing – browser security feature that blocks requests from different origins. Enable with the cors package: app.use(cors()) or configure allowed origins.",
  },
  {
    id: 128,
    topic: "REST APIs",
    question: "What is the difference between PUT and PATCH?",
    answer:
      "PUT replaces the entire resource. PATCH partially updates a resource. Use PATCH when updating only specific fields.",
  },
  {
    id: 129,
    topic: "Node.js",
    question: "How do you serve static files in Express?",
    answer:
      "Use express.static middleware: app.use(express.static('public')); This serves files from the public folder.",
  },
  {
    id: 130,
    topic: "Databases",
    question: "What is REST API?",
    answer:
      "Representational State Transfer – an architectural style for designing networked applications using standard HTTP methods (GET, POST, PUT, DELETE) and status codes.",
  },
  {
    id: 131,
    topic: "REST APIs",
    question: "Explain common HTTP status codes.",
    answer:
      "200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error. Use appropriate codes for clear API responses.",
  },
  {
    id: 132,
    topic: "Node.js",
    question: "How do you parse JSON body in Express?",
    answer:
      "Use the built-in middleware: app.use(express.json()); It parses incoming JSON request bodies into req.body.",
  },
  {
    id: 133,
    topic: "Node.js",
    question: "What is the difference between require and import?",
    answer:
      "require is CommonJS (Node.js traditional). import/export is ES Modules (modern). Node supports both; use type: module in package.json for ES Modules.",
  },
  {
    id: 134,
    topic: "Node.js",
    question: "What is package.json?",
    answer:
      "A file that holds project metadata, scripts, and dependencies. npm uses it to install packages and run scripts.",
  },
  {
    id: 135,
    topic: "Node.js",
    question: "What is npm?",
    answer:
      "Node Package Manager – the default package manager for Node.js. Used to install, update, and manage project dependencies.",
  },
  {
    id: 136,
    topic: "Node.js",
    question: "How does authentication work with JWT?",
    answer:
      "User logs in → server verifies credentials and issues a signed JWT → client stores token (preferably httpOnly cookie) → client sends token on subsequent requests → server verifies signature and grants access.",
  },
  {
    id: 137,
    topic: "Node.js",
    question: "How do you hash passwords in Node.js?",
    answer:
      "Use bcrypt (or argon2). Never store plain text. Example: const hash = await bcrypt.hash(password, 10); Then compare with bcrypt.compare().",
  },
  {
    id: 138,
    topic: "Node.js",
    question: "What is middleware order importance in Express?",
    answer:
      "Middleware executes in the order it is defined. Body parsers and auth should come before routes. Error handlers must be last.",
  },
  {
    id: 139,
    topic: "Node.js",
    question: "How do you handle environment variables in Node.js?",
    answer:
      "Use the dotenv package and a .env file. Access via process.env.VARIABLE_NAME. Never commit .env to version control.",
  },
  {
    id: 140,
    topic: "Databases",
    question: "What is the difference between SQL and NoSQL?",
    answer:
      "SQL databases are relational with fixed schemas and tables (PostgreSQL, MySQL). NoSQL are flexible document/key-value oriented (MongoDB). Choose based on data structure and scalability needs.",
  },
  {
    id: 141,
    topic: "Node.js",
    question: "What is MongoDB?",
    answer:
      "A popular NoSQL document database that stores data as flexible JSON-like documents (BSON). It pairs well with Node.js in the MERN stack.",
  },
  {
    id: 142,
    topic: "Node.js",
    question: "What is Mongoose?",
    answer:
      "An ODM (Object Document Mapper) for MongoDB and Node.js. It provides schema validation, middleware, and easier querying.",
  },
  {
    id: 143,
    topic: "Node.js",
    question: "How do you connect MongoDB with Node.js/Express?",
    answer:
      "Use mongoose.connect(process.env.MONGO_URI). Define schemas and models, then use them in routes for CRUD operations.",
  },
  {
    id: 144,
    topic: "Databases",
    question: "What is the N+1 query problem?",
    answer:
      "When you fetch a list of items and then make a separate query for related data of each item, resulting in many database calls. Solve with population, joins, or aggregation.",
  },
  {
    id: 145,
    topic: "REST APIs",
    question: "How do you implement pagination in an API?",
    answer:
      "Use query parameters like page and limit. Calculate skip = (page - 1) * limit and use Model.find().skip(skip).limit(limit). Also return total count for frontend.",
  },
  {
    id: 146,
    topic: "JavaScript",
    question: "Explain async/await vs Promises vs Callbacks.",
    answer:
      "Callbacks are the oldest (nested hell risk). Promises improve chaining. async/await is syntactic sugar over Promises that makes asynchronous code look synchronous and easier to read/handle errors.",
  },
  {
    id: 147,
    topic: "JavaScript",
    question: "What is the difference between == and ===?",
    answer:
      "== does type coercion before comparison. === checks both value and type without coercion. Always prefer ===.",
  },
  {
    id: 148,
    topic: "JavaScript",
    question: "What is a closure in JavaScript?",
    answer:
      "A function that remembers and can access variables from its outer (enclosing) scope even after the outer function has finished executing.",
  },
  {
    id: 149,
    topic: "Node.js",
    question: "What is the Event Loop in the browser vs Node.js?",
    answer:
      "Both use an event loop for async operations. Browser has additional rendering and user event queues. Node.js focuses on I/O with libuv and has phases (timers, pending, poll, check, close).",
  },
  {
    id: 150,
    topic: "General",
    question: "What are Promises?",
    answer:
      "Objects representing the eventual completion or failure of an asynchronous operation. States: pending, fulfilled, rejected. Methods: then, catch, finally.",
  },
  {
    id: 151,
    topic: "JavaScript",
    question: "What is debouncing?",
    answer:
      "A technique that delays function execution until after a specified time has passed since the last call. Commonly used for search inputs and resize events to reduce unnecessary calls.",
  },
  {
    id: 152,
    topic: "JavaScript",
    question: "What is throttling?",
    answer:
      "A technique that limits how often a function can execute (e.g., once every X milliseconds). Useful for scroll or mouse-move handlers.",
  },
  {
    id: 153,
    topic: "Node.js",
    question: "What is localStorage vs sessionStorage vs cookies?",
    answer:
      "localStorage persists until cleared (no expiry). sessionStorage lasts for the tab session. Cookies can have expiry, are sent with every request, and have size limits. Prefer localStorage/sessionStorage for client-only data.",
  },
  {
    id: 154,
    topic: "CSS",
    question: "What is the Box Model in CSS?",
    answer:
      "Every element is a box consisting of content, padding, border, and margin. box-sizing: border-box includes padding and border in the element's width/height.",
  },
  {
    id: 155,
    topic: "Databases",
    question: "What is Flexbox?",
    answer:
      "A CSS layout model for one-dimensional layouts (row or column). Makes alignment, distribution of space, and responsive design easier with properties like justify-content and align-items.",
  },
  {
    id: 156,
    topic: "CSS",
    question: "What is CSS Grid?",
    answer:
      "A two-dimensional layout system for rows and columns. Powerful for complex page layouts. Complements Flexbox (which is mainly one-dimensional).",
  },
  {
    id: 157,
    topic: "CSS",
    question: "What is responsive design?",
    answer:
      "Designing websites that adapt to different screen sizes. Techniques: fluid grids, flexible images, media queries, and modern layout methods (Flexbox/Grid).",
  },
  {
    id: 158,
    topic: "CSS",
    question: "What happens when a user types a URL and presses Enter?",
    answer:
      "DNS lookup → TCP connection → HTTP request → Server processes and responds → Browser receives HTML/CSS/JS → Parsing, rendering, and painting the page.",
  },
  {
    id: 159,
    topic: "REST APIs",
    question: "What is the difference between GET and POST?",
    answer:
      "GET retrieves data and can be cached/bookmarked; parameters in URL. POST submits data; body is not visible in URL and not cached. Use POST for sensitive or large data.",
  },
  {
    id: 160,
    topic: "React",
    question: "How do you prevent XSS (Cross-Site Scripting)?",
    answer:
      "Sanitize and escape user input. Use libraries like DOMPurify. In React, JSX automatically escapes content. Avoid dangerouslySetInnerHTML unless necessary and sanitized.",
  },
  {
    id: 161,
    topic: "REST APIs",
    question: "What is CSRF and how do you prevent it?",
    answer:
      "Cross-Site Request Forgery – attacker tricks a logged-in user into submitting a request. Prevent with CSRF tokens, SameSite cookies, and checking Origin/Referer headers.",
  },
  {
    id: 162,
    topic: "Node.js",
    question: "What is the difference between cookies and tokens (JWT) for auth?",
    answer:
      "Cookies are automatically sent by the browser and can be httpOnly (safer from XSS). JWTs are often stored in localStorage (vulnerable to XSS) or httpOnly cookies. Both need proper security measures.",
  },
  {
    id: 163,
    topic: "Node.js",
    question: "How would you structure a MERN project?",
    answer:
      "Separate client/ and server/ folders. Server: routes, controllers, models, middleware. Client: components, pages, hooks, services. Use environment variables and a clear folder structure.",
  },
  {
    id: 164,
    topic: "Node.js",
    question: "How do you handle file uploads in Node.js/Express?",
    answer:
      "Use middleware like multer. Configure storage (disk or memory), set file size/type limits, and save the file path or buffer to the database.",
  },
  {
    id: 165,
    topic: "Node.js",
    question: "What is clustering in Node.js?",
    answer:
      "Using the cluster module to create multiple worker processes that share the same server port. Utilizes multi-core systems since Node.js is single-threaded by default.",
  },
  {
    id: 166,
    topic: "Databases",
    question: "How do you implement search/filtering on the backend?",
    answer:
      "Accept query parameters (e.g., ?search=term&category=electronics). Build a MongoDB query or SQL WHERE clause dynamically based on provided filters. Add pagination and sorting.",
  },
  {
    id: 167,
    topic: "Node.js",
    question: "How do you secure an Express API?",
    answer:
      "Use Helmet for security headers, rate limiting, CORS properly configured, input validation (Joi/Zod), hashed passwords, JWT with short expiry + refresh tokens, and HTTPS in production.",
  },
  {
    id: 168,
    topic: "Node.js",
    question: "What is the difference between authentication middleware and route handlers?",
    answer:
      "Auth middleware runs before the route handler, verifies the token/session, attaches user info to req, and either calls next() or returns 401. Route handlers focus on business logic.",
  },
  {
    id: 169,
    topic: "REST APIs",
    question: "How do you version a REST API?",
    answer:
      "Common approaches: URL versioning (/api/v1/users), header versioning (Accept: application/vnd.api.v1+json), or query parameter. URL versioning is simplest and most common.",
  },
  {
    id: 170,
    topic: "REST APIs",
    question: "What is GraphQL vs REST?",
    answer:
      "REST uses multiple endpoints and fixed responses. GraphQL uses a single endpoint where clients specify exactly the data they need. GraphQL reduces over/under-fetching but adds complexity.",
  },
  {
    id: 171,
    topic: "Node.js",
    question: "How would you implement a simple todo API (CRUD)?",
    answer:
      "POST /todos (create), GET /todos (list with pagination), GET /todos/:id, PUT/PATCH /todos/:id (update), DELETE /todos/:id. Use Express routes + MongoDB/Mongoose models + proper status codes.",
  },
  {
    id: 172,
    topic: "Node.js",
    question: "What is the purpose of next() in Express middleware?",
    answer:
      "next() passes control to the next middleware function in the stack. If you don't call it (and don't end the response), the request will hang.",
  },
  {
    id: 173,
    topic: "Node.js",
    question: "How do you test an Express API?",
    answer:
      "Use tools like Jest + Supertest. Write unit tests for controllers/services and integration tests that hit actual routes. Mock the database when needed.",
  },
  {
    id: 174,
    topic: "Node.js",
    question: "What is process.nextTick vs setImmediate?",
    answer:
      "process.nextTick queues a microtask that runs before the next event loop phase. setImmediate queues a macrotask that runs in the check phase. Prefer setImmediate for most cases to avoid starving the event loop.",
  },
  {
    id: 175,
    topic: "Node.js",
    question: "How do you handle CORS preflight requests?",
    answer:
      "Browsers send an OPTIONS request before certain cross-origin requests. The cors middleware or manual handling of OPTIONS with appropriate Access-Control-Allow-* headers responds to preflights.",
  },
  {
    id: 176,
    topic: "Node.js",
    question: "What is the difference between authentication with sessions vs JWT?",
    answer:
      "Sessions store state on the server (session ID in cookie). JWT is stateless – the token itself contains the claims. JWT scales better for distributed systems; sessions are simpler to invalidate.",
  },
  {
    id: 177,
    topic: "React",
    question: "How do you deploy a Node.js + React application?",
    answer:
      "Build the React app (npm run build), serve the static files with Express or a CDN/Nginx. Run Node with PM2 or Docker. Use environment variables, HTTPS, and a process manager. Platforms: Vercel, Render, AWS, DigitalOcean.",
  },
  {
    id: 178,
    topic: "React",
    question: "What is SSR vs CSR vs SSG?",
    answer:
      "CSR (Client-Side Rendering): browser downloads JS and renders. SSR (Server-Side Rendering): server sends fully rendered HTML. SSG (Static Site Generation): pages pre-built at build time. Next.js supports all three.",
  },
  {
    id: 179,
    topic: "React",
    question: "How do you manage global state in React?",
    answer:
      "For simple cases: Context API. For complex apps: Redux Toolkit, Zustand, Jotai, or Recoil. Prefer local state first; lift or externalize only when needed.",
  },
  {
    id: 180,
    topic: "Databases",
    question: "What is Redux and when would you use it?",
    answer:
      "A predictable state container. Use when many components need shared state, complex update logic, or time-travel debugging is helpful. For many modern apps, lighter alternatives like Zustand are preferred.",
  },
  {
    id: 181,
    topic: "React",
    question: "How do you prevent memory leaks in React?",
    answer:
      "Clean up side effects in useEffect (return a cleanup function). Cancel pending API requests (AbortController). Remove event listeners and clear timers.",
  },
  {
    id: 182,
    topic: "JavaScript",
    question: "What are arrow functions and how do they differ from regular functions?",
    answer:
      "Arrow functions have shorter syntax and do not have their own 'this', arguments, or prototype. They inherit 'this' from the enclosing scope. Cannot be used as constructors.",
  },
  {
    id: 183,
    topic: "JavaScript",
    question: "What is destructuring in JavaScript?",
    answer:
      "A syntax that unpacks values from arrays or properties from objects into distinct variables. Example: const {name, age} = user; or const [first, second] = arr;",
  },
  {
    id: 184,
    topic: "JavaScript",
    question: "What is the spread operator?",
    answer:
      "... expands an iterable (array/object) into individual elements. Used for copying arrays/objects, merging, and passing arguments. Example: const newArr = [...oldArr, 4];",
  },
  {
    id: 185,
    topic: "JavaScript",
    question: "What is optional chaining (?.) and nullish coalescing (??)?",
    answer:
      "?. safely accesses nested properties without throwing if intermediate values are null/undefined. ?? returns the right-hand side only when the left is null or undefined (not other falsy values).",
  },
  {
    id: 186,
    topic: "Node.js",
    question: "Tell me about a challenging project you worked on.",
    answer:
      "(Prepare a STAR answer: Situation, Task, Action, Result). Focus on a fullstack feature – e.g., implementing auth, optimizing performance, or integrating third-party APIs – and quantify the impact.",
  },
  {
    id: 187,
    topic: "React",
    question: "How do you stay updated with web development trends?",
    answer:
      "Follow official docs (React, Node), blogs (dev.to, Medium), Twitter/X accounts of core team members, newsletters, and build small side projects with new features.",
  },
];
