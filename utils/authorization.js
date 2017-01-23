var ConnectRoles = require('connect-roles');

function isAuthenticated(request, callback) {
    if (process.env.NODE_ENV != 'test') {
    return callback(false, request.isAuthenticated());
    }
    else {
        return callback(false);
    }
}

function checkAuth(request, response, next) {
    if (process.env.NODE_ENV != 'test') {
        isAuthenticated(request, function (err, valid) {
            if (valid) {
                return next();
            }
            if (err) {
                response.status(401);
                return response.json({error: err.message});
            }
            // not authorized
            response.status(401);
            response.json({error: 'you must be logged in to do this action'});
        });
    }
    else {
        return next();
    }
}


var roles = new ConnectRoles({
    failureHandler: function (req, res, action) {
        console.log('faillure');
        res.status(403).json({error: 'you do not have the rights to do this.'});
    }
});

roles.use('visitor', function (req) {
    if (req.user && req.user.isTeacher()) {
        return true;
    }
});

roles.use('admin', function (req) {
    if (req.user && req.user.role === 'admin') {
        return true;
    }
});

roles.use('user', function (req) {
    if (req.user && (req.user.isTeacher() || req.user.isAdmin())) {
        return true;
    }
});

module.exports = {
    checkAuth: checkAuth,
    roles: roles
};