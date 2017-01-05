var _ = require('underscore');
var controller = {};

module.exports = function(Race, User) {

    /**
     * Get Races
     * @param req
     * @param res
     */
    // Todo: Paging
    controller.getRaces = function(req, res) {
        var query = {};

        Race.find(query, function (err, data){
            if(err) return res.json(err);

            res.json(data);
        });
    };

    /**
     * Add Race
     * @param req
     * @param res
     * @returns {*}
     */
    controller.addRace = function(req, res) {
        if(!req.body.name)
            return res.status(400).json({error: 'name is required'});

        if(!req.body.raceleader)
            return res.status(400).json({error: 'raceleader is required'});

        if(!req.body.bars)
            return res.status(400).json({error: 'bars is required'});

        if(req.body.bars.length === 0)
            return res.status(400).json({error: 'bars array is empty'});


        var newRace = new Race(req.body);
        newRace.save(function(err, data){
            if(err) return res.json(err);

            res.json(data);
        });
    };

    /**
     * Get Single Race
     * @param req
     * @param res
     */
    controller.getRace = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        // Find race
        Race.findOne(query, function (err, race){
            if(err) return res.json(err);

            // Check if race exist
            if(!race)
                return res.status(400).json({error: 'race not found'});

            return res.json(race);
        });
    };

    /**
     * Remove Race
     * @param req
     * @param res
     */
    controller.removeRace = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        Race.findOneAndRemove(query, function (err){
            if(err) return res.json(err);

            res.json({message: 'the race has been removed'});
        });
    };

    /**
     * Edit Race
     * @param req
     * @param res
     */
    controller.editRace = function(req, res) {
        /*var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        Race.findOne(query, function (err, race){
            if(err) return res.json(err);

            if (!race) {
                res.status(404);
                return res.json({error: 'race not found'});
            }

            if(req.body.name) race.name = req.body.name;

            race.save(function(err, data){
                if(err) return res.json(err);

                res.json(data);
            });
        });*/

    };

    return controller;
};