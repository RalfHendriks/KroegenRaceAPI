// Init 'models/controllers'
var Race = new Race();
var User = new User();

var userList = [];


$(function() {

    User.getUsers(1, getUsersCallback);
    Race.getRaces(1, getRacesCallback);

    $('#race-pagination').on('click', 'a', function(e) {
        e.preventDefault();

        var page = $(this).attr('data-page');
        Race.getRaces(page, getRacesCallback);
    });

    $('#raceAddModal').on('show.bs.modal', function (event) {
        var modal = $(this);

        var option = '';
        modal.find('select#raceleader').empty();
        for(var i = 0; i < userList.length; i++) {
            option = '<option value="' + userList[i].key + '">' + userList[i].value + '</option>';
            modal.find('select#raceleader').append(option);
        }
    });

    $('#raceEditModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        var button = $(event.relatedTarget);
        var name = button.data('name');
        var id = button.data('id');

        modal.find('.race-name').text(name);
        Race.selectedItemID = id;
        Race.getRace(Race.selectedItemID, getRaceCallback);
    });

    $('#raceEditModal').on('click', '#raceEditConfirm', function() {
        var form = $('#raceEditForm');
        var formData = {
            name : form.find('#name').val(),
            raceleader : form.find('#raceleader').val()
        };
        Race.updateRace(Race.selectedItemID, formData, updateRaceCallback);
    });

    $('#raceParticipantsModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        var button = $(event.relatedTarget);
        var name = button.data('name');
        var id = button.data('id');

        modal.find('.race-name').text(name);
        Race.selectedItemID = id;
        Race.getParticipants(Race.selectedItemID, getParticipantsCallback);
    });

    $('#raceParticipantsModal').on('click', '#raceParticipantsConfirm', function() {
        var form = $('#raceParticipantsForm');
        var formData = form.find('#participants').val();
        console.log(formData);
        Race.updateParticipants(Race.selectedItemID, formData, updateParticipantsCallback);
    });

    $('#raceDeleteModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        var button = $(event.relatedTarget);
        var name = button.data('name');
        var id = button.data('id');

        modal.find('.race-name').text(name);
        Race.selectedItemID = id;
    });

    $('#raceDeleteModal').on('click', '#raceDeleteConfirm', function() {
        var modal = $(this);
        Race.deleteRace(Race.selectedItemID, deleteRaceCallback);
    });

    $('#userEditModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        var button = $(event.relatedTarget);
        var name = button.data('name');
        var id = button.data('id');

        modal.find('.user-name').text(name);
        User.selectedItemID = id;
        User.getUser(User.selectedItemID, getUserCallback);
    });

    $('#userEditModal').on('click', '#userEditConfirm', function() {
        var form = $('#userEditForm');
        var formData = {
            name : form.find('#name').val(),
            role : form.find('#role').val()
        };
        User.updateUser(User.selectedItemID, formData, updateUserCallback);
    });


});

function getRacesCallback(races) {
    // Empty list and pagination
    $('#race-data').empty();
    $('#race-pagination').empty();

    var editBtn = '';
    var participantsBtn = '';
    var barsBtn = '';
    var deleteBtn = '';

    for(var i = 0; i < races.length; i++) {
        editBtn         = '<a data-toggle="modal" data-target="#raceEditModal" data-name="' + races[i].name + '" data-id="' + races[i]._id + '" class="btn btn-default btn-xs" href="#" role="button"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
        participantsBtn = '<a data-toggle="modal" data-target="#raceParticipantsModal" data-name="' + races[i].name + '" data-id="' + races[i]._id + '" class="btn btn-default btn-xs" href="#" role="button"><span class="glyphicon glyphicon-user" aria-hidden="true"></span></a>';
        barsBtn         = '<a data-toggle="modal" data-target="#raceBarsModal" data-name="' + races[i].name + '" data-id="' + races[i]._id + '" class="btn btn-default btn-xs" href="#" role="button"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></a>';
        deleteBtn       = '<a data-toggle="modal" data-target="#raceDeleteModal" data-name="' + races[i].name + '" data-id="' + races[i]._id + '" class="btn btn-danger btn-xs" href="#" role="button"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';

        $('#race-data').append('<div class="list-group-item">' + races[i].name + '<div class="btn-group pull-right" role="group" aria-label="...">' + editBtn + participantsBtn + barsBtn + deleteBtn + '</div></div>');
    }

    for(var i = 1; i <= Race.totalPages; i++) {
        var btnClass = (Race.currentPage === i) ? 'btn-primary' : 'btn-default';
        $('#race-pagination').append('<a data-page="' + i + '" class="btn-group btn ' + btnClass + '" role="group" href="#">' + i + '</a>');
    }
}

function getRaceCallback(race) {
    // Set modal form values
    var modal = $('#raceEditModal');
    modal.find('input#name').val(race.name);

    var option = '';
    var selected = '';
    modal.find('select#raceleader').empty();
    for(var i = 0; i < userList.length; i++) {
        selected = userList[i].key === race.raceleader._id ? 'selected' : '';
        option = '<option value="' + userList[i].key + '" ' + selected + '>' + userList[i].value + '</option>';
        modal.find('select#raceleader').append(option);
    }
}

function updateRaceCallback(data) {
    $('#raceEditModal').modal('hide');
    console.log(data);
    Race.getRaces(Race.currentPage, getRacesCallback);
}

function deleteRaceCallback(data) {
    if(data.hasOwnProperty('status') && data.status === 'OK') {
        $('#raceDeleteModal').modal('hide');
        Race.getRaces(Race.currentPage, getRacesCallback);
    } else {
        alert('Oops, something went wrong.');
    }
}

function updateParticipantsCallback(data) {
    $('#raceParticipantsModal').modal('hide');
    Race.getRaces(Race.currentPage, getRacesCallback);
}

function getParticipantsCallback(data) {
    var modal = $('#raceParticipantsModal');

    console.log(data);

    var option = '';
    var selected = '';
    modal.find('select#participants').empty();

    // Loop through (global) userlist
    for(var i = 0; i < userList.length; i++) {

        // Loop through participants
        for(var j = 0; j < data.length; j++) {
            selected = (data.map(function(e) { return e._id; }).indexOf(userList[i].key) != -1 ? 'selected' : '');
        }

        option = '<option value="' + userList[i].key + '" ' + selected + '>' + userList[i].value + '</option>';
        modal.find('select#participants').append(option);
    }
}

function getUsersCallback(users) {
    parseUserList(users);

    // Empty list and pagination
    $('#user-data').empty();
    $('#user-pagination').empty();

    var editBtn = '';

    for(var i = 0; i < users.length; i++) {
        editBtn = '<a data-toggle="modal" data-target="#userEditModal" data-name="' + users[i].name + '" data-id="' + users[i]._id + '" class="btn btn-default btn-xs" href="#" role="button"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';

        $('#user-data').append('<div class="list-group-item">' + users[i].name + '<div class="btn-group pull-right" role="group" aria-label="...">' + editBtn + '</div></div>');
    }

    for(var i = 1; i <= User.totalPages; i++) {
        var btnClass = (User.currentPage === i) ? 'btn-primary' : 'btn-default';
        $('#user-pagination').append('<a data-page="' + i + '" class="btn-group btn ' + btnClass + '" role="group" href="#">' + i + '</a>');
    }
}

function getUserCallback(user) {
    // Set modal form values
    var modal = $('#userEditModal');
    modal.find('input#name').val(user.name);

    var option = '';
    var selected = '';
    modal.find('select#role').empty();

    // Set user option
    selected = user.role === 'user' ? 'selected' : '';
    option = '<option value="user" ' + selected + '>User</option>';
    modal.find('select#role').append(option);

    // Set admin option
    selected = user.role === 'admin' ? 'selected' : '';
    option = '<option value="admin" ' + selected + '>Admin</option>';
    modal.find('select#role').append(option);
}

function updateUserCallback(data) {
    $('#userEditModal').modal('hide');
    User.getUsers(User.currentPage, getUsersCallback);
}

function parseUserList(users) {
    userList = [];

    for(var i = 0; i < users.length; i++) {
        userList[i] = {
            key: users[i]._id,
            value: users[i].name
        }
    }
}