var controller = {};

module.exports = function(Race, User) {

    /**
     * Get Participants of single race
     * @param req
     * @param res 
     */
    controller.getParticipants = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        // Find race
        Race.findOne(query)
        .populate('participants')
        .exec(function (err, race){
            if(err) return res.json(err);

            // Check if race exist
            if(!race)
                return res.status(400).json({error: 'race not found'});

            res.json(race.participants);
        });
    };

    /**
     * Add Participant to single race
     * @param req
     * @param res
     */
    controller.addParticipant = function(req, res) {
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

            // Find user
            var query = {};
            query._id = req.body.userid;
            User.findOne(query, function (err, user) {
                if(err) return res.json(err);

                // Check if user exist
                if(!user)
                    return res.status(400).json({error: 'user not found'});

                // Check if userid exists in array
                if(race.participants.indexOf(user._id) > -1)
                    return res.status(400).json({error: 'user already participated'});

                // Add user to participants list
                race.participants.push(user._id);
                race.save(function(err, data){
                    if(err) return res.json(err);

                    res.json(data);
                });
            });
        });
    };

    /**
     * Remove Participant of single race
     * @param req
     * @param res
     */
    controller.removeParticipant = function(req, res) {
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

            // Check if userid exists in array
            var index = race.participants.indexOf(req.params.userid);
            if(index === -1)
                return res.status(400).json({error: 'participant not found'});

            // Remove participant from array
            race.participants.splice(index, 1);
            race.save(function(err, data){
                if(err) return res.json(err);

                res.json({message: 'the participant has been removed'});
            });
        });
    };

    return controller;
};