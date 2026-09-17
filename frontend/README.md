# AI Resume Tailor — Frontend

Production-oriented React/Vite frontend for the AI Resume Tailor application.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Lucide React
- anime.js
- shadcn-style component primitives/custom UI

## Routes

- `/` — product landing page
- `/tailor-resume` — resume tailoring workspace

## Backend

The frontend consumes the existing FastAPI endpoint:

`POST /api/tailor-resume`

The request is `multipart/form-data` with:

- `job_description`
- either `resume_file` or `resume_text`

Set the backend URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Never place backend API secrets in Vite environment variables.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Notes

- Resume upload accepts PDF, DOCX, TXT and enforces a 5 MB file limit.
- Pasted resume text is limited to 30,000 characters.
- Job descriptions are limited to 15,000 characters.
- The UI uses stage-based progress rather than fake percentage progress.
- The result renderer accepts the documented `success`, `resume`, `latex`, and `overleaf` response shape and avoids displaying raw JSON by default.
- Overleaf handoff uses the `action`, `method`, and `field` metadata returned by the backend.
- No authentication, database, analytics, ATS score, fake testimonials, or other unrequested product features are included.
