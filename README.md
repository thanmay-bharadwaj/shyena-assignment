# Task Management Web Application

This repository contains a task management web application with a React.js frontend and Python Django backend. Users can log in, register, create, delete, edit their tasks, and mark tasks as completed or not.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Python Django
- **Authentication**: JWT Tokens
- **Database**: PostgreSQL

## Running the Application

### Backend Setup (Django)

1. **Install Required Django Packages:**
   `pip install djangorestframework djangorestframework-simplejwt django-cors-headers`
   
2. **Set Up PostgreSQL Database Using Docker:**
   To set up PostgreSQL, use Docker Compose:
   `docker compose up -d`

3. **Run Migrations:**
   `python manage.py makemigrations
   python manage.py migrate`

4. **Run the Django Development Server:**
   `python manage.py runserver`

   The backend will be running on http://127.0.0.1:8000.

### Frontend Setup (React)

1. **Install Dependencies:**
   `npm i`
   
2. **Run the Development Server:**
   `npm run dev`

   The frontend will be running on http://localhost:3000.
