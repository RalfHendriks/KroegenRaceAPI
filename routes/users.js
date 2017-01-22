var express = require('express');
var router = express.Router();

module.exports = function(userController) {

    router.route('/')
        .get(userController.getUsers)
        .post(userController.addUser);

    router.route('/:id')
        .get(userController.getUser)
        .put(userController.editUser);

    return router;
};