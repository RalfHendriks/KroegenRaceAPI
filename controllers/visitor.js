var _ = require('underscore');
var controller = {};

module.exports = function(Race, User) {

    /**
     * Get visited participants of single race
     * @param req
     * @param res
     */
    controller.getVisitedParticipants = function(req, res) {
        console.log('getVisitedParticipants');
    };

    controller.addVisitor = function(req, res) {
        console.log('addVisitor');
    };

    controller.removeVisitor = function(req, res) {
        console.log('removeVisitor');
    };

    return controller;
};