const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({

  username: {
    type: String,
  },
  favorite: [{
          img: String,
          cardId: String
        }]
});

var Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
