var express = require('express');
var router = express.Router();
 
module.exports = function(raceController, participantController, barController, visitorController) {

    router.route('/')
        .get(raceController.getRaces)
        .post(raceController.addRace);

    router.route('/:id')
        .get(raceController.getRace)
        .delete(raceController.removeRace)
        .put(raceController.editRace);

    router.route('/:id/participants')
        .get(participantController.getParticipants)
        .post(participantController.addParticipant)
        .put(participantController.editParticipants);

    router.route('/:id/participants/:userid')
        .delete(participantController.removeParticipant);

    router.route('/:id/bars')
        .get(barController.getBars)
        .post(barController.addBar);

    router.route('/:id/bars/:barid')
        .get(barController.getBar)
        .put(barController.editBar)
        .delete(barController.removeBar);

    router.route('/:id/bars/:barid/visitors')
        .get(visitorController.getVisitedParticipants)
        .post(visitorController.addVisitor);

    router.route('/:id/bars/:barid/visitors/:userid')
        .delete(visitorController.removeVisitor);
    
    return router;
};