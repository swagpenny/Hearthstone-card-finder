const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
  cardId: {
    type: String,
  },
  dbfId: {
    type: String,
  },
  name: {
    type: String,
  },
  cardSet: {
    type: String,
  },
  type: {
    type: String,
  },
  rarity: {
    type: String,
  },
  cost: {
    type: Number,
  },
  attack: {
    type: Number,
  },
  health: {
    type: Number,
  },
  text: {
    type: String,
  },
  elite: {
    type: String,
  },
  playClass: {
    type: String,
  },
  img: {
    type: String,
  },
  locale: {
    type: String,
  },
  comments: [{
          comment: String,
          date: String  || Number,
          img: String,
          username: String
        }],
  ratings: [{
    rating: Number,
    username: String
  }]

});

var Cards = mongoose.model("Cards", cardSchema);

module.exports = Cards;
