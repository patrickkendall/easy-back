const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const axios = require('axios').default;


const Transaction = require("../model/Transaction");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */


 router.post("/create", async (req, res) => {
  transaction = new Transaction({
    transactionAmount: req.body.transactionAmount,
    transactionWord: req.body.transactionWord,
    reciever: req.body.reciever, 
    accountNumber: req.body.accountNumber,
    recievingBank: req.body.recievingBank,
    remarks: req.body.remarks,
    sender: req.body.sender,
    description: req.body.description,
    withdrawalOrDeposit: req.body.withdrawalOrDeposit,
    timestamp: req.body.timestamp
  });
	await transaction.save()
	res.send(transaction)
})

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
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
          message: "Incorrect Password"
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
          res.status(200).json({
            token
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

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.get("/transactions", async (req,res) => {
  const transactions = await Transaction.find()
  res.send(transactions)
})

module.exports = router;
