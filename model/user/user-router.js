const controller = require('./user-controller');
const Router = require('express').Router;
const auth = require('../../auth/auth.service');
const router = new Router();


router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
// router.put('/:id', auth.isAuthenticated(), controller.updateUser);
// router.get('/:id', auth.isAuthenticated(), controller.show);
// router.post('/', auth.hasRole('admin'), controller.create);
router.post('/password', auth.isAuthenticated(), controller.changePassword);
module.exports = router;
