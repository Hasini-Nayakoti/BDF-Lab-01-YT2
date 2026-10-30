# Lab 1: Node.js and Express Server

## Student Details

- **Name:** Srihasini Nayakoti
- **Registration Number:** 252U1R1167
- **Section:** CSE-2D

---

## Live Link

**Live URL:** https://bdflab1.vercel.app/

> If the project has not been deployed yet, replace the above line with:
>
> **Live Link:** Not deployed yet

---

## Objective

The objective of this lab is to understand the fundamentals of Node.js and Express.js by creating a basic web server. The lab begins with a server using Node.js's built-in `http` module and then implements the same functionality using Express.js.

The Express server contains multiple GET routes, returns JSON data, generates the current date and time, and handles unknown routes using the appropriate `404 Not Found` status code.

---

## Technologies Used

- **Node.js**
- **Express.js**
- **JavaScript**
- **npm**
- **Visual Studio Code**
- **Google Chrome**
- **Git and GitHub**

---

## Prerequisites

Before running this project, make sure the following are installed:

- Node.js
- npm
- Visual Studio Code or any suitable code editor
- Git

Node.js and npm versions used during development:

```text
Node.js: v26.13.0
npm: 11.20.0
```

---

## Project Structure

```text
lab-01/
│
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── server.js
│
└── screenshots/
    ├── welcome.png
    ├── about.png
    ├── time.png
    └── 404.png
```

> `node_modules/` is intentionally not included in the GitHub repository because it is excluded through `.gitignore`.

---

## Installation and Setup

### 1. Clone the repository

Clone the course repository from GitHub:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the Lab 1 folder:

```bash
cd lab-01
```

### 2. Install dependencies

Install Express and the other project dependencies using:

```bash
npm install
```

### 3. Start the server

Run the application using:

```bash
npm start
```

The server will start on:

```text
http://localhost:3000
```

---

## Environment Variables

This lab does not require any environment variables.

No `.env` file is required for the current implementation.

---

## How the Server Works

The application uses Express.js to create a web server.

The Express application is initialized using:

```javascript
const express = require("express");

const app = express();
```

The server listens for requests on port `3000` during local development.

The application contains three required routes:

- `/`
- `/about`
- `/time`

An additional catch-all route is used to return a `404 Not Found` response for unknown paths.

---

## Endpoints

| Method | Path | Description | Expected Status |
|---|---|---|---:|
| GET | `/` | Displays a welcome message | 200 |
| GET | `/about` | Returns the student's name and section in JSON format | 200 |
| GET | `/time` | Returns the current date and time | 200 |
| GET | `/unknown` | Returns a 404 message for an unknown route | 404 |

---

## Endpoint Details

### 1. GET `/`

The root endpoint displays a welcome message.

**URL:**

```text
http://localhost:3000/
```

**Response:**

```text
Welcome to my Node.js and Express server!
```

**Status Code:**

```text
200 OK
```

### Screenshot

![Welcome Route](screenshots/welcome.png)

---

### 2. GET `/about`

The `/about` endpoint returns the student's name and section in JSON format.

**URL:**

```text
http://localhost:3000/about
```

**Response:**

```json
{
  "name": "Your Name",
  "section": "Your Section"
}
```

**Status Code:**

```text
200 OK
```

### Screenshot

![About Route](screenshots/about.png)

---

### 3. GET `/time`

The `/time` endpoint returns the current date and time using JavaScript's `new Date()`.

**URL:**

```text
http://localhost:3000/time
```

**Response:**

```json
{
  "currentTime": "Current Date and Time"
}
```

**Status Code:**

```text
200 OK
```

### Screenshot

![Time Route](screenshots/time.png)

---

### 4. Unknown Route / 404

If a user requests a path that does not exist, the server returns a `404 Not Found` response.

**Example URL:**

```text
http://localhost:3000/undefined
```

**Response:**

