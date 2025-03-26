# Chinese Classics Learning Platform

A web platform for foreigners to learn Chinese classical literature with AI-powered translation and guidance.

## Features

- Collection of Chinese classical texts
- AI-powered translation and explanation
- User-friendly interface for non-Chinese speakers
- Interactive learning experience
- Search and filter functionality

## Tech Stack


- Frontend: React + TypeScript + Tailwind CSS
- Backend: Python FastAPI
- Database: SQLite
- AI: Open source models / Free API quotas

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Project Structure

```
.
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   ├── tests/        # Backend tests
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/          # Source code
│   ├── public/       # Static files
│   └── package.json
└── README.md
``` 