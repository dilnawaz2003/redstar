# 🧩 Workspace Task Manager

A modern, full-stack task management application built with **Next.js 15**, **Node.js**, **Express**, **PostgreSQL**, and **Prisma**.  
Features a beautiful **red-themed UI** with real-time collaboration capabilities.



## 🛠 Tech Stack

### Frontend
- Next.js 1r (App Router)  
- TypeScript  
- Tailwind CSS (custom red theme)  
- shadcn/ui  
- Redux Toolkit + RTK Query  
- React Hook Form + Zod  
- Sonner (toast notifications)  
- Lucide React (icons)  

### Backend
- Node.js + Express  
- PostgreSQL  
- Prisma ORM  
- JWT Authentication  
- bcryptjs for password hashing  
- Zod for request validation  

### Development Tools
- TypeScript (full stack)  
- ESLint & Prettier  


# 1. Clone the Repository
git clone https://github.com/yourusername/workspace-task-manager.git
cd workspace-task-manager
- Prisma Migrate  
- Hot Reload  
- Environment variables configuration

# 2. Backend Setup 
- # Navigate to backend directory
cd backend

### Install dependencies
npm install

### Setup environment variables
cp .env.example .env.development
### Edit .env with your PostgreSQL credentials

### Setup database
npx prisma migrate dev

### Start development server
npm run dev


# 3. Frontend setup
### Navigate to frontend directory
cd ../frontend

### Install dependencies
npm install

### Setup environment variables
cp .env.example .env.local
### Edit .env.local

### Start development server
npm run dev





