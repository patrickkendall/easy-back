const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  imagePath: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  }

});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
