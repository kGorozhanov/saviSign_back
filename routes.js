const express = require('express');
const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/user-router');
const product = require('./model/product/product-router');
const serialNumber = require('./model/serial-number/serial-number-router');

router.use('/auth', require('./auth'));

router.use('/users', user);

router.use('/products', product);

router.use('/serial-numbers', serialNumber);

module.exports = router;
