# Real-Time Collaborative Whiteboard

🎨 Collaborate visually in real time with this intuitive whiteboard application!

## Features

<ul>
<li><b>Real-time Drawing:</b>See others' strokes as they happen.</li>
<li><b>Board Rooms:</b> Unique IDs let you create private collaboration spaces.</li>
<li><b>Undo/Redo:</b> Fix mistakes easily.</li>
<li><b>Image Uploads:</b> Enhance your ideas with visuals.</li>
<li><b>Pen Customization:</b> Change color and width for expressive drawing.</li>
</ul>

## Use Cases

<ol>
<li><b>Brainstorming:</b> Capture ideas together, no matter the distance./li>
<li><b>Creative</b> Collaboration: Sketch, draw, and design collectively.</li>
<li><b>Remote Teaching/Learning:</b> Visual explanations made easy.</li>
</ol>

## Tech Stack
<ul>
<li><b>Frontend:</b> ReactJS, CSS</li>
<li><b>Backend:</b> Node.js</li>
<li><b>Collaboration:</b> Socket.IO</li>
<li><b>Unique IDs:</b> UUID</li>
<li><b>Pop-up Messages:</b> React Toaster</li>
</ul>

## How It Works
<ul>
<li>A user can create a new board unique Id or can joins a existing board room using a unique ID.</li>
<li>Socket.IO establishes a persistent connection between clients and the server.</li>
<li>Drawing, image uploads, and undo are broadcast as events via Socket.IO.</li>
<li>All connected clients receive and render these drawing updates in real time.</li>
</ul>

##Getting Started
```bash
git clone https://github.com/sumraharshit/Real_Time_Collaborative_WhiteBoard.git


