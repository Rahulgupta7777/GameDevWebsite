const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  teamUserID: { type: String, required: true },
  itchioURL: {
    type: String,
    required: true,
    match: /https?:\/\/(\w+\.)?itch\.io\/.*/,
  },
  gameDescription: { type: String, required: true },
  gameGenre: {
    type: String,
    required: true,
    enum: [
      "action",
      "adventure",
      "puzzle",
      "strategy",
      "rpg",
      "simulation",
      "other",
    ],
  },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