```text
404 - Page Not Found
```

**Status Code:**

```text
404 Not Found
```

### Screenshot

![404 Page Not Found](screenshots/404.png)

---

## Status Code Verification

The routes were tested in the browser and the following status codes were verified:

| Route | Status Code | Result |
|---|---:|---|
| `GET /` | 200 | Successful |
| `GET /about` | 200 | Successful |
| `GET /time` | 200 | Successful |
| `GET /undefined` | 404 | Page Not Found |

---

## Screenshots

### Welcome Route

The root route successfully displays the welcome message.

![Welcome Route](screenshots/welcome.png)

### About Route

The `/about` route successfully returns the student's name and section as JSON.

![About Route](screenshots/about.png)

### Time Route

The `/time` route successfully returns the current date and time.

![Time Route](screenshots/time.png)

### 404 Error Handling

An unknown route successfully returns the `404 - Page Not Found` message.

![404 Error](screenshots/404.png)

---

## package.json

The `package.json` file contains important information about the Node.js project, including the project name, version, scripts, and dependencies.

Important fields include:

| Field | Description |
|---|---|
| `name` | Name of the project |
| `version` | Current version of the project |
| `description` | Short description of the project |
| `main` | Main entry point of the application |
| `scripts` | Commands used to run project tasks |
| `author` | Author of the project |
| `license` | License of the project |
| `dependencies` | External packages required by the project |

The project uses the following start command:

```bash
npm start
```

---

## package.json vs node_modules

### package.json

`package.json` stores the project's metadata, scripts, and dependency information. It tells npm which packages are required by the project.

### node_modules

`node_modules` contains the actual installed packages and their dependencies.

The `node_modules` directory is not committed to GitHub because it can be recreated by running:

```bash
npm install
```

---

## .gitignore

The project contains a `.gitignore` file to prevent unnecessary or sensitive files from being committed to GitHub.

The important entries are:

```text
node_modules/
.env
```

This ensures that the `node_modules` directory and environment-variable files are not uploaded to the repository.

---

## Problems Faced and Solutions

During the implementation of the lab, the Node.js and npm versions were first checked to ensure that the development environment was configured correctly.

The Node.js project was then initialized using `npm init -y`, and Express.js was installed using `npm install express`.

While testing the application, each endpoint was opened separately in the browser. The `/`, `/about`, and `/time` routes returned successful responses with status code `200`. An invalid route was also tested to verify that the server correctly returned the `404 - Page Not Found` message with status code `404`.

The project was tested locally using:

```text
http://localhost:3000
```

All required routes were successfully tested.

---

## Viva Questions

### 1. What is the difference between package.json and node_modules?

`package.json` contains project information, scripts, and dependency details. `node_modules` contains the actual installed packages and their dependencies.

### 2. What does app.listen() do?

`app.listen()` starts the Express server and makes it listen for incoming HTTP requests on a specified port.

Example:

```javascript
app.listen(3000, () => {
    console.log("Server running");
});
```

### 3. What do request and response represent?

`request` represents the HTTP request received from the client, while `response` represents the response that the server sends back to the client.

For example:

```javascript
app.get("/", (req, res) => {
    res.send("Welcome");
});
```

Here, `req` represents the incoming request and `res` is used to send the response.

---

## Conclusion

This lab provided practical experience with Node.js and Express.js server development. A basic server was first understood using Node.js's built-in HTTP module and was then implemented using Express.js.

Multiple GET routes were created to return text and JSON responses, and the `/time` route demonstrated the use of JavaScript's `new Date()` function. The lab also provided an understanding of HTTP status codes and proper handling of invalid routes using a `404 Not Found` response.

The completed application was tested successfully in the browser, and screenshots were included as evidence of the working endpoints.

---

## Submission

**GitHub Repository:** YOUR_GITHUB_REPOSITORY_URL

**Live Application:** YOUR_DEPLOYED_URL
