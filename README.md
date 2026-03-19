# 🚀 QueryLens

**AI-assisted Search Ads Evaluation Ops Console**

QueryLens is a full-stack MVP that simulates how Search Ads Operations teams evaluate ad relevance, combine AI and human judgment, and identify model failure cases through disagreement analysis.

---

## 🎯 Why This Project

Search monetization depends on showing **relevant ads without harming user experience**.

Operations teams must:
- evaluate ad relevance at scale
- maintain consistent labeling standards
- collaborate with product & algorithm teams
- use AI to improve efficiency without losing control

QueryLens was built to simulate this real-world workflow — not just an AI demo.

---

## ✨ Key Features

### 🧠 AI-Assisted Evaluation
- Classifies **query intent**
- Assigns **relevance label**
- Generates **score + reasoning**
- Acts as a **first-pass reviewer**

---

### 👤 Human-in-the-Loop Review
- Reviewers assign final labels:
  - Highly Relevant
  - Partially Relevant
  - Irrelevant
- Add notes to justify decisions
- Override AI outputs

---

### ⚠️ Disagreement Detection
- Highlights when **AI ≠ Human**
- Enables **focused review on failure cases**
- Supports model improvement workflows

---

### 📊 Ops Dashboard
Tracks key quality metrics:
- Total reviews
- Agreement vs disagreement rate
- Label distribution
- Query-level disagreement analysis

---

### 🔍 Disagreement-First Workflow
Toggle to:
- View all cases
- OR only **problematic (AI wrong) cases**

👉 This mimics real ops prioritization

---

## 🧠 Product Thinking

This project demonstrates 3 core ideas:

### 1. AI should assist, not replace
AI provides recommendations, humans remain the source of truth.

### 2. Prioritization matters
Disagreement-focused workflows reduce unnecessary review effort.

### 3. Evaluation must be measurable
Metrics create a feedback loop for improving:
- models
- prompts
- guidelines

---

## 🔄 User Flow

1. Load search query + ads
2. Run AI evaluation
3. Review AI output:
   - intent
   - label
   - score
   - reasoning
4. Assign human label
5. Add notes
6. Save evaluation
7. View disagreement status
8. Monitor dashboard trends

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- Axios
- Recharts (charts)

### Backend
- FastAPI
- SQLAlchemy
- SQLite (MVP)

### AI Layer
- OpenAI API

### Deployment
- Render-ready (backend + frontend)
- Easily upgradeable to Postgres

---

## 🧱 Architecture
