# Todo List

This app and repository are a technical showcase built with the technologies listed below.

## ✨ Tech Stack
[TypeScript](https://www.typescriptlang.org/)

Frontend: [React 19](https://react.dev/blog/2024/12/05/react-192), [Vite](https://vite.dev/), [Tailwind CSS](https://tailwindcss.com/), [Mantine](https://mantine.dev/), [@tanstack/react-router](https://tanstack.com/router/latest), [@tanstack/react-query](https://tanstack.com/query/latest)

Backend: [Hono](https://hono.dev/), [Zod](https://zod.dev/), [Drizzle](https://orm.drizzle.team/)

## 🗂️ Project Structure
```
/api - be
/web - fe
README.md
```

## 🏁 Quick Start
This project requires [Node.js](https://nodejs.org/en/) version 18+ or 20+. Or use `quick-setup.sh` and then run development servers.
```bash
# 1. Clone repo

# 2. API
cd api

# 2.1 Dependencies
npm i

# 2.2 Create environment
cp .env.example .env

# 2.3 DB Migration
npx drizzle-kit migrate

# 2.4 Run development
npm run dev

# 3. WEB
cd web
npm i
npm run dev

```


## 📝 License
MIT © 2025 Michal Griessel