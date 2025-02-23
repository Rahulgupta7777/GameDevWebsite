const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const connect = require("./connection");
const Team = require("./model/user.model");
const Game = require("./model/game.model");
const { render } = require("ejs");
const { error } = require("console");

// ✅ Connect to database at startup
connect();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { message: null });
});

app.post("/registration", async (req, res) => {
  const teamData = req.body;
  try {
    const existingTeam = await Team.findOne({ teamName: teamData.teamName });
    console.log({ existingTeam });
    if (existingTeam) {
      return res.render("registration", { error: "Team name already exists." });
    }
    return;
    const team = new Team({
      teamName: teamData.teamName,
      password: teamData.password,
      leader: {
        name: teamData.leaderName,
        email: teamData.leaderEmail,
        urn: teamData.leaderURN,
      },
      member2: {
        name: teamData.member2Name,
        email: teamData.member2Email,
        urn: teamData.member2URN,
      },
      member3:
        teamData.member3Name && teamData.member3Email && teamData.member3URN
          ? {
              name: teamData.member3Name,
              email: teamData.member3Email,
              urn: teamData.member3URN,
            }
          : undefined,
    });

    await team.save();
    res.redirect("/");
    return;
  } catch (error) {
    if (error.code === 11000) {
      // Extract the field causing the issue
      const duplicateField = Object.keys(error.keyPattern)[0]; // Gets the first duplicate field
      res.render("registration", {
        error: `The ${duplicateField} "${error.keyValue[duplicateField]}" already exists.`,
        teamData,
      });
      return;
    }
  }
});

app.get("/register", (req, res) => {
  res.render("registration", { error: null });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/upload", (req, res) => {
  res.render("login");
});

app.post("/upload", async (req, res) => {
  try {
    console.log(req.body);
    const { teamUserID, itchioURL, gameDescription, gameGenre } = req.body;
    console.log({ teamUserID, itchioURL, gameDescription, gameGenre });
    const game = new Game({
      teamUserID,
      itchioURL,
      gameDescription,
      gameGenre,
    });
    const saveData = await game.save();
    if (!saveData) {
      console.log("Error saving data");
      return;
    }
    console.log(saveData);

    res.send("Saved fuckoff");
  } catch (error) {
    console.log({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { teamName, password } = req.body;
  try {
    const team = await Team.findOne({ teamName });

    if (!team) {
      console.log({ success: false, message: "Team not found" });
    }

    if (team.password !== password) {
      console.log({ success: false, message: "Incorrect password" });
    }
    return res.render("upload", { teamID: team._id });
    console.log({ success: true, message: "Login successful", team });
  } catch (error) {
    console.error("Error validating team:", error);
    console.log({ success: false, message: "Server error" });
  }
});

// ✅ Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
