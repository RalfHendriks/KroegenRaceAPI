var helper = {};
var _ = require('underscore');

module.exports = function(authController) {

    /**
     * Get header type
     * @param req
     */
    helper.getHeaderType = function(req) {
        var headerType;
        switch(req.get('Content-Type')) {
            case 'application/json':
                headerType = 'application/json';
                break;
            case 'text/html':
                headerType = 'text/html';
            default:
                headerType = 'text/html';
        }
        return headerType;
    };

    /**
     * Render Page
     * @param req
     * @param page - Template file name for rendering HTML
     * @param data - JSON data
     */
    helper.renderPage = function(req, res, page, data, pages) {
        // Check if totalItems parameter isset
        if (typeof pages === 'undefined')
            pages = 0;

        if(this.getHeaderType(req) === 'application/json') {
            var returnJson = {
                currentPage: (req.query.page > 0 ? parseFloat(req.query.page) : 1),
                pages: pages,
                data: data
            };
            res.json(returnJson);
        } else {
            var htmlData = {
                userPermission: authController.getUserRole(req, res),
                data: data,
                currentPage: (req.query.page > 0 ? parseFloat(req.query.page) : 1),
                pages: pages,
                req: req,
                _: _ // Include underscore to view
            }
            res.render(page, htmlData);
        }
    };

    return helper;
};