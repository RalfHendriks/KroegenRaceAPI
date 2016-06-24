// Settings
var app = require('../app');
var request = require('supertest');
var server = request.agent(app);

// Functions
function loginUser() {
    return function(done) {
        server
            .post('/login')
            .send({ email: 'ralf.h.endriks@hotmail.com', password: 'Test' })
            .expect(302)
            .expect('Location', '/home')
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
            .get('/logout')
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
            .set('Accept', 'text/html')
            .expect(200)
            .expect('Content-Type', /html/)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });

    it('Should_RedirectToSlash_When_Logout', logoutUser());

    it('Should_ResponseJson_When_LoggedOutAndOpeningRacesPage', function(done){
        server
            .get('/races')
            .set('Accept', 'text/html')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });
});

describe('Routing', function(){
    it('Should_ReturnOK_When_OpeningRaces', function(done){
        server
            .get('/races')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });

    it('Should_ReturnOK_When_OpeningSingleRace', function(done){
        server
            .get('/races/fakeid')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);
                done(res)
            });
    });


});


