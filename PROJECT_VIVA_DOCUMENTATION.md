# CityCare Hospital Management and Collaboration Platform

## Project Overview

CityCare Hospital Management System is a full-stack healthcare platform for patients, doctors, staff, and administrators. It combines hospital operations with a project collaboration workspace.

The system supports appointments, doctor management, patient records, billing, medicines, reports, hospital departments, collaborative projects, notes, file uploads, analytics, public project sharing, and AI assistance.

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary

### AI

- Gemini API support
- Groq API support
- Llama 3.3 70B Versatile model through Groq
- Local fallback responses when external AI providers are unavailable

## Core Features

### 1. User Authentication with JWT and bcrypt

The application supports authentication for admin, doctor, patient, and staff roles.

Registration flow:

1. The user submits name, email, password, and role.
2. The backend validates the required fields.
3. The password is hashed using bcryptjs.
4. The user is saved in MongoDB.
5. A JWT token is generated and returned.
6. The frontend stores the token and redirects the user according to the role.

Login flow:

1. The backend finds the user using the email.
2. bcrypt compares the entered password with the stored hash.
3. A JWT is generated for valid credentials.
4. Protected routes verify the JWT using authentication middleware.

Authentication endpoints:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/admin-login
POST /api/auth/unblock-admin
```

Admin login also includes a passkey. After three incorrect passkey attempts, the admin account is blocked.

### 2. Project Collaboration

Authenticated users can create and manage collaboration projects.

Users can:

- Create projects
- Update projects
- Add project members
- View project details
- Delete projects when they are the creator
- Create and manage project notes
- Upload project files
- View project analytics
- Publish a read-only public project page

Project endpoints:

```text
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/members
```

The backend checks project ownership or membership before returning private project data.

### 3. Markdown Notes with AI

Each project can contain Markdown-style notes. Notes include a title, content, author, project reference, tags, and timestamps.

Note endpoints:

```text
GET    /api/projects/:id/notes
POST   /api/projects/:id/notes
PUT    /api/projects/notes/:id
DELETE /api/projects/notes/:id
```

The AI note assistant supports two modes:

- Explain: explains the meaning, focus, and next step of a note.
- Improve: restructures a note using observation, summary, assessment, plan, and action items.

AI note endpoint:

```text
POST /api/ai/note-assist
```

Example request:

```json
{
  "note": "Patient is feeling better after treatment",
  "mode": "improve"
}
```

### 4. File Upload and Preview

Project members can upload files through Multer. The backend validates file type and file size.

Supported file types include:

- Images
- PDF files
- Text files
- Markdown files
- DOC and DOCX files
- XLS and XLSX files
- CSV files
- ZIP files

The maximum file size is 20 MB.

Preview modes are selected from the MIME type and file extension:

```text
image    -> image preview
pdf      -> PDF preview
text     -> text preview
download -> download option
```

File endpoints:

```text
GET    /api/projects/:id/files
POST   /api/projects/:id/files
DELETE /api/projects/:id/files/:fileId
```

Files can be stored locally or uploaded to Cloudinary. MongoDB stores the file metadata and URL.

### 5. Contribution Analytics

The project analytics feature provides basic team contribution statistics.

It displays:

- Total notes
- Total uploaded files
- Notes created by each member
- Files uploaded by each member
- Total activity per member
- Recent project activity

Analytics endpoint:

```text
GET /api/projects/:id/analytics
```

MongoDB aggregation groups notes by author and files by uploader. These counts are combined to calculate total activity.

### 6. Public Shareable Project Page

A project creator can publish a project using a public slug.

When a project is shared:

1. The backend verifies that the user is the project creator.
2. The project is marked as public.
3. A public slug is generated.
4. A public README is stored.
5. A shareable URL is returned.

Endpoints:

```text
POST /api/projects/:id/share
GET  /api/projects/public/:slug
```

The public page is read-only and can be opened without login. Private projects remain protected.

### 7. Gemini and Groq API Endpoints

The project supports both Gemini and Groq providers. Gemini was an allowed provider, and Groq was used as an alternative provider.

Gemini endpoints:

```text
POST /api/gemini/explain
POST /api/gemini/docs
POST /api/gemini/readme
```

Groq endpoints:

```text
POST /api/groq/explain
POST /api/groq/docs
POST /api/groq/readme
```

Common AI endpoints:

```text
POST /api/ai/explain-code
POST /api/ai/readme
POST /api/ai/note-assist
POST /api/ai/assess
```

Groq uses the OpenAI-compatible chat completion endpoint and the Llama 3.3 70B Versatile model.

## Frontend and Backend Flow

```text
React frontend
      |
      | Axios request
      v
Express backend
      |
      | JWT authentication middleware
      v
Route handler
      |
      +--> MongoDB and Mongoose
      +--> Local file storage or Cloudinary
      +--> Gemini or Groq API
      v
JSON response
      |
      v
React UI update
```

The frontend is responsible for pages, forms, loading states, API calls, navigation, and displaying results. The backend handles validation, authentication, authorization, database operations, file uploads, and AI provider requests.

## Database Usage

MongoDB is used through Mongoose models.

Main models:

```text
User
Project
Note
ProjectFile
Doctor
Appointment
Patient
Bill
Report
Medicine
```

Important relationships:

```text
Project.creator   -> User
Project.members   -> User
Note.projectId    -> Project
Note.author       -> User
ProjectFile.projectId  -> Project
ProjectFile.uploadedBy -> User
```

Mongoose populate is used to return related user information such as name and email.

## AI Integration Flow

```text
User enters note, code, or project details
              |
              v
