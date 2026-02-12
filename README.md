## Hyperlume a game development hackathon website 

A  platform for game development event organised at Newton School of Technology, 
allowing teams to register, submit their games, games are built on unity editor and based on the learning on workshop conducted on.
Teams have to upload the game on platform Itch.io and submit it , they can view other submissions also .



## Features

- **Team Registration**: Secure team sign-up with leader and member details.
- **Game Submission**: Integrated upload functionality for Itch.io links and game descriptions.
- **Showcase Gallery**: Browse and view submitted games.
- **Admin/Team Login**: Manage submissions and view team status.
- **Responsive Design**: Optimized for various devices.

## Tech Stack

- **Frontend**: EJS (Embedded JavaScript Templating), CSS, Bootstrap (if applicable)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Deployment**: Vercel

##  Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or AtlasURI)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahulgupta7777/GameDevWebsite.git
   cd GameDevWebsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. **Start the Application**
   ```bash
   npm start
   ```
   The server will start at `http://localhost:3000`.

##  Deployment

This project is configured for deployment on [Vercel](https://vercel.com).

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. For production deployment:
   ```bash
   vercel --prod
   ```


## 📄 License

This project is licensed under the ISC License.
