# E-Karigar Backend Deployment Guide (Render.com)

This guide provides step-by-step instructions to deploy the NestJS + Prisma backend to Render.com.

## 1. Prerequisites
- A Render.com account
- Your code must be pushed to a GitHub/GitLab repository
- Your Aiven PostgreSQL Database URL (from your current `.env` file)
- Your Cloudinary credentials and JWT secrets

## 2. Create a New Web Service on Render
1. Log in to [Render dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub/GitLab account and select the `E-Kariger-Web-system-main` repository.

## 3. Configuration Settings
Fill out the service configuration as follows:

- **Name**: `e-karigar-backend` (or any preferred name)
- **Region**: Choose the region closest to your Aiven database to minimize latency.
- **Branch**: `main` (or the branch you want to deploy, e.g., `dev`)
- **Root Directory**: `e-karigar-backend` 
  *(⚠️ **CRITICAL**: Because your project has separate frontend and backend folders, you must specify `e-karigar-backend` as the Root Directory so Render knows where to look).*
- **Environment**: `Node`
- **Build Command**: 
  ```bash
  npm install && npx prisma generate && npm run build
  ```
  *(This command installs all dependencies, generates the Prisma client required for database access, and compiles the TypeScript code into the `dist` folder).*

- **Start Command**:
  ```bash
  npm run start:prod
  ```
  *(This runs the compiled production-ready NestJS application).*

## 4. Environment Variables
Scroll down to the **Environment Variables** section and click **Add Environment Variable**. You must add all the variables from your local `e-karigar-backend/.env` file. 

| Key | Explanation / Source |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://...` (Your Aiven DB URL from your local .env) |
| `JWT_SECRET` | Your JWT secret key |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET`| Your Cloudinary API Secret |

*(Note: Render automatically assigns a PORT, so you don't need to specify `PORT=3000` unless you explicitly want to).*

## 5. Deploy
1. Click **Create Web Service**.
2. Render will automatically start the build process. You can monitor the logs in the dashboard.
3. Once the build finishes and the service starts, Render will give you a live URL (e.g., `https://e-karigar-backend-xyz.onrender.com`).
4. **Important**: Go to your Frontend code and update your `VITE_API_URL` environment variable to point to this new Render URL so your frontend can communicate with the live backend!

## 6. Updating the Database Schema (Post-Deployment)
If you ever change your `schema.prisma` file in the future (like adding new tables or columns), you can apply those changes to your production Aiven database directly from the Render Shell:
1. Go to your Render Web Service dashboard.
2. Click on the **Shell** tab.
3. Run the following command:
   ```bash
   npx prisma db push
   ```
   *(Alternatively, since the database is hosted externally on Aiven, you can safely run `npx prisma db push` locally from your own computer).*
