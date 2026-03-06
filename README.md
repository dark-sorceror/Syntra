# Syntra

**Your calendar that learns you.**

Syntra is an AI-native scheduling assistant that passively builds a behavioral model from your calendar history — learning *when* you work, *how* you structure your days, and *how your habits shift over time* — then surfaces intelligent schedule suggestions without any manual input.

## Table of Contents
 
- [What is Syntra?](#what-is-syntra)
- [Features](#features)
- [Architecture](#architecture)
  - [Overall System Pipeline](#overall-system-pipeline)
  - [Project Structure](#project-structure)
  - [How the ML model works](#how-the-ml-model-works)
- [How the ML model works](#how-the-ml-model-works)
- [Benchmarks](#benchmarks)
  - [LSTM vs FNN (global accuracy)](#lstm-vs-fnn-global-accuracy)
  - [Feature importance](#feature-importance)
- [Getting Started](#getting-started)
  - [With Docker](#with-docker)
  - [Manual setup](#manual-setup)
  - [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)

## What is Syntra?

Most calendar apps are passive storage. You tell them what you're doing, they show it back to you. Syntra is different — it watches how you actually schedule, not just what you put in.

Every time you create, move, or delete an event, Syntra quietly logs it. Over time, an LSTM-based behavioral model learns your temporal patterns: your focus windows, your meeting rhythms, how your habits shift across days of the week. When you need to schedule something new, Syntra already knows where it belongs.

## Features

- **Passive behavioral modeling** — no manual setup, no preference forms. Syntra learns from what you actually do.
- **LSTM + FNN scheduling model** — sequence modeling for temporal event patterns, trained per-user over time.
- **AI scheduling agent** — a Gemini-powered agent that combines ML predictions with natural language reasoning to suggest optimal slots.
- **Full-stack, cross-platform** — Next.js web app + Electron desktop app sharing the same FastAPI backend.
- **Dockerized** — consistent dev and prod environments, one command to run everything.

## Architecture

### Overall System Pipeline

<img src="media/overall_pipeline.png" width="500px"/>

### Project Structure

```
Syntra/
├── server/
│   ├── api/                              # FastAPI entry point, CORS, routers
│   ├── src/                              # ML model, schemas and DB initialization
│   ├── pipelines/                        # ML model and LLM tuning
│   ├── models/                           # Trained model weights
│   ├── scripts/                          # Evaluation, CLI tests and Admin
│   ├── data/                             # Data
│   ├── migrations/                       # Alembic migration files
│   ├── config/                           # App configuration
├── web/                                  # Next.js frontend
│   ├── api/                              # API client
├── desktop/                              # Electron wrapper
├── docker/                               # Docker Compose configs
├── media/                                # Media
└── README.md
```

## How the ML model works

Syntra extracts temporal features from every event in your calendar history:

```python
features = [
    sin(2π × hour / 24),         # cyclical hour encoding
    cos(2π × hour / 24),
    sin(2π × weekday / 7),       # cyclical weekday encoding
    cos(2π × weekday / 7),
    duration_minutes / 480,      # normalized event length
    category_embedding,          # learned category vector
]
```

These feed into an LSTM that learns the sequential structure of your scheduling patterns — not just "you like 9am meetings" but "you tend to schedule deep work after a long gap, and meetings cluster in the early afternoon on Tuesdays."

The Gemini agent then wraps this model, using tool calling to fetch predictions, check free slots, and review recent patterns before suggesting a time — and can explain its reasoning in plain language.

---

## Benchmarks

The behavioral model was benchmarked on global scheduling prediction (event time slot classification across all users) and per-user habit prediction.

### LSTM vs FNN (global accuracy)

| Model | Hidden Units | Dropout | Accuracy |
|-------|-------------|---------|----------|
| FNN (baseline) | — | — | ~89.1% |
| LSTM | 64 | 0.2 | 92.70% |
| LSTM | 128 | 0.1 | **93.36%** |

> **Note:** While global accuracy improved with larger hidden units and lower dropout, per-user prediction accuracy showed minimal change. This suggests that temporal dependencies between events are weak at a global scale — individual behavioral models (trained per-user) are the correct long-term direction.

### Feature importance

Cyclical time encoding (`sin`/`cos` of hour and weekday) proved critical — without it, the model treats 11pm and midnight as maximally distant in time rather than adjacent, degrading accuracy by ~4%.

## Getting Started

**Prerequisites:**

- Python 3.11+
- Node.js 18+
- Docker + Docker Compose
- PostgreSQL 15+ (or use SQLite for local dev)

**Environment Variables**

```bash
# server/.env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/syntra
GEMINI_API_KEY=your_key_here

# web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### With Docker

coming soon

```bash
git clone https://github.com/dark-sorceror/Syntra.git
cd Syntra

cp server/.env.example server/.env
# Fill in your GEMINI_API_KEY and DATABASE_URL

docker compose up --build
```

Web app: http://localhost:3000  

### Manual setup

**Backend:**
```bash
cd server
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

# Set up the database
psql -U postgres -c "CREATE DATABASE syntra;"
alembic upgrade head

uvicorn api.app:app --reload
```

**Frontend (website):**
```bash
cd web
npm install
npm run dev
```

**Desktop app:**
```bash
cd desktop
npm install
npm run electron:dev
```

### Environment variables

```bash
# server/.env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/syntra
GEMINI_API_KEY=your_key_here

# web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Roadmap

- [ ] Per-user model fine-tuning (currently global model only)
- [ ] Google Calendar / Outlook sync
- [ ] Passive building and training of model
- [ ] Integrate model into API
- [ ] Recurring event pattern detection
- [ ] Local model option