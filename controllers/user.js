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

            pageHelper.renderPage(req, res, 'user_detail', user);
        });
    };

    controller.editUser = function() {
        res.json({"error" : "Not implemented yey"});
    };

    return controller;
};