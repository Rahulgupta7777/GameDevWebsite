const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /.+@adypu\.edu\.in/,
    unique: true,
  },
  urn: { type: String, required: true, unique: true },
});

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    leader: { type: teamMemberSchema, required: true },
    member2: { type: teamMemberSchema, required: true },
    member3: {
      name: { type: String },
      email: {
        type: String,
        match: /.+@adypu\.edu\.in/,
      },
      urn: { type: String },
    },
  },
  {
    validate: function () {
      if (
        (this.member3.name || this.member3.email || this.member3.urn) &&
        (!this.member3.name || !this.member3.email || !this.member3.urn)
      ) {
        throw new Error(
          "If any member3 field is provided, all must be filled."
        );
      }
    },
  }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
