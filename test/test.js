// Settings
var app = require('../app');
var request = require('supertest');
var server = request.agent(app);

var expect = require('chai').expect;
var should = require('chai').should();

// Functions
function loginUser() {
    return function(done) {
        server
            .post('/auth/login')
            .send({ email: 'ralf.h.endriks@hotmail.com', password: 'Test' })
            .expect(302)
            .expect('Location', '/')
            .end(onResponse);

        function onResponse(err, res) {
            if (err) return done(err);
            return done();
        }
    };
};

function logoutUser() {
    return function(done) {
        server
            .get('/auth/logout')
            .expect(302)
            .expect('Location', '/')
            .end(onResponse);

        function onResponse(err, res) {
            if (err) return done(err);
            return done();
        }
    };
};

// Tests
describe('Authentication', function(){
    it('Should_RedirectHome_When_Login', loginUser());

    it('Should_ResponseHtml_When_LoggedInAndOpeningRacesPage', function(done){
        server
            .get('/races')
            .set('Content-Type', 'text/html')
            .expect(200)
            .expect('Content-Type', /html/)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });

    it('Should_RedirectToSlash_When_Logout', logoutUser());


});

