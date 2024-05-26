# Real-Time Collaborative Whiteboard

🎨 Collaborate visually in real time with this intuitive whiteboard application!

## Features

<ul>
<b>Real-time Drawing:</b>See others' strokes as they happen.<br>
<b>Board Rooms:</b> Unique IDs let you create private collaboration spaces.<br>
<b>Undo/Redo:</b> Fix mistakes easily.<br>
<b>Image Uploads:</b> Enhance your ideas with visuals.<br>
<b>Pen Customization:</b> Change color and width for expressive drawing.<br>
</ul>

## Use Cases

<ol>
<li><<b>Brainstorming:</b> Capture ideas together, no matter the distance./li><br>
<li><b>Creative</b> Collaboration: Sketch, draw, and design collectively.</li><br>
<li><b>Remote Teaching/Learning:</b> Visual explanations made easy.</li><br>
</ol>

## Tech Stack
<ol>
<li><b>Frontend:</b> ReactJS, CSS</li><br>
<li><b>Backend:</b> Node.js</li><br>
<li><b>Collaboration:</b> Socket.IO</li><br>
<li><b>Unique IDs:</b> UUID</li><br>
<li><b>Pop-up Messages:</b> React Toaster</li><br>
</ol>

## How It Works
<ul>
<li>A user can create a new board unique Id or can joins a existing board room using a unique ID.</li>
<li>Socket.IO establishes a persistent connection between clients and the server.</li>
<li>Drawing, image uploads, and undo are broadcast as events via Socket.IO.</li>
<li>All connected clients receive and render these drawing updates in real time.</li>
</ul>

##Getting Started
git clone https://your-repository-url.git


