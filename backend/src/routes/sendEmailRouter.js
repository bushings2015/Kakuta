const express = require("express");
const sendEmailController = require("../controllers/sendEmailController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const sendEmailRouter = express.Router();

sendEmailRouter.post('/request3d', sendEmailController.sendEmail)

module.exports = sendEmailRouter