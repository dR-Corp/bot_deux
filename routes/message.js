const express = require("express");
const messageController = require("../controllers/message");

const router = express.Router();

router.post('/', messageController.sendMessage);
router.get('/', messageController.getAllMessage);

module.exports = router