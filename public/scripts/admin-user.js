function User() {
    this.totalPages = 1;
    this.currentPage = 1;
    this.selectedItemID = null;
    this.headers = {
        'Content-Type' : 'application/json'
    };
}

User.prototype.getUsers = function(page, callback) {
    var self = this;

    $.ajax({
        url: '/users?page=' + page,
        dataType : 'json',
        headers : this.headers,
        type: 'GET'
    }).done(function(data) {
        self.totalPages = data.pages;
        self.currentPage = data.currentPage;
        callback(data.data);
    }).fail(function() {
        self.totalPages = 1;
        self.currentPage = 1;
        callback([]); // Empty array
    });
};