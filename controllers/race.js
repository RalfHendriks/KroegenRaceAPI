var _ = require('underscore');
var controller = {};

module.exports = function(pageHelper, Race, User) {

    /**
     * Get Races
     * @param req
     * @param res
     */
    controller.getRaces = function(req, res) {
        var query = {};
        var skip = req.query.page > 0 ? (parseFloat(req.query.page) - 1) : 0;
        var sort = req.query.sort ? req.query.sort : 'created_at';

        // Set filter options
        if(req.query.name != undefined)
            query.name = new RegExp(req.query.name, 'i');

        Race.find(query)
        .limit(10)
        .skip(skip * 10)
        .sort(sort)
        .exec(function (err, data){
            if(err) return res.json(err);

            // Get total items
            var pages = 0;
            Race.count(query, function(err, count) {
                if(err) return res.json(err);

                pages = Math.ceil(count / 10);
                pageHelper.renderPage(req, res, 'race', data, pages);
            });
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
        Race.findOne(query)
            .populate('raceleader')
            .populate('participants')
            .exec(function (err, race){
            if(err) return res.json(err);

            // Check if race exist
            if(!race)
                return res.status(400).json({error: 'race not found'});

            pageHelper.renderPage(req, res, 'race_detail', race);
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
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        Race.findOne(query, function (err, race){
            if(err) return res.json(err);

            if (!race)
                return res.status(404).json({error: 'race not found'});

            Race.update(query, req.body, function(err, race) {
                if(err) return res.json(err);

                res.json(race);
            });

        });
    };

    return controller;
};