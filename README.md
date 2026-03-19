# 🚀 QueryLens

**AI-assisted Search Ads Evaluation Ops Console**

QueryLens is a full-stack MVP that simulates how Search Ads Operations teams evaluate ad relevance, combine AI and human judgment, and identify model failure cases through disagreement analysis.

---

## 🎯 Why This Project

Search monetization depends on showing **relevant ads without harming user experience**.

Operations teams must:
- evaluate ad relevance at scale
- maintain consistent labeling standards
- collaborate with product and algorithm teams
- use AI to improve efficiency without losing control

QueryLens was built to simulate this real-world workflow, not just as an AI demo.

---

## ✨ Key Features

### 🧠 AI-Assisted Evaluation
- Classifies **query intent**
- Assigns **relevance label**
- Generates **score and reasoning**
- Acts as a **first-pass reviewer**

### 👤 Human-in-the-Loop Review
- Reviewers assign final labels:
  - Highly Relevant
  - Partially Relevant
  - Irrelevant
- Add notes to justify decisions
- Override AI outputs

### ⚠️ Disagreement Detection
- Highlights when **AI ≠ Human**
- Enables **focused review on failure cases**
- Supports model improvement workflows

### 📊 Ops Dashboard
Tracks key quality metrics:
- Total reviews
- Agreement vs disagreement rate
- Label distribution
- Query-level disagreement analysis

### 🔍 Disagreement-First Workflow
Toggle to:
- View all cases
- View only **problematic cases** where AI and human labels disagree

This mimics how real operations teams prioritize higher-value review work.

---

## 🧠 Product Thinking

This project demonstrates three core ideas:

### 1. AI should assist, not replace
AI provides recommendations, while humans remain the source of truth.

### 2. Prioritization matters
Disagreement-focused workflows reduce unnecessary review effort and surface model failure cases faster.

### 3. Evaluation should be measurable
Metrics create a feedback loop for improving:
- models
- prompts
- labeling guidelines

---

## 🔄 User Flow

1. Load a search query and ad candidates
2. Run AI evaluation
3. Review AI output:
   - intent
   - label
   - score
   - reasoning
4. Assign human label
5. Add reviewer notes
6. Save evaluation
7. View disagreement status
8. Monitor dashboard trends

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- Axios
- Recharts

### Backend
- FastAPI
- SQLAlchemy
- SQLite

### AI Layer
- OpenAI API

### Deployment
- Render-ready architecture
- Easy upgrade path to Postgres

---

## 🧱 Architecture

```text
React Frontend
      ↓
FastAPI Backend
      ↓
SQLite DB  +  OpenAI API