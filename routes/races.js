var express = require('express');
var router = express.Router();
 
module.exports = function(raceController) {

    router.route('/')
        .get(raceController.getRaces)
        .post(raceController.addRace);

    router.route('/:id')
        .get(raceController.getRace)
        .delete(raceController.removeRace)
        .put(raceController.editRace);

    router.route('/:id/participants')
        .get(raceController.getParticipants)
        .post(raceController.addParticipant);

    router.route('/:id/participants/:userid')
        .delete(raceController.removeParticipant);

    router.route('/:id/bars/')
        .get(raceController.getBars)
        .post(raceController.addBar);

    router.route('/:id/bars/:barid')
        .get(raceController.getBar)
        .put(raceController.editBar)
        .delete(raceController.removeBar);

    router.route('/:id/bars/:barid/visitors')
        .get(raceController.getVisitedParticipants)
        .post(raceController.addVisitor);

    router.route('/:id/bars/:barid/visitors/:userid')
        .delete(raceController.removeVisitor);
    
    return router;
};