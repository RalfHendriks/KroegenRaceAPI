var controller = {};

module.exports = function(User) {

    /**
     * Get Users
     * @param req
     * @param res
     */
    // Todo: Paging
    controller.getUsers = function(req, res) {
        var query = {};

        User.find(query, function (err, data){
            if(err) return res.json(err);

            res.json(data);
        });
    };

    controller.addUser = function(req, res) {

        /*if(!req.body.name) {
            res.status(400);
            return res.json({'error':'name is required'});
        }

        if(!req.body.role) {
            res.status(400);
            return res.json({'error':'role is required'});
        }*/

        /*newUser.save(function(err,newUser) {
         res.json(newUser);
         });*/

        res.json({"error" : "Not implemented yey"});
    };

    /**
     * Get Single User
     * @param req
     * @param res
     */
    controller.getUser = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        // Find user
        User.findOne(query, function (err, user){
            if(err) return res.json(err);

            // Check if user exist
            if(!user)
                return res.status(400).json({error: 'user not found'});

            return res.json(user);
        });
    };

    controller.editUser = function() {
        res.json({"error" : "Not implemented yey"});
    };

    return controller;
};