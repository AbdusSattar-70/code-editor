<a name="readme-top"></a>

<div align="center">
  <h3><b>LiCoderZ</b></h3>
</div>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🚀 Introduction](#introduction)
  - [🎮 Application Overview](#application-overview)
  - [🔑 Key Features](#key-features)
- [💻 Getting Started](#getting-started)
  - [🛠 Prerequisites](#prerequisites)
  - [🚀 Installation](#installation)
- [🎮 Usage](#usage)
  - [🔄 How to Use](#how-to-use)
  - [📊 Application Logic](#application-logic)
- [👤 Author](#author)
- [📝 License](#license)

<!-- ABOUT THE PROJECT -->

## 📖 About the Project <a name="about-project"></a>

### 🚀 Introduction <a name="introduction"></a>

Welcome to LiCoderZ - a web-based code editor designed for developers to write, manage, and preview HTML, CSS, and JavaScript code within a single, intuitive interface. This application combines a live preview, file management, and a console/terminal for debugging, making it a powerful tool for front-end development and experimentation.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>BUILT WITH</summary>
  <ul>
    <li><a href="#">React</a></li>
    <li><a href="#">Next.js</a></li>
    <li><a href="#">TypeScript</a></li>
    <li><a href="#">Tailwind CSS</a></li>
    <li><a href="#">Monaco Editor</a></li>
  </ul>
</details>
<details>
  <summary>Run Environment</summary>
  <ul>
    <li><a href="#">Node.js</a></li>
    <li><a href="#">npm</a></li>
  </ul>
</details>
<details>
  <summary>Database</summary>
  <ul>
    <li>No Database</li>
  </ul>
</details>

### 🎮 Application Overview <a name="application-overview"></a>

LiCoderZ enables users to create, edit, and organize files and folders in a hierarchical structure. The code editor supports syntax highlighting for multiple languages, and the live preview updates in real-time as you modify your code, providing an immersive coding experience.

### 🔑 Key Features <a name="key-features"></a>

LiCoderZ incorporates several standout features:

- **File Management**: Manage projects using a hierarchical folder and file system in the left sidebar.
- **Code Editor**: Edit code with syntax highlighting for HTML, CSS, JavaScript, JSON, and Markdown.
- **Live Preview**: See real-time updates of your HTML/CSS/JavaScript code in the right panel.
- **Console/Terminal**: Debug efficiently with integrated console and terminal panels.
- **Theme Support**: Switch between dark and light themes for a personalized coding environment.
- **Resizable Panels**: Adjust the layout by resizing panels to suit your workflow.

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

### 🛠 Prerequisites <a name="prerequisites"></a>

To run LiCoderZ, you need the following:

- Node.js installed on your machine

### 🚀 Installation <a name="installation"></a>

1. Clone the repository:

   ```bash
   git clone https://github.com/AbdusSattar-70/code-editor.git
   cd licoderz
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Access the application:

   Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

<!-- USAGE -->

## 🎮 Usage <a name="usage"></a>

### 🔄 How to Use <a name="how-to-use"></a>

1. **File Management**

   - Use the left sidebar to create, rename, or delete folders and files.
   - Click a file to open it in the editor; the active file will be highlighted.

2. **Code Editor**

   - Select a file from the sidebar to edit its content in the central panel.
   - Write HTML, CSS, or JavaScript code with real-time syntax highlighting.
   - Changes are saved after a 500ms delay and reflected in the live preview if active.

3. **Live Preview**

   - View a live preview of your active HTML file in the right panel.
   - Toggle the preview on/off using the play/pause button in the editor toolbar.
   - Updates appear instantly when the preview is active.

4. **Console/Terminal**

   - Monitor console output (e.g., `console.log` results) and terminal messages in the bottom panel.
   - Use this for debugging or tracking application events.

5. **Theme Switch**

   - Toggle between dark and light modes via the navbar at the top.

6. **Resizable Panels**
   - Drag resize handles between panels to adjust the layout.
   - Collapse the left or right panels for additional editor space as needed.

### 📊 Application Logic <a name="application-logic"></a>

LiCoderZ employs a state-driven approach to manage the file tree, active file, and editor content. Built on React’s component-based architecture, it leverages hooks for efficient state management and side effects, ensuring a smooth and responsive user experience.

<!-- AUTHOR -->

## 👤 Author <a name="author"></a>

## 👤 Abdus Sattar

- GitHub: [AbdusSattar-70](https://github.com/AbdusSattar-70)
- Twitter: [Abdus Sattar](https://twitter.com/Abdus_Sattar70)
- LinkedIn: [Abdus Sattar](https://www.linkedin.com/in/abdus-sattar-a41a26215/)

## Future Features

- **Enhanced File Persistence**: Save projects locally or in the cloud.
- **Collaboration Tools**: Enable real-time coding with others.
- **Custom Shortcuts**: Add configurable keyboard shortcuts for power users.

## Contributing

Contributions are welcome! Feel free to suggest changes, report issues, or request features by forking this repository, creating a new branch, and submitting a pull request.

Check the [issues page](../../issues/) for more details.

## Show Your Support

If you enjoy LiCoderZ, please give it a star ⭐️ on GitHub. You can use it under the [MIT License](./LICENSE).

## Acknowledgments

Special thanks to the open-source community for tools like React, Next.js, and Monaco Editor that made this project possible.

## License

This project is licensed under the [MIT License](./LICENSE).
