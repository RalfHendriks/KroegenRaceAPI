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
            .set('Content-Type', 'text/html')
            .expect(200)
            .expect('Content-Type', /html/)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });

    /*it('Should_Redirect_When_LoggedInAndOpeningLoginPage', function(done){
        server
            .get('/login')
            .set('Content-Type', 'text/html')
            .expect(200)
            .expect('Content-Type', /html/)
            .end(function(err, res){
                if (err) return done(err);

                console.log(res);

                done()
            });
    });*/

    it('Should_RedirectToSlash_When_Logout', logoutUser());

    it('Should_ResponseJson_When_LoggedOutAndOpeningRacesPage', function(done){
        server
            .get('/races')
            .set('Content-Type', 'text/html')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.equal('Permission denied!');
                done()
            });
    });
});

describe('Routing', function(){
    it('Should_ReturnRaces_When_OpeningRaces', function(done){
        server
            .get('/races')
            .set('Content-Type','application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body[0]).to.not.be.undefined;
                expect(res.body[0]).to.have.property('_id');
                done()
            });
    });

    it('Should_ReturnRace_When_OpeningSingleRace', function(done){

        server
            .get('/races/576be0926b8cf8f03e1a1703')
            .set('Content-Type','application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.have.property('_id');
                expect(res.body._id).to.be.a('String');
                expect(res.body.name).to.not.be.empty;
                done()
            });
    });

    it('Should_ReturnRaceParticipants_When_OpeningSingleRaceParticipants', function(done){

        server
            .get('/races/576be0926b8cf8f03e1a1703/participants')
            .set('Content-Type','application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.not.be.empty;
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]._id).to.be.a('String');
                done()
            });
    });

    it('Should_ReturnRaceBars_When_OpeningSingleRaceBars', function(done){

        server
            .get('/races/576be0926b8cf8f03e1a1703/bars')
            .set('Content-Type','application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.not.be.empty;
                expect(res.body[0].bar).to.have.property('_id');
                expect(res.body[0].bar.location).to.not.be.empty;

                done()
            });
    });

});

describe('Races', function(){

    it('Should_ReturnRaceBars_When_AddingRaceWithVisited', function(done){

        var body = {
            name: 'Test Race With Bar',
            created_at: new Date(),
            updated_at: new Date(),
            raceLeader: '570716cfc781a99b654768b3',
            participants: [
                '570716cfc781a99b654768b3'
            ],
            bars: [
                {
                    bar: {
                        "available": true,
                        "google_id": "ChIJT0XDHMArx0cRe3_pxnWu5G4",
                        "name": "Café Zaal De Bellevue",
                        "_id": "576bac4a6feb96a02f47c20c",
                        "ratings": [],
                        "location": {
                            "long": 5.581622299999998,
                            "lat": 51.2778522,
                            "address": {
                                "city": " Budel",
                                "street": "Maarheezerweg 1"
                            }
                        }
                    },
                    visited: false
                }
            ]
        };

        server
            .post('/races')
            .send(body)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.not.be.empty;
                expect(res.body).to.have.property('_id');

                done()
            });
    });

    it('Should_ReturnRaceBars_When_AddingRaceWithoutVisited', function(done){

        var body = {
            name: 'Test Race Without Bars',
            created_at: new Date(),
            updated_at: new Date(),
            raceLeader: '570716cfc781a99b654768b3',
            participants: [
                '570716cfc781a99b654768b3'
            ],
            bars: [
                {
                    "available": true,
                    "google_id": "ChIJT0XDHMArx0cRe3_pxnWu5G4",
                    "name": "Café Zaal De Bellevue",
                    "_id": "576bac4a6feb96a02f47c20c",
                    "ratings": [],
                    "location": {
                        "long": 5.581622299999998,
                        "lat": 51.2778522,
                        "address": {
                            "city": " Budel",
                            "street": "Maarheezerweg 1"
                        }
                    }
                }
            ]
        };

        server
            .post('/races')
            .send(body)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.not.be.empty;
                expect(res.body).to.have.property('_id');

                done()
            });
    });

    it('Should_ReturnTrue_When_RemovingRaceParticipant', function(done){

        server
            .del('/races/576be0926b8cf8f03e1a1703/participants/570716cfc781a99b654768b3')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.equal('Participant removed.');

                done()
            });
    });

    it('Should_ReturnTrue_When_AddingRaceParticipant', function(done){

        var body = {
            users: ["570716cfc781a99b654768b3"]
        };

        server
            .post('/races/576be0926b8cf8f03e1a1703/participants')
            .send(body)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.equal('Participants added.');

                done()
            });
    });

    it('Should_ReturnTrue_When_RemovingRaceBar', function(done){

        server
            .del('/races/576be0926b8cf8f03e1a1703/bars/576bac4a6feb96a02f47c20c')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.equal('Bar removed.');

                done()
            });
    });


    it('Should_ReturnTrue_When_AddingRaceBar', function(done){

        var body = {
            bars: [
                {
                    "available": true,
                    "google_id": "ChIJT0XDHMArx0cRe3_pxnWu5G4",
                    "name": "Café Zaal De Bellevue",
                    "_id": "576bac4a6feb96a02f47c20c",
                    "ratings": [],
                    "location": {
                        "long": 5.581622299999998,
                        "lat": 51.2778522,
                        "address": {
                            "city": " Budel",
                            "street": "Maarheezerweg 1"
                        }
                    }
                }
            ]
        };

        server
            .post('/races/576be0926b8cf8f03e1a1703/bars')
            .send(body)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);

                expect(res.body).to.equal('Bars added.');

                done()
            });
    });



});

