# Claude_ImpactLab_2026

A full-stack web application that answers the question "What does AI mean for my job?"

## Why I Built This

As a small business owner helping operate Konbini Kitchen, I realized that most AI resources are either:

Too technical
Too broad
Focused on large companies
Filled with generic "AI tips"
Written for people who already understand how to use AI

Small business owners usually don't need to understand how an LLM or how code repos works.

They need to know:

"How can this help me run my business better?"

SBiz AI Toolkit is designed to answer that question.

## Planned Features / Example Use Cases

- Inventory Planning
    Problem : Need to estimate how much inventory may be needed for the next event.
    - I operate a small food business selling onigiri at pop-up events.
      My last event had 120 customers and I sold 180 units.
      My next event is expected to have approximately 200 customers.

      Help me estimate inventory requirements while accounting for a 10% buffer for           higher-than-expected demand.
  
- Customer Feedback Analysis
   Problem : Need to estimate how much inventory may be needed for the next event.
    - Write an Instagram caption announcing our upcoming food pop-up.

      Business: Konbini Kitchen
      Product: Japanese-style onigiri
      Location: Sacramento
      Tone: casual, energetic, and community-focused

Keep the caption under 100 words and include a simple call to action.
    
- Social Media Marketing Prompts (suggestions'
  Problem : Need to estimate how much inventory may be needed for the next event.
    - Below is customer feedback from our most recent event.

      Analyze the feedback and group the responses into:

      Product quality
      Pricing
      Customer experience
      Menu requests
      Operational problems

      Then identify the three most important improvements we should prioritize before         our next event.

## Tech Stack

- React (Vite) frontend
- Node.js / Express backend
- Anthropic Claude API for the AI features

## Running the app locally

```bash
npm run install:all   # installs client + server dependencies
npm run dev            # starts backend (:3001) and frontend (:5173)
```

Then open http://localhost:5173.

By default the app runs with mock AI responses so it's demoable without an API key.
To use real Claude responses, copy `server/.env.example` to `server/.env` and set:

```
ANTHROPIC_API_KEY=your-key-here
```

Restart `npm run dev` after adding the key — every feature switches to live Claude calls automatically.

