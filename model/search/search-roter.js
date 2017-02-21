const controller = require('./search-controller');
const Router = require('express').Router;
const auth = require('../../auth/auth.service');
const router = new Router();

router.get('/:search', (...args) => controller.search(...args));

module.exports = router;
