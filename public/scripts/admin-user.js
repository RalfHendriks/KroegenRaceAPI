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

User.prototype.getUser = function(id, callback) {
    var self = this;

    $.ajax({
        url: '/users/' + id,
        dataType : 'json',
        headers : this.headers,
        type: 'GET'
    }).done(function(data) {
        callback(data.data);
    }).fail(function() {
        callback([]); // Empty array
    });
};

User.prototype.updateUser = function(id, data, callback) {
    var self = this;

    $.ajax({
        url: '/users/' + id,
        data: JSON.stringify(data),
        dataType : 'json',
        headers : this.headers,
        type: 'PUT',
    }).done(function(data) {
        callback(data);
    }).fail(function(data) {
        callback(data); // Empty array
    });
};
