const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
  transactionAmount: {
    type: Number,
    required: true
  },
  transactionWord: {
    type: String,
    required: true
  },
  reciever: {
    type: String,
    required: true
  },
  accountNumber: {
    type: Number,
    default: true
  },
  recievingBank: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    default: true
  }, 
  sender: {
    type: String,
    default: true
  }, 
  timestamp: {
    type: Date,
    required: true
  },
  withdrawalOrDeposit: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("transaction", TransactionSchema);
