require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const { callClaude } = require('./claude');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- Inventory Planning -----------------------------------------------

app.post('/api/inventory', async (req, res) => {
  const {
    businessName = 'the business',
    product = 'units',
    lastEventCustomers,
    lastEventUnitsSold,
    nextEventCustomers,
    bufferPercent = 10,
  } = req.body;

  const perCustomer = lastEventUnitsSold / lastEventCustomers;
  const baseEstimate = perCustomer * nextEventCustomers;
  const withBuffer = Math.ceil(baseEstimate * (1 + bufferPercent / 100));

  const prompt = `I operate a small food business called ${businessName} selling ${product} at pop-up events.
My last event had ${lastEventCustomers} customers and I sold ${lastEventUnitsSold} units.
My next event is expected to have approximately ${nextEventCustomers} customers.
Help me estimate inventory requirements while accounting for a ${bufferPercent}% buffer for higher-than-expected demand.`;

  const mockResponse = `Based on your last event, you sold roughly ${perCustomer.toFixed(2)} units per customer (${lastEventUnitsSold} units / ${lastEventCustomers} customers).

Applying that rate to your expected ${nextEventCustomers} customers gives a base estimate of ${Math.round(baseEstimate)} units.

With a ${bufferPercent}% buffer for higher-than-expected demand, I'd recommend preparing:

**${withBuffer} units of ${product}**

A few things that could shift this number: weather, time of day, whether this is a repeat vs. new location, and any promotion you're running beforehand. If any of those apply, consider adjusting the buffer up a few points.`;

  try {
    const result = await callClaude(prompt, mockResponse);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate inventory estimate.' });
  }
});

// --- Customer Feedback Analysis ----------------------------------------

app.post('/api/feedback', async (req, res) => {
  const { feedbackText = '' } = req.body;

  const prompt = `Below is customer feedback from our most recent event.

${feedbackText}

Analyze the feedback and group the responses into:

Product quality
Pricing
Customer experience
Menu requests
Operational problems

Then identify the three most important improvements we should prioritize before our next event.`;

  const lines = feedbackText
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const categories = ['Product quality', 'Pricing', 'Customer experience', 'Menu requests', 'Operational problems'];
  const buckets = Object.fromEntries(categories.map((c) => [c, []]));
  lines.forEach((line, i) => {
    buckets[categories[i % categories.length]].push(line);
  });

  const categorySection = categories
    .map((c) => `**${c}**\n${buckets[c].length ? buckets[c].map((l) => `- ${l}`).join('\n') : '- (no feedback mentioned this)'}`)
    .join('\n\n');

  const mockResponse = `${categorySection}

**Top 3 priorities before your next event:**
1. Address the most frequently mentioned issue above first — it's the fastest way to move overall satisfaction.
2. Look for a quick, low-cost fix in Operational problems — these usually compound on event day.
3. Consider testing one Menu request as a limited special to gauge demand before committing.

(This is a mock breakdown for demo purposes — connect a real Anthropic API key to get an actual analysis of your feedback text.)`;

  try {
    const result = await callClaude(prompt, mockResponse);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze feedback.' });
  }
});

// --- Social Media Caption Generator -------------------------------------

app.post('/api/caption', async (req, res) => {
  const {
    businessName = 'our business',
    product = 'our product',
    location = '',
    tone = 'casual, energetic, and community-focused',
    wordLimit = 100,
  } = req.body;

  const prompt = `Write an Instagram caption announcing our upcoming food pop-up.

Business: ${businessName}
Product: ${product}
Location: ${location}
Tone: ${tone}

Keep the caption under ${wordLimit} words and include a simple call to action.
Use the exact location given above in the caption text itself — do not use a placeholder like [address] or [location].
Do not include a date or time in the caption, and do not use placeholders like [date] or [time] — we don't have those details yet. Just leave them out entirely.`;

  const mockResponse = `We're popping up again! 🎉 Come grab fresh ${product} from ${businessName}${location ? ` at ${location}` : ''} — made in small batches, ready to go fast.

Bring a friend, bring your appetite, and come say hi. 👋

📍 See you there — drop a comment if you're coming so we know how much to make!

(Mock caption — connect a real Anthropic API key for Claude-generated copy tailored to your event details.)`;

  try {
    const result = await callClaude(prompt, mockResponse);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate caption.' });
  }
});

app.listen(PORT, () => {
  console.log(`SBiz AI Toolkit server running on http://localhost:${PORT}`);
  console.log(
    process.env.ANTHROPIC_API_KEY
      ? 'Using real Claude API calls.'
      : 'No ANTHROPIC_API_KEY set — serving mock responses.'
  );
});
