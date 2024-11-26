const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware pour l'authentification

const urlController = require('../controllers/url');

// ajout d'url
router.post('/addUrl', urlController.addUrl);

router.post('/removeUrl', auth, urlController.removeUrl);

router.get('/validatedUrls', urlController.getValidatedUrls);

router.get('/nonValidatedUrls', urlController.getNonValidatedUrls);
router.post('/updateIsvalidated',auth, urlController.updateIsvalidated)

module.exports = router;