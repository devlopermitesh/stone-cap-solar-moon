export type SmmQuestion = {
  id: number;
  category: string;
  kind: "short" | "long";
  question: string;
  answer: string;
};

export const SMM_QUESTIONS: SmmQuestion[] = [
  {
    id: 1,
    category: "Strategy",
    kind: "short",
    question:
      "What does CTR stand for and what does a higher CTR usually indicate about a social post?",
    answer:
      "Click-Through Rate — the percentage of people who clicked on the post after seeing it. A higher CTR usually indicates the creative + hook resonated and prompted action.",
  },
  {
    id: 2,
    category: "Strategy",
    kind: "short",
    question: "Name three common social media KPIs and explain what each one measures.",
    answer:
      "Reach (unique people who saw the content), Engagement (interactions / total impressions), and Conversions (desired actions like sign-ups or purchases). Each tracks awareness, interest, and action respectively.",
  },
  {
    id: 3,
    category: "Strategy",
    kind: "long",
    question:
      "A brand's engagement is declining on Instagram. Walk through how you would diagnose the cause and craft a 30-day recovery plan.",
    answer:
      "Audit the data first: which posts over-indexed, which tanked, and the platform tool vs organic reach. Check the funnel (reach → impressions → engagement → clicks). Likely causes: algorithm shift, content fatigue, wrong timing, or copy/creative mismatch. Testing framework: hold category/timing constant and change one variable at a time. Plan: re-segment audience, refresh creative, post at peak times, boost top-performing organic posts, engage back in the first hour, and set a 14-day review checkpoint.",
  },
  {
    id: 4,
    category: "Strategy",
    kind: "short",
    question: "What is the difference between organic reach and paid reach?",
    answer:
      "Organic reach is the free distribution your content gets through the algorithm and your audience's network. Paid reach is distribution bought via ad spend that guarantees delivery to a targeted audience.",
  },
  {
    id: 5,
    category: "Content",
    kind: "short",
    question: "What is a content pillar and why is it useful in a content strategy?",
    answer:
      "A content pillar is a core theme/topic your brand consistently covers. It keeps messaging cohesive, builds topical authority with the algorithm, and makes the editorial calendar easier to manage.",
  },
  {
    id: 6,
    category: "Content",
    kind: "long",
    question:
      "Design a one-month content calendar for a fitness brand. Explain your posting cadence, mix of formats, and how you evaluate success.",
    answer:
      "Cadence: 4-5 posts/week per platform tuned to each algorithm. Mix: 40% educational (form tips, science), 30% inspirational (transformations, community), 20% promotional (offers, launches), 10% interactive (polls, Q&A). Reels/Shorts for reach, carousels for saves, stories for daily connection. Measure via saves, shares, and follower growth each week; cut underperformers, double down on winners.",
  },
  {
    id: 7,
    category: "Community",
    kind: "short",
    question: "What is social listening and why is it important for a brand?",
    answer:
      "Social listening is monitoring digital conversations about your brand, competitors, and industry keywords. It surfaces sentiment, unmet needs, and crisis signals early so you can respond proactively instead of reactively.",
  },
  {
    id: 8,
    category: "Community",
    kind: "short",
    question: "How would you handle a negative comment or a viral complaint about your brand?",
    answer:
      "Acknowledge quickly and publicly, private-message for details, apologize sincerely without defensiveness, and offer a clear path to resolution. Never delete criticism unless it's abusive/spam. Follow up once resolved and log it for the team.",
  },
  {
    id: 9,
    category: "Community",
    kind: "long",
    question:
      "Build a community management escalation policy. Define low, mid, and high severity, with response-time SLAs and who owns each level.",
    answer:
      "Low (praise, casual questions): community manager, within 24h. Mid (complaints, fact-checks): senior community manager / customer support, within 4h business hours, template + personalized note. High (PR crisis, legal, safety, abuse): escalate to brand lead + legal within 1h, approved statements only, coordinated pause of auto-replies, and a post-incident review. Include a do/don't list and a tracking sheet for every ticket.",
  },
  {
    id: 10,
    category: "Ads",
    kind: "short",
    question: "What is the difference between CPC and CPM in paid social?",
    answer:
      "CPC (Cost Per Click) is what you pay each time someone clicks your ad; CPM (Cost Per Mille) is what you pay per 1,000 impressions. CPC is action-oriented, CPM is awareness-oriented.",
  },
  {
    id: 11,
    category: "Ads",
    kind: "short",
    question: "How do you set up an A/B test on a social media ad?",
    answer:
      "Choose a single variable to test (creative, headline, or audience), keep everything else identical, split budget evenly, let it run long enough for statistical significance, and pick the winner based on the primary KPI, not a vanity metric.",
  },
  {
    id: 12,
    category: "Platforms",
    kind: "short",
    question: "How is each major platform (LinkedIn, TikTok, X) different in intent and content style?",
    answer:
      "LinkedIn = professional intent, long-form insight, networking; TikTok = entertainment/authentic short-form video, trend-driven; X = real-time news and conversation, short text. Match content format and tone to each platform's native behavior.",
  },
  {
    id: 13,
    category: "Platforms",
    kind: "long",
    question:
      "Compare organic growth on TikTok vs LinkedIn for a B2B SaaS product and decide where the team should invest first.",
    answer:
      "TikTok reaches a large but broad, entertainment-first audience; hard to convert B2B buyers, better for employer branding and top-of-funnel awareness. LinkedIn reaches a smaller but decision-maker-dense audience with professional intent — better for B2B lead gen, thought-leadership, and direct conversations. For B2B SaaS, prioritize LinkedIn for demand capture and use TikTok for brand awareness only if you have authentic creator talent. Recommend: LinkedIn first, with repurposed short-form educational clips.",
  },
  {
    id: 14,
    category: "Analytics",
    kind: "short",
    question: "What is the difference between impressions and reach?",
    answer:
      "Impressions are the total number of times content was displayed (including repeats to the same person). Reach is the number of unique people who saw it. Impressions ≥ reach.",
  },
  {
    id: 15,
    category: "Analytics",
    kind: "short",
    question: "How do you attribute a sale to a social media campaign?",
    answer:
      "Use UTM parameters on links plus platform pixels/tracking. Combine first-touch and last-touch attribution (or multi-touch if available) and cross-check with CRM data to see which channel genuinely influenced the conversion.",
  },
  {
    id: 16,
    category: "Analytics",
    kind: "long",
    question:
      "Present a monthly social media performance report. What sections, metrics, and recommendations would you include for a stakeholder review?",
    answer:
      "Executive summary (1-line headline), KPI overview (reach, engagement rate, conversions vs target), channel breakdown, top 5 performing posts with why they worked, audience insights, competitor snapshot, and learnings. End with 2-3 prioritized, testable recommendations for next month, tied to business goals. Keep it visual, use YoY/period-over-period trendlines, and frame every metric against a business outcome.",
  },
];
