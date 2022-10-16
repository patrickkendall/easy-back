const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const axios = require("axios");

const User = require("../model/User");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

var country;

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const getCountry = () => {
  fetch('https://api.ipregistry.co/?key=tryout')
    .then(function (response) {
      return response.json();
    })
    .then(function (payload) {
      console.log(payload.location.country.name + ', ' + payload.location.city);
    });
}

router.post("/user", async (req, res) => {
  var email = req.body.email;
  const user = await User.findOne({
    email: email
  })
  res.send(user);
 })

router.put("/update", async (req, res, next) => {
  var data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    status: "inactive"
  }
  console.log(req.body.email)
  try {
    await User.findOneAndUpdate({ email: req.body.email }, data, { new: true })
    console.log("success")
  } catch {
    res.status(500).json({
      error: err
    });
    console.log("fail")
  }
})

router.post(
  "/signup", multer({ storage: storage }).single("image"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(res.status(400).json({
        errors: errors.array()
      }))
      return res.status(400).json({
        errors: errors
      });
    }

    const { username, email, password, image } = req.body;
    res.send("username: " + username + " email: " + email + " password: " + password + " image: " + image)

    console.log(typeof image)

    try {
      let user = await User.findOne({
        email
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      console.log("2")

      const url = req.protocol + '://' + req.get("host");
      var imagePath = url + "/images/" + req.file.filename;

      user = new User({
        username,
        email,
        password,
        imagePath,
        "status": "active"
      });

      console.log("1")

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };
      console.log("1")

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      //res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],

  async (req, res) => {
    var fullData;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }



    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password!"
        });

      const payload = {
        user: {
          id: user.id
        }
      };



      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          fullData = {
            "token": token,
            "status": user.status,
            "email": user.email,
            "username": user.username,
            "password": user.password,
          }
          res.status(200).json({
            fullData
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */


router.get("/users", async (req, res) => {
  try {
    const user = await User.find()
    res.send(user)
  } catch (e) {
    console.log(e)
  }

})


const makeid = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


module.exports = router;