Frontend sends request to backend
              |
              v
Backend builds a structured prompt
              |
              v
Gemini provider is tried when configured
              |
              v
Groq provider is used as an alternative or fallback
              |
              v
Local rule-based response is used if both providers fail
              |
              v
Result is returned to the frontend
```

AI features include:

- Clinical and operational note explanation
- Note improvement
- Code explanation
- Project documentation generation
- README generation
- General health guidance
- Department recommendation based on symptom keywords

The AI is designed to provide general guidance, not a final medical diagnosis. Emergency symptoms are directed toward urgent medical care.

## Challenges and Learnings

### Role-based access

Different roles required different permissions and dashboards. JWT payloads contain the user ID and role, while backend middleware verifies access.

### Admin security

Admin login required an additional passkey and failed-attempt blocking. This added a second layer of protection beyond the password.

### AI reliability

External AI APIs can fail or be unavailable. Provider-specific functions and fallback responses help keep the application usable.

### File preview

Different file types require different preview behavior. MIME type and file extension are used to choose the preview mode.

### Project authorization

Frontend hiding is not enough for security. Every protected backend route checks project ownership or membership.

### Public sharing

The public project route only returns projects that are explicitly marked as public. Public pages are read-only.

### Analytics

Notes and files are stored in separate collections, so MongoDB aggregation is used to calculate contribution statistics.

## Common Viva Questions and Answers

### Explain the complete project flow.

The user registers or logs in. The backend hashes or verifies the password and returns a JWT. The frontend stores the token and opens the correct role-based dashboard. Authenticated users can create projects, add members, write notes, upload files, use AI tools, view analytics, and publish a read-only public page.

### How does authentication work?

Passwords are hashed with bcryptjs. During login, bcrypt compares the entered password with the stored hash. A JWT is created after successful login. Protected routes verify the token using authentication middleware.

### Explain the AI integration.

The frontend sends note, code, or project information to the backend. The backend builds a structured prompt and sends it to Gemini or Groq. Groq uses the Llama 3.3 70B Versatile model. If an external provider is unavailable, a fallback provider or local response is used.

### Why did you use Groq?

Gemini was allowed, but Groq was also permitted. Groq provides fast inference and an OpenAI-compatible API. Provider-specific functions make it possible to support both Gemini and Groq without changing the frontend flow.

### How does file upload work?

Multer handles multipart uploads. The backend validates file type and a 20 MB size limit. The file is stored locally or on Cloudinary, while metadata and the file URL are saved in MongoDB.

### How is public sharing secured?

Only the project creator can share a project. The backend sets isPublic to true and generates a public slug. The public route returns read-only project data and does not allow editing.

### What happens if the AI API fails?

The application tries the configured provider, then the alternative provider, and finally returns a local rule-based response. This prevents the application from completely failing when an external API is unavailable.

### What would you improve in the future?

Possible improvements include real-time collaboration with WebSockets, note version history, detailed analytics charts, AI audit logs, stronger permissions, refresh tokens, rate limiting, automated tests, and file virus scanning.

## One-Minute Presentation Summary

My project is a full-stack CityCare Hospital Management and collaboration platform. It uses React and Vite on the frontend, Node.js and Express on the backend, and MongoDB with Mongoose for data storage. It includes JWT and bcrypt authentication, role-based access, project collaboration, Markdown notes, file upload and preview, contribution analytics, public project sharing, and AI-powered note, code, documentation, and README generation. The AI layer supports Gemini and Groq, with Groq using the Llama 3.3 70B Versatile model. Fallback logic keeps the application usable when an external AI provider is unavailable.

## Thunder Client Base URL

Use this environment variable in Thunder Client:

```text
baseUrl = http://localhost:5000/api
```

Project requests must use:

```text
{{baseUrl}}/projects
```

Do not use `/api/auth/projects`; the `/auth` prefix is only for authentication endpoints.

Admin registration uses:

```text
POST {{baseUrl}}/auth/admin-register
```

Start the backend from the backend directory:

```bash
cd /home/sama/Downloads/hospital/backend
npm start
```

## Workspace Member Invitations

When a project creator adds an existing user by email through the collaboration workspace:

1. The backend verifies that the requester is the project creator.
2. The user is added to the project's `members` list.
3. The member can see the workspace in `GET /api/projects`.
4. The member can create notes, upload files, and view project analytics.
5. Groq generates a workspace-specific email subject and body using the project name, description, department, creator, member, and workspace link.
6. The backend sends the generated invitation through Nodemailer and SMTP.

Creator-only actions remain protected: editing project details, deleting the project, publishing the project, and adding more members.

To enable real email delivery, configure these values in `backend/.env`:

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-sending-email@example.com
SMTP_PASS=your-email-app-password
FRONTEND_URL=http://localhost:5174
```

For Gmail, use a Google App Password rather than the normal account password. Never commit real SMTP credentials to source control. If SMTP is empty, the member is still added and the API response reports that the invitation email was not sent. The response also reports whether content came from Groq or the local fallback template.
