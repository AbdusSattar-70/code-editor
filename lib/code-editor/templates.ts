export const templates = {
  "HTML Boilerplate": {
    name: "HTML Boilerplate",
    language: "html",
    code: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <style>
      /* Ensure full width and height */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
        font-family: sans-serif;
      }
      body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #f9f9f9;
      }
       h1 {
        text-align: center;
        color: #6A5;
      }
      p {
        color: #66;
      }
    </style>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>Start editing to see changes in real-time!</p>
  </body>
  </html>`,
  },
  "Tailwind Setup": {
    name: "Tailwind Setup",
    language: "html",
    code: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Tailwind</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="h-screen w-full p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-blue-600 mb-4">Tailwind Ready</h1>
      <p class="text-gray-600 mb-4">Start building beautiful UIs with Tailwind CSS</p>
      <div class="grid grid-cols-2 gap-4">
        <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
          Button 1
        </button>
        <button class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition">
          Button 2
        </button>
      </div>
    </div>
  </body>
  </html>`,
  },
  "CSS Animation": {
    name: "CSS Animation",
    language: "html",
    code: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>CSS Animation</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
        margin: 0;
      }
      .box {
        width: 100px;
        height: 100px;
        background-color: #0070f3;
        border-radius: 8px;
        animation: bounce 2s infinite;
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-50px); }
      }
    </style>
  </head>
  <body>
    <div class="box"></div>
  </body>
  </html>`,
  },
};
