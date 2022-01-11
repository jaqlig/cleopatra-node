var Visit = require('../models/visit');
var Service = require('../models/service');
var Hairdresser = require('../models/hairdresser');
var Client = require('../models/client');
var Mail = require('./emailNotifier');
const validator = require('express-validator');
const passport = require('passport');
const async = require('async');

// Display visit details | GET
exports.detail = function (req, res, next) {
    Visit.findById(req.params.id).populate('hairdresser').populate('service').populate('client').exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Visit not found');
            err.status = 404;
            return next(err);
        }
        // res.render('visit/detail', { visit: details });
        res.send({ visit: details });
    });
}

// Display list of all visits | GET
exports.list = function (req, res, next) {
    Visit.find().populate('hairdresser').populate('service').populate('client').exec(function (err, allItems) {
        if (err) {
            var err = new Error('Visit not found');
            err.status = 404;
            return next(err);
        }
        if (allItems == null) {
            var err = new Error('Not found');
            err.status = 404;
            return next(err);
        }
        // res.render('visit/list', { visit_list: allItems });
        res.send({ visit_list: allItems });
    });
}

// Create new visit | GET
exports.create_get = function (req, res, next) {
    async.parallel({
        hairdressers: function (callback) {
            Hairdresser.find(callback);
        },
        services: function (callback) {
            Service.find(callback);
        },
        clients: function (callback) {
            Client.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // res.render('visit/new', { hairdressers: results.hairdressers, services: results.services, clients: results.clients });
        res.send({ hairdressers: results.hairdressers, services: results.services, clients: results.clients });
    });
}

// Create new visit | POST
exports.create_post = [

    // Validate and sanitize fields.
    validator.body('when', 'Błąd w terminie.').not().isEmpty().trim().escape(),
    validator.body('service', 'Błędna usługa.').not().isEmpty().trim().escape(),
    validator.body('hairdresser', 'Błędny fryzjer.').not().isEmpty().trim().escape(),
    validator.body('client', 'Błędny klient.').not().isEmpty().trim().escape(),
    validator.body('notes', 'Błąd w notatkach.').trim().escape(),

    (req, res, next) => {

        const errors = validator.validationResult(req);

        Visit.findOne({'name': req.body.email}) // Check if name already exists
            .exec(function (err, visit_in_db) {
                if (err) {
                    const err = new Error('Error while searching visit in database');
                    err.status = 404;
                    return next(err);
                }

                // Reload with data if error
                if (!errors.isEmpty()) {
                    async.parallel({
                        hairdressers: function (callback) {
                            Hairdresser.find(callback);
                        },
                        services: function (callback) {
                            Service.find(callback);
                        },
                        clients: function (callback) {
                            Client.find(callback);
                        },
                    }, function (err, results) {
                        if (err) { return next(err); }
                        res.send({
                            hairdressers: results.hairdressers,
                            services: results.services,
                            clients: results.clients,
                            when: req.body.when,
                            service: req.body.service,
                            hairdresser: req.body.hairdresser,
                            client: req.body.client,
                            notes: req.body.notes,
                            errMsg: 'Popraw podane dane.',
                            errors: errors.array() });
                        // res.send({ hairdressers: results.hairdressers, services: results.services, clients: results.clients });
                    });
                    return;
                }

                // Save to db and send notification
                else {
                    const newVisit = new Visit({
                        when: req.body.when,
                        service: req.body.service,
                        hairdresser: req.body.hairdresser,
                        client: req.body.client,
                        notes: req.body.notes,
                    });


                    async.parallel({
                        hairdresser: function (callback) {
                            Hairdresser.findById(req.body.hairdresser, callback);
                        },
                        service: function (callback) {
                            Service.findById(req.body.service, callback);
                        },
                        client: function (callback) {
                            Client.findById(req.body.client, callback);
                        },
                    }, function (err, results) {
                        if (err) { return next(err); }
                        let message = 
                        'Data: ' + req.body.when + '\n' + 
                        'Usługa: ' + results.service.name + '\n' + 
                        'Fryzjer: ' + results.hairdresser.first_name + ' ' + results.hairdresser.last_name + '\n' + 
                        'Dodatkowe informacje: ' + req.body.notes;
                        Mail.sendNotification(results.client.email, message);
                    });
                    
                    newVisit.save(err => {if (err) return next(err);
                        res.send({ msg: "Nowa wizyta dodana." });
                    });                    
                }
            });
    }
];

// Display visit update form | GET
exports.update_get = function (req, res, next) {
    Visit.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Visit not found');
            err.status = 404;
            return next(err);
        }
        // res.render('visit/new', { visit: details, hairdressers: details.hairdressers, services: details.services, clients: details.clients });
        res.send({ visit: details, hairdressers: details.hairdressers, services: details.services, clients: details.clients });
        });
}

