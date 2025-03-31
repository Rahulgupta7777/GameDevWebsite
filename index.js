const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const connect = require("./connection");
const Team = require("./model/user.model");
const Game = require("./model/game.model");

connect();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  if (req.query.registration === "success") {
    return res.render("index", {
      message:
        "Registration successful. Please go to upload page for uploading game.",
      type: "success",
    });
  }
  res.render("index", { message: null });
});

app.post("/registration", async (req, res) => {
  const teamData = req.body;
  try {
    const existingTeam = await Team.findOne({ teamName: teamData.teamName });
    if (existingTeam) {
      return res.render("registration", {
        message: "Team name already exists.",
        teamData,
      });
    }

    if (teamData.member3Name || teamData.member3Email || teamData.member3URN) {
      if (
        !(teamData.member3Name && teamData.member3Email && teamData.member3URN)
      ) {
        return res.render("registration", {
          message: "Please fill in all fields for member 3.",
          teamData,
        });
      }
    }

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
    res.redirect("/?registration=success");
    return;
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      res.render("registration", {
        message: `The ${duplicateField} "${error.keyValue[duplicateField]}" already exists.`,
        teamData,
      });
      return;
    }
  }
});

app.get("/view", async (req, res) => {
  const submissions = await Game.find();
  res.render("submissions", { submissions, teamName: req.query.teamname });
});

app.get("/register", (req, res) => {
  res.render("registration", { message: null, teamData: null });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/upload", (req, res) => {
  res.render("login", { message: null, data: null });
});

app.post("/upload", async (req, res) => {
  try {
    const { teamName, teamUserID, itchioURL, gameDescription, gameGenre } =
      req.body;
    console.log({
      teamName,
      teamUserID,
      itchioURL,
      gameDescription,
      gameGenre,
    });
    const game = new Game({
      teamUserID,
      name: teamName,
      itchioURL,
      gameDescription,
      gameGenre,
    });
    const saveData = await game.save();
    if (!saveData) {
      res.render("upload", {
        message: "Error uploading game",
        teamID: teamUserID,
        teamName,
      });
      return;
    }
    res.render("index", {
      message: "Game uploaded successfully",
      type: "success",
    });
  } catch (error) {
    console.log({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { teamName, password } = req.body;
  console.log(req.body);
  try {
    const team = await Team.findOne({ "leader.email": teamName });
    if (!team) {
      res.render("login", {
        message: "Invalid email or password",
        data: req.body,
      });
      return;
    }
    console.log({ team });

    if (team.password !== password) {
      res.render("login", {
        message: "Invalid email or password",
        data: req.body,
      });
      return;
    }

    const game = await Game.findOne({
      teamUserID: team._id,
    });
    if (game) {
      return res.redirect("/view?teamname=" + team.teamName);
    }

    return res.render("upload", {
      message: null,
      teamID: team._id,
      teamName: team.teamName,
    });
    console.log({ success: true, message: "Login successful", team });
  } catch (error) {
    console.error("Error validating team:", error);
    console.log({ success: false, message: "Server error" });
    res.render("login", { message: "Server Error", data: null });
  }
});

// ✅ Added route for Event Highlights
app.get("/event-highlights", (req, res) => {
  res.render("Event");
});

// ✅ Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
