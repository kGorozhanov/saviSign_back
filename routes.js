const express = require('express');
const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/user-router');
const product = require('./model/product/product-router');
const serialGroup = require('./model/serial-group/serial-group-router');
const serial = require('./model/serial/serial-router');

router.use('/auth', require('./auth'));

router.use('/users', user);

router.use('/products', product);

router.use('/serial-groups', serialGroup);

router.use('/serials', serial);

module.exports = router;
