
---

# Case study story

You can use this in a few ways:
- as a PDF/case study later
- as a LinkedIn post
- as a recruiter message summary
- as interview prep

## Version 1: concise recruiter-friendly story

**Project: QueryLens — AI-assisted Search Ads Evaluation Ops Console**

I built QueryLens as a full-stack MVP to simulate how a Search Ads Operations team might evaluate sponsored results against user search intent.

The product allows reviewers to load search queries and ad candidates, run AI-based relevance evaluation, override the model with human judgment, and track disagreement patterns through a dashboard. I included query-level disagreement analysis because I wanted to focus not just on model output, but on how operations teams can prioritize the most useful failure cases.

I chose this project because I wanted to demonstrate product thinking in a realistic workflow setting rather than build another generic AI demo. The MVP combines evaluation logic, human-in-the-loop review, operations analytics, and a full-stack implementation using React, FastAPI, SQLite, and OpenAI.

What I’m most proud of is that the product tells a clear story: AI accelerates review, humans remain the source of truth, and disagreement data becomes an input for continuous improvement.

---

## Version 2: stronger case study format

### Title
**QueryLens: Designing an AI-assisted workflow for Search Ads relevance evaluation**

### Problem
Search monetization relies on showing ads that are relevant to user intent. If ads are poorly matched, revenue may increase in the short term but user experience and ecosystem health decline over time.

Operations teams often sit at the center of this challenge. They need to:
- evaluate ad relevance at scale
- maintain labeling consistency
- work with product and algorithm teams to improve quality
- use automation without losing human judgment

I wanted to build a product that reflects that operational reality.

### Goal
Design an MVP that:
- supports ad relevance review against search queries
- uses AI to accelerate evaluation
- allows human override
- identifies disagreement between AI and human labels
- surfaces useful metrics for quality improvement

### Solution
I built QueryLens, a full-stack review console and dashboard with three layers:

**1. Review workflow**  
Users can inspect a query and ad candidate, run AI evaluation, assign a final label, and add notes.

**2. AI-assisted first pass**  
The LLM returns query intent, relevance label, score, and reasoning for each ad.

**3. Monitoring layer**  
The dashboard tracks agreement vs disagreement, human label distribution, and query-level disagreement rate.

I also added a disagreement-only filter so reviewers can focus on likely model failure cases rather than spending equal time on all cases.

### Product decisions
I made a few deliberate choices:
- Kept the label taxonomy simple to reduce ambiguity
- Treated AI as a recommendation layer, not final authority
- Added disagreement analysis because it is more operationally useful than raw score output
- Used realistic local query examples to make the cases more believable

### Tech stack
- React + Vite frontend
- FastAPI backend
- SQLite for local MVP storage
- OpenAI API for evaluation logic
- Recharts for dashboard analytics

### Outcome
The MVP demonstrates:
- end-to-end review workflow
- AI-human comparison
- operational prioritization
- measurable outputs for iteration

It is not just a model demo; it is a lightweight operations product.

### What I’d improve next
- move to Postgres on Render
- add authentication and reviewer roles
- support bulk ingestion of cases
- track guideline versions
- export disagreement cases for offline analysis or retraining workflows

### Key takeaway
The main thing I wanted to prove is that I can translate an operational quality problem into a usable product workflow, not just a model output.

---
