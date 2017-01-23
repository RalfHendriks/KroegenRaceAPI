var controller = {};

module.exports = function(pageHelper, User) {

    /**
     * Get Users
     * @param req
     * @param res
     */
    controller.getUsers = function(req, res) {
        var query = {};
        var skip = req.query.page > 0 ? (parseFloat(req.query.page) - 1) : 0;
        var sort = req.query.sort ? req.query.sort : 'name';

        // Set filter options
        if(req.query.name != undefined)
            query.name = new RegExp(req.query.name, 'i');

        if(req.query.role != undefined)
            query.role = new RegExp(req.query.role, 'i');

        User.find(query)
        .limit(10)
        .skip(skip * 10)
        .sort(sort)
        .exec(function (err, data){
            if(err) return res.json(err);

            // Get total items
            var pages = 0;
            User.count(query, function(err, count) {
                if(err) return res.json(err);

                pages = Math.ceil(count / 10);
                pageHelper.renderPage(req, res, 'user', data, pages);
            });
        });
    };

    controller.addUser = function(req, res) {
        User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                res.json('That email is already taken.');
            } else {
                var newUser            = new User();
                newUser.name     = req.body.name;
                newUser.age      = req.body.age; 
                newUser.local.email    = req.body.email;
                newUser.local.password = newUser.generateHash(req.body.password);// use the generateHash function in our user model
                newUser.role = 'user'; 
				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    res.json(newUser);
                });
            }
        });
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

            pageHelper.renderPage(req, res, 'user_detail', user);
        });
    };

    /**
     * Edit User
     * @param req
     * @param res
     */
    controller.editUser = function(req, res) {
        var query = {};

        if (req.params.id) {
            query._id = req.params.id;
        }

        User.findOne(query, function (err, user){
            if(err) return res.json(err);

            if (!user)
                return res.status(404).json({error: 'user not found'});

            User.update(query, req.body, function(err, user) {
                if(err) return res.json(err);

                res.json(user);
            });

        });
    };

    return controller;
};