const controller = require('./product-controller');
const Router = require('express').Router;
const auth = require('../../auth/auth.service');
const router = new Router();

router.get('/', auth.isAuthenticated(), (...args) => controller.find(...args));
router.delete('/:id', auth.isAuthenticated(), (...args) => controller.remove(...args));
router.put('/:id', auth.isAuthenticated(), (...args) => controller.update(...args));
router.get('/:id', auth.isAuthenticated(), (...args) => controller.findById(...args));
router.post('/', auth.isAuthenticated(), (...args) => controller.create(...args));

module.exports = router;
