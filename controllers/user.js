var controller = {};

module.exports = function(User) {

    controller.getUsers = function(req, res) {
        /*var query = {};

        User.find(query)
            .exec(function (error, data) {
                // error, dispatch it
                if (error) return next(error);

                if (req.params.id) {
                    if (data.length != 0) {
                        data = data[0];
                    } else {
                        res.status(404);
                        return res.json({error: 'user not found'});
                    }
                }

                res.json(data);
            });*/
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
    };

    controller.editUser = function() {
        console.log('editUser');
    };

    return controller;
};