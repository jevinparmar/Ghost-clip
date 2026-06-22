# 👻 GhostClip

GhostClip is a fast, lightweight, and user-friendly web application that allows users to download Instagram reels and posts without logging in. Built with **React** on the frontend and **Python + Flask** on the backend, GhostClip provides a smooth experience with responsive design and support for both light and dark themes.

---

## ✨ Features

- 📥 Download Instagram Reels
- 🖼️ Download Instagram Posts
- 🔒 No Login Required
- ⚡ Fast and Lightweight
- 🌙 Light & Dark Mode
- 📱 Fully Responsive Design
- 🎨 Modern and User-Friendly Interface
- 🆓 Free to Use
- 🔄 Simple and Clean UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Vanilla CSS

### Backend
- Python
- Flask

### Tools & Libraries
- Axios
- React Icons
- Flask-CORS

---

## 📂 Project Structure

```
GhostClip/
│
├── ghostclip/                 # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── ghostbackend/              # Backend (Flask)
│   ├── app/
│   ├── storage/
│   ├── run.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/GhostClip.git
cd GhostClip
```

---

## Frontend Setup

Go to the frontend folder:

```bash
cd ghostclip
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## Backend Setup

Go to the backend folder:

```bash
cd ghostbackend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the Flask server:

```bash
python run.py
```

Backend will run at:

```
http://localhost:5000
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory and add your configuration:

```env
SECRET_KEY=your_secret_key
```

---

## 📸 Screenshots

### Light Mode
Add screenshots here

### Dark Mode
Add screenshots here

---

## 🎯 Future Improvements

- Download Instagram Stories
- Download Highlights
- Download Profile Pictures
- Download Multiple Media Posts
- Download Videos in Higher Quality
- History Section
- PWA Support
- More Platform Support

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Jevin Parmar**

GitHub: https://github.com/jevinparmar

---

### ⭐ If you like GhostClip, don't forget to star the repository!
