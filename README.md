Team Name: sheinnovates

Team Members

Team Lead: Sanjana Vijay – Toch Institute of Science & Technology

Member 2: shruthika kb-Toch Institute of Science & Technology

Project Description

A fun browser-based Stress Relief App that combines lighthearted games and AI-powered stress detection tools to help users relax — all processed locally for privacy.

The Problem (that doesn’t exist)

People don’t have enough instant ways to procrastinate while claiming they are “working on mental health.”

The Solution (that nobody asked for)

We built a single web app where you can play stress-busting games, take a stress quiz, and even have your face and voice analyzed for stress — all without sending data anywhere.

Technical Details
Technologies/Components Used

For Software:

Languages: JavaScript, html,css, PHP

Frameworks: React (UI), Flask (optional backend)

Libraries: Face API, Web Audio API, Canvas API, Local Storage

Tools: VS Code, Node.js, Live Server, Diagnostics Page

For Hardware:

None — works fully in-browser

Implementation

For Software:

Installation
# Option 1 – Automated Startup
start-server.bat                   # Windows CMD
powershell -ExecutionPolicy Bypass -File start-server.ps1  # PowerShell
node server-config.js              # Node.js

# Option 2 – Live Server in VS Code
# Install "Live Server" extension, right-click home.html, select "Open with Live Server"

# Option 3 – Manual Server
npm install -g live-server
live-server --port=5500 --open=home.html

# PHP
php -S localhost:8080

Project Documentation
Screenshots

![Screenshot1](https://github.com/Dinkustalker/stress-buster2.0/blob/main/Screenshot%20(4).png) – Home page with quick access to games and tools
![Screenshot2](https://github.com/Dinkustalker/stress-buster2.0/blob/main/Screenshot%20(5).png) – game page
![Screenshot3](https://github.com/Dinkustalker/stress-buster2.0/blob/main/Screenshot%20(6).png) – quiz to know your stress level
![Screenshot4](https://github.com/Dinkustalker/stress-buster2.0/blob/main/Screenshot%20(7).png)-face detection  



Project Demo

Video: [https://github.com/Dinkustalker/stress-buster2.0/commit/311d748bfd0d77e682244eccbc7f02f21e6adb31] – Shows launching the app, playing a game, running stress detection, and viewing results

Instructions to run the project:

Step 1: run the home.html file to land on the home page.
The home page has different tabs that lead to different pages
Step 2: upon clicking the "are you stressed pookie?" Tab you'll be taken to s4.html which is then linked to the games files game1.html game2.html game3.html and game4.html.
Step 4: after finishing the games you'll be redirected to result.html
Step 5: upon clicking "quiz to detect stress level" tab you'll be redirected to stress-quiz.html file
Step 6: upon clicking the mast tab you'll be redirected to face-stress.html
Step 7: falling-emojis.html is used for animating the emojis falling in the background

Team Contributions
Sanjana Vijay: Frontend UI/UX design, workflow diagrams, project structure setup

Shruthika: Backend integration, Node.js/Python server setup, diagnostics system




