var controller = {};

module.exports = function(Race) {

    controller.getRaces = function() {
        console.log('getRaces');
    };

    controller.addRace = function() {
        /*var newRace = new Race(req.body);
        var bars = [];
        if(req.body.bars[0].bar == undefined){
            req.body.bars.forEach(function(selectedBar){
                var bar = {
                    "bar": selectedBar,
                    "visited": false
                };
                bars.push(bar);
            });
            newRace.bars = bars;
        }
        newRace.save(function(err,race){
            req.body.bars.forEach(function(selectedBar){
                var newBar = new Bar(selectedBar);
                Bar.findOne({'name' : selectedBar.name,'lat': selectedBar.lat,'long': selectedBar.long} ,function (err,bar) {
                    if(bar == null){
                        newBar.races.push(race);
                        newBar.save(function(err,currentBar){});
                    }
                });
            });
            res.json(race);
        });*/
    };

    controller.getRace = function() {
        console.log('getRace');
    };

    controller.removeRace = function() {
        console.log('removeRace');
    };

    controller.editRace = function() {
        console.log('updateRace');
    };

    controller.getParticipants = function() {
        console.log('getParticipants');
    };

    controller.addParticipant = function() {
        console.log('addParticipant');
    };

    controller.removeParticipant = function() {
        console.log('removeParticipant');
    };

    controller.getBars = function() {
        console.log('getBars');
    };

    controller.addBar = function() {
        console.log('addBar');
    };

    controller.getBar = function() {
        console.log('getBar');
    };

    controller.editBar = function() {
        console.log('editBar');
    };

    controller.removeBar = function() {
        console.log('removeBar');
    };

    controller.getVisitedParticipants = function() {
        console.log('getVisitedParticipants');
    };

    controller.addVisitor = function() {
        console.log('addVisitor');
    };

    controller.removeVisitor = function() {
        console.log('removeVisitor');
    };

    return controller;
};