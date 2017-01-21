var _ = require('underscore');
var controller = {};

module.exports = function(pageHelper, Race, User) {

    /**
     * Get visited participants of single race
     * @param req
     * @param res
     */
    controller.getVisitedParticipants = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        // Find race
        Race.findOne(query)
            .populate('visited_participants')
            .exec(function (err, race){
                if(err) return res.json(err);

                // Check if race exist
                if(!race)
                    return res.status(400).json({error: 'race not found'});

                // Check if bar exists
                var index = _.indexOf(race.bars, _.findWhere(race.bars, {
                    "google_id" : req.params.barid
                }));

                if(index === -1)
                    return res.status(400).json({error: 'bar not found'});

                res.json(race.bars[index].visited_participants);
            });
    };

    /**
     * Add Visitor
     * @param req
     * @param res
     */
    controller.addVisitor = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        // Find race
        Race.findOne(query, function (err, race) {
            if(err) return res.json(err);

            // Check if race exist
            if(!race)
                return res.status(400).json({error: 'race not found'});

            // Check if userid is set
            if(!req.body.userid)
                return res.status(400).json({error: 'userid is required'});

            // Check if bar exists
            var index = _.indexOf(race.bars, _.findWhere(race.bars, {
                "google_id" : req.params.barid
            }));

            if(index === -1)
                return res.status(400).json({error: 'bar not found'});

            // Find user
            var query = {};
            query._id = req.body.userid;
            User.findOne(query, function (err, user) {
                if(err) return res.json(err);

                // Check if user exist
                if(!user)
                    return res.status(400).json({error: 'user not found'});

                // Check if userid exists in array
                if(race.bars[index].visited_participants.indexOf(user._id) > -1)
                    return res.status(400).json({error: 'user already visited this bar'});

                // Add user to visited_participants list
                race.bars[index].visited_participants.push(user._id);
                race.save(function(err, data){
                    if(err) return res.json(err);

                    res.json(data);
                });
            });
        });
    };

    controller.removeVisitor = function(req, res) {
        var query = {};

        if (req.params.id)
            query._id = req.params.id;

        // Find race
        Race.findOne(query, function (err, race){
            if(err) return res.json(err);

            // Check if race exist
            if(!race)
                return res.status(400).json({error: 'race not found'});

            // Check if userid is set
            if(!req.params.userid)
                return res.status(400).json({error: 'userid is required'});

            // Check if bar exists
            var barindex = _.indexOf(race.bars, _.findWhere(race.bars, {
                "google_id" : req.params.barid
            }));

            if(barindex === -1)
                return res.status(400).json({error: 'bar not found'});

            // Check if userid exists in array
            var userindex = race.bars[barindex].visited_participants.indexOf(req.params.userid);
            if(userindex === -1)
                return res.status(400).json({error: 'visited participant not found'});

            // Remove participant from array
            race.bars[barindex].visited_participants.splice(userindex, 1);
            race.save(function(err, data){
                if(err) return res.json(err);

                res.json({message: 'the visited participant has been removed'});
            });
        }); 
    };

    return controller;
};