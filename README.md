# Tottho Vandar – Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-purple?logo=redux)](https://redux-toolkit.js.org/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.0-0170FE?logo=antdesign)](https://ant.design/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**Tottho Vandar** is a full‑stack blog platform where users can create posts, engage with comments and likes, follow tags/users, and receive email notifications. This is the **frontend** built with Next.js (App Router), Redux Toolkit, Ant Design, and Tailwind CSS.

🔗 **Backend repository:** [github.com/Ashraful52038/Tottho-Vandar-Backend](https://github.com/Ashraful52038/Tottho-Vandar-Backend)

---

## ✨ Features

- 🔐 **Authentication** – Login, register, email verification, password reset, change password  
- 📝 **Post Management** – Create, edit, delete, view posts with rich text editor (ReactQuill)  
- 🏷️ **Tags** – Admin can create/edit/delete tags; users can filter posts by tag  
- 💬 **Comments & Replies** – Nested comments with delete & mention support  
- ❤️ **Likes** – Like/unlike posts 
- 👥 **User Profiles** – View user posts, comments, likes
- 🔔 **Follow System** – Follow users and tags → personalised feed  
- 📸 **Image Upload** – Upload featured images for posts  
- 📧 **Email Notifications** – Verification, password reset, reply notifications (SMTP + optional RabbitMQ)  
- 📱 **Responsive UI** – Works on desktop & mobile  

---

## 🚧 Upcoming Features (Roadmap)

- 🏷️ **Tag Manager** – Admin panel to create, edit, delete tags; users can follow tags.
- 👥 **Follow System** – Follow users and tags to get a personalized feed.
- 📚 **Reading List / Saved Posts** – Save posts to read later, with a dedicated saved page.
- 📝 **Draft Posts** – Save posts as drafts and publish them later.
- 🕒 **Latest Posts** – Dedicated tab for newest posts first.
- 🌟 **Featured Writers** – Show most followed writers in sidebar.
- 🖼️ **Profile Image Upload** – Users can upload and crop their avatar.
- 🔔 **Email Notifications** – Receive notifications for replies and follows (planned).

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)  
- **Language:** TypeScript  
- **State Management:** Redux Toolkit (auth, posts, comments, profile, ui)  
- **UI Library:** Ant Design + Tailwind CSS  
- **HTTP Client:** Axios (with interceptors for JWT & 401 handling)  
- **Rich Text Editor:** ReactQuill  
- **Date Handling:** moment.js  

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and yarn 
- Backend server running (see [backend repo](https://github.com/Ashraful52038/Tottho-Vandar-Backend))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ashraful52038/Tottho-Vandar-frontend.git
   cd Tottho-Vandar-frontend