exports.update_get = function (req, res, next) {
    async.parallel({
        visit: function (callback) {
            Visit.findById(req.params.id, callback);
        },
        hairdressers: function (callback) {
            Hairdresser.find(callback);
        },
        services: function (callback) {
            Service.find(callback);
        },
        clients: function (callback) {
            Client.find(callback);
        },
    }, function (err, details) {
        if (err) { return next(err); }
        if (details == null) {
            var err = new Error('Visit not found');
            err.status = 404;
            return next(err);
        }
        // res.render('visit/new', { visit: details.visit, hairdressers: details.hairdressers, services: details.services, clients: details.clients });
        res.send({ visit: details.visit, hairdressers: details.hairdressers, services: details.services, clients: details.clients });
    });
}

// Handle visit update | POST
exports.update_post = [

    // Validate and sanitize fields.
    validator.body('when', 'Błąd w terminie.').not().isEmpty().trim().escape(),
    validator.body('service', 'Błędna usługa.').not().isEmpty().trim().escape(),
    validator.body('hairdresser', 'Błędny fryzjer.').not().isEmpty().trim().escape(),
    validator.body('client', 'Błędny klient.').not().isEmpty().trim().escape(),
    validator.body('notes', 'Błąd w notatkach.').not().isEmpty().trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        const errors = validator.validationResult(req);

        // Reload with data if error
        if (!errors.isEmpty()) {
            async.parallel({
                hairdressers: function (callback) {
                    Hairdresser.find(callback);
                },
                services: function (callback) {
                    Service.find(callback);
                },
                clients: function (callback) {
                    Client.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }
                res.send({
                    hairdressers: results.hairdressers,
                    services: results.services,
                    clients: results.clients,
                    when: req.body.when,
                    service: req.body.service,
                    hairdresser: req.body.hairdresser,
                    client: req.body.client,
                    notes: req.body.notes,
                    errMsg: 'Popraw podane dane.',
                    errors: errors.array() });
            });
            return;
        }

        // Update in db
        else {
            const newVisit = new Visit({
                when: req.body.when,
                service: req.body.service,
                hairdresser: req.body.hairdresser,
                client: req.body.client,
                notes: req.body.notes,
                _id: req.params.id
            })

            async.parallel({
                hairdresser: function (callback) {
                    Hairdresser.findById(req.body.hairdresser, callback);
                },
                service: function (callback) {
                    Service.findById(req.body.service, callback);
                },
                client: function (callback) {
                    Client.findById(req.body.client, callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }
                let message = 
                'Data: ' + req.body.when + '\n' + 
                'Usługa: ' + results.service.name + '\n' + 
                'Fryzjer: ' + results.hairdresser.first_name + ' ' + results.hairdresser.last_name + '\n' + 
                'Dodatkowe informacje: ' + req.body.notes;
                Mail.sendNotification(results.client.email, message);
            });

            Visit.findByIdAndUpdate(req.params.id, newVisit, {}, function (err, visit) {
                if (err) { return next(err); }
                res.redirect(visit.url);
            });
        }
    }
];

// Display visit delete form | GET (Needed for react, as we populate IDs from database)
exports.delete_get = function (req, res) {
    Visit.findById(req.params.id).populate('hairdresser').populate('service').populate('client').exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Visit not found');
            err.status = 404;
            return next(err);
        }
        res.render('visit/delete', { visit: details });
    });
};

// Handle visit delete | POST
exports.delete_post = function (req, res) {
    Visit.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Visit not found');
            err.status = 404;
            return next(err);
        }
        Visit.findByIdAndRemove(req.body.visitid, function deleteItem(err) {
            if (err) { return next(err); }
            res.redirect('/')
        })
    });
};
