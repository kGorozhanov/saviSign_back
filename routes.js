const express = require('express');
const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/user-router');
const product = require('./model/product/product-router');

router.use('/auth', require('./auth'));

router.use('/users', user);

router.use('/products', product);

module.exports = router;
