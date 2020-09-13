const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

const {getToken, processPayments} = require("../controllers/paymentb");


router.get("/payment/gettoken/:userId", isAuthenticated, isSignedIn, getToken);

router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayments
);

module.exports = router;
