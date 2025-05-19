# 🧬 seed-mantras-analysis

A full-stack monorepo for generating, analyzing, and visualizing Sanskrit seed syllables (_bījas_) using a modern GraphQL and TypeScript frontend, and a Python data engine.

## 🚀 Overview

This project builds an exhaustive and structured dataset of Sanskrit phonemes and possible bīja combinations, enabling research, visualization, and exploration of linguistic and spiritual patterns.

### ✨ Highlights

- 🔠 **Phoneme + Bīja Generator** (Python): Combines valid Sanskrit consonants, vowels, and finals into thousands of structured syllables.
- 📊 **Metadata Enrichment**: Each phoneme and bīja is annotated with linguistic features (e.g. place of articulation, voicing).
- 🌐 **GraphQL Server** (Python + Strawberry + FastAPI): Serves enriched phoneme and bīja data for querying and filtering.
- ⚛️ **React + Vite Frontend**: Visualizes and explores the data interactively using Apollo Client.

---

## 📁 Project Structure

```
seed-mantras-analysis/
├── data/                 # Static validation lists (e.g. traditional bījas)
├── output/               # Generated CSV data
├── packages/
│   ├── python/
│   │   ├── data-gen/     # CSV generators, phoneme logic
│   │   └── graphql-server/  # Strawberry GraphQL Server
│   └── ts/
│       └── graphql-client/       # Vite + React frontend
└── pnpm-workspace.yaml   # Monorepo workspace config
```

---

## 🧰 Tech Stack

- **Frontend**: Vite, React, TypeScript, Apollo Client
- **Backend**: Python, Strawberry GraphQL, FastAPI
- **Data Processing**: Pandas, CSV
- **Monorepo**: pnpm workspaces

---

## 🛠️ Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/your-username/seed-mantras-analysis
cd seed-mantras-analysis
pnpm install
```

### 2. Create Python virtualenv for GraphQL Server

```bash
cd packages/python/graphql-server
python3 -m venv ../../../.venv-graphql-server
source ../../../.venv-graphql-server/bin/activate
pip install -r requirements.txt
```

### 3. Generate CSV data

```bash
cd packages/python/data-gen
source ../../../.venv-data-gen/bin/activate
python src/generate.py
python src/generate_phoneme_lists.py
python src/generate_clusters.py
```

---

## 🧪 Development Workflow

### 🧬 Run the GraphQL Server

```bash
cd packages/python/graphql-server
source ../../../.venv-graphql-server/bin/activate
uvicorn src.main:app --reload
# → http://localhost:8000/graphql
```

### ⚛️ Run the Frontend

```bash
cd packages/ts/graphql-client
pnpm dev
# → http://localhost:5173
```

---

## 📚 Future Plans

- Add Devanagari script rendering
- Expand GraphQL filtering (by phonology, frequency, semantic usage)
- Visualizations: radial graphs, filters, Sanskrit alphabet charts
- Jupyter-based phonetic exploration notebooks

---

## 🪪 License

MIT © Jeffrey Radcliffe  
Open to research, remixing, and devotional inspiration.

---

## ✅ Continuous Integration (CI)

This repo uses [GitHub Actions](https://github.com/features/actions) to automatically check formatting and run tests on each push and pull request.

### ✅ CI checks:

- ✅ Python: installs, formats with Black, runs `pytest`
- ✅ TypeScript: installs, checks Prettier formatting
- 🛠 Configured in `.github/workflows/ci.yml`

CI ensures everything stays working and clean across Python + TypeScript environments.
