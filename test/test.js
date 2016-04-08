var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passport = require('passport');
var winston = require('winston');
var config = require('../config')();

var app = require('express')();
var User = require('../models/user')(mongoose,bcrypt);
var Race = require('../models/race')(mongoose);

var routes = require('../routes/index')(passport);
var races = require('../routes/race')(Race);
var users = require('../routes/users')(User);

app.use('/', routes);
app.use('/races',races);
app.use('/users', users);


describe('Routing', function() {

    before(function(done) {
        // In our tests we use the test db
        mongoose.connect(config.mlab.host);
        done();
    });

    describe('GET /race', function() {
        it('respond with json', function(done) {
            request(app)
                .get('/race')
                .set('Accept', 'application/json')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });
        /*it('should return error trying to save duplicate username', function(done) {
            var profile = {
                username: 'vgheri',
                password: 'test',
                firstName: 'Valerio',
                lastName: 'Gheri'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to
            // POST on /api/profiles and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post('/api/profiles')
                .send(profile)
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.should.have.status(400);
                    done();
                });
        });
        it('should correctly update an existing account', function(done){
            var body = {
                firstName: 'JP',
                lastName: 'Berd'
            };
            request(url)
                .put('/api/profiles/vgheri')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    // Should.js fluent syntax applied
                    res.body.should.have.property('_id');
                    res.body.firstName.should.equal('JP');
                    res.body.lastName.should.equal('Berd');
                    res.body.creationDate.should.not.equal(null);
                    done();
                });
        });*/
    });
});