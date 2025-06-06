# 🧠 Admin Dashboard

A professional **MERN Stack** web application designed for efficient task distribution and management by an admin. The system allows:

- Secure authentication and access control
- Agent creation and management
- Task file upload via CSV
- Auto-distribution of tasks among agents
- Organized task viewing grouped by agent
- Clean, responsive, and modern UI built using **React, Tailwind CSS, and ShadCN/UI**

---

## 🔗 Live Demo

👉 [Visit Live Application](https://dashboard-by-praveen.netlify.app/)

---

## 🚀 Features

### ✅ Authentication
- Admin login & signup with email and password
- JWT-based authentication using secure HTTP-only cookies
- Session persistence (auto-login on refresh)
- Protected routes for the dashboard

### 👨‍💼 Agent Management
- Create agents with name, email, mobile, and password
- View a list of all agents
- Delete agents from the system

### 📁 Task Upload and Distribution
- Upload `.csv`, `.xlsx`, or `.xls` files containing tasks
- Auto-distribute tasks equally among all agents
- Store each task in MongoDB with reference to its assigned agent

### 📋 Tasks Overview
- View all tasks grouped under their respective agents
- Displays task details such as name, phone, and notes
- Handles unknown/missing agent associations gracefully

### 💻 Frontend
- Built using **React + Vite**
- Styled with **Tailwind CSS** and **ShadCN/UI**
- Axios used for secure API communication
- Toast notifications with **sonner**
- State management using **Redux Toolkit** and **Redux Persist**
- Environment variables managed using `.env` (via Netlify)

### 🧰 Backend
- Built with **Node.js** and **Express.js**
- MongoDB used as database (hosted on MongoDB Atlas)
- File uploads handled with **Multer**
- JWT authentication with secure cookie handling
- Modular controller, route, and middleware structure

---

## 🌐 Tech Stack

| Frontend       | Backend         | Database |
|----------------|-----------------|----------|
| React + Vite   | Express.js      | MongoDB  |
| Tailwind CSS   | Node.js         | Mongoose |
| Redux Toolkit  | JWT + Cookies   |          |

---

## 🛠 Deployment

- **Frontend**: [Netlify](https://www.netlify.com/)
- **Backend**: [Render](https://render.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)

---

## 📁 Folder Structure Overview

```bash
📦 backend
 ┣ 📂controllers
 ┣ 📂db
 ┣ 📂middlewares
 ┣ 📂models
 ┣ 📂routes
 ┣ 📂utils
 ┣ 📜.env
 ┣ 📜server.js
📦 frontend
 ┣ 📂src
 ┃ ┣ 📂components
 ┃ ┣ 📂pages
 ┃ ┣ 📂redux
 ┃ ┣ 📜App.jsx
 ┃ ┣ 📜main.jsx
 ┣ 📂utils
 ┣ 📜.env
 ```


 ## 🧪 Local Setup

### 🔁 Clone the Repository

```bash
git clone https://github.com/praveensarraf/admin-dashboard.git
cd admin-dashboard
```

---

## Connect me

- If you're interested in collaborating or have any questions, feel free to reach out to me at my <a href='mailto:praveen96650@gmail.com'>Email</a>.
- You can also connect with me on <a href='https://www.linkedin.com/in/praveen96650'>Linkedin</a>.