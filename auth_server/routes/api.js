const router = require('express').Router();

const userApi = require('./user.api');

router.use('/user', userApi);

module.exports = router;
