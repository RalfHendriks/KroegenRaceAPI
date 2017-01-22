function Race() {
    this.totalPages = 1;
    this.currentPage = 1;
    this.selectedItemID = null;
    this.headers = {
        'Content-Type' : 'application/json'
    };
}

Race.prototype.getRaces = function(page, callback) {
    var self = this;

    $.ajax({
        url: '/races?page=' + page,
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

Race.prototype.getRace = function(id, callback) {
    var self = this;

    $.ajax({
        url: '/races/' + id,
        dataType : 'json',
        headers : this.headers,
        type: 'GET'
    }).done(function(data) {
        callback(data.data);
    }).fail(function() {
        callback([]); // Empty array
    });
}

Race.prototype.deleteRace = function(id, callback) {
    var self = this;

    $.ajax({
        url: '/races/' + id,
        dataType : 'json',
        headers : this.headers,
        type: 'DELETE'
    }).done(function(data) {
        callback(data);
    }).fail(function() {
        callback([]); // Empty array
    });
}