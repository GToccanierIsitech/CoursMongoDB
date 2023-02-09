const express = require('express')
const router = express.Router()

// Require controller modules.
const meteorologicalControllers = require('../controllers/meteorologicalController.js')

// GET
router.get('/', meteorologicalControllers.get)


module.exports = router