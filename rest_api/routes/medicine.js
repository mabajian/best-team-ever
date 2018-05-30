const express = require("express");
const router = express.Router();

const MedsController = require("../controllers/medicine");
const HistoryController = require("../controllers/history");
const checkAuth = require('../middleware/check-auth');




// Create new medicine (ex. localhost:3000/medicine/new)
router.post('/new/:profile_id', checkAuth, 
			MedsController.newMedicine, HistoryController.newHistory);

// Get specific medicine data (ex. localhost:3000/medicine/2)
router.get('/:medicine_id', checkAuth, MedsController.getMedicine);

// Edit specific medicine (ex. localhost:3000/medicine/edit/2)
router.patch('/edit/:medicine_id', checkAuth, MedsController.editMedicine);

// Delete specific medicine (ex. localhost:3000/medicine/delete/2)
router.delete('/delete/:medicine_id', checkAuth, MedsController.deleteMedicine);




module.exports = router;
