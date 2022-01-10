var Service = require('../models/service');
const validator = require('express-validator');
const passport = require('passport');

// Display service details | GET
exports.detail = function (req, res, next) {
    Service.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Service not found');
            err.status = 404;
            return next(err);
        }
        res.render('service/detail', { service: details });
        // res.send({ service: details });
    });
}

// Display list of all services | GET
exports.list = function (req, res, next) {
    Service.find().exec(function (err, allItems) {
        if (err) {
            var err = new Error('Service not found');
            err.status = 404;
            return next(err);
        }
        if (allItems == null) {
            var err = new Error('Not found');
            err.status = 404;
            return next(err);
        }
        res.render('service/list', { service_list: allItems });
        // res.send({ service_list: allItems });
    });
}


// Create new service | POST
exports.create_post = [

    // Validate and sanitize fields.
    validator.body('name', 'Błąd w nazwie.').not().isEmpty().trim().escape(),
    validator.body('gender', 'Błąd w wybranej płci.').not().isEmpty().trim().escape(),
    validator.body('approx_time', 'Błędny czas.').not().isEmpty().trim().escape(),
    validator.body('price', 'Błędna cena.').not().isEmpty().trim().escape(),
    validator.body('notes', 'Błąd w notatkach.').trim().escape(),

    (req, res, next) => {

        const errors = validator.validationResult(req);

        Service.findOne({'name': req.body.email}) // Check if name already exists
            .exec(function (err, service_in_db) {
                if (err) {
                    const err = new Error('Error while searching service in database');
                    err.status = 404;
                    return next(err);
                }
                if (service_in_db == null) { //Service doesnt exist in database

                    // Reload with data if error
                    if (!errors.isEmpty()) {
                        res.render('service/new', {
                            name: req.body.name,
                            gender: req.body.gender,
                            approx_time: req.body.approx_time,
                            price: req.body.price,
                            notes: req.body.notes,
                            errMsg: 'Popraw podane dane.',
                            errors: errors.array()
                        });
                        return;
                    }

                    // Save to db
                    else {
                        const newService = new Service({
                            name: req.body.name,
                            gender: req.body.gender,
                            approx_time: req.body.approx_time,
                            price: req.body.price,
                            notes: req.body.notes,
                        }).save(err => {
                            if (err) return next(err);
                            res.render('index', { msg: "Nowa usługa dodana." });
                        });
                        
                    }

                }
                else {
                    res.render('service/new', {
                        name: req.body.name,
                        gender: req.body.gender,
                        approx_time: req.body.approx_time,
                        price: req.body.price,
                        errMsg: "Usługa o takiej nazwie już istnieje",
                        errors: errors.array()
                    });
                    return;        
                }
            });
    }
];

// Display service update form | GET
exports.update_get = function (req, res, next) {
    Service.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Service not found');
            err.status = 404;
            return next(err);
        }
        res.render('service/new', { service: details });
        // res.send({ service: details });
        });
}

// Handle service update | POST
exports.update_post = [

    // Validate and sanitize fields.
    validator.body('name', 'Błąd w nazwie.').not().isEmpty().trim().escape(),
    validator.body('gender', 'Błąd w wybranej płci.').not().isEmpty().trim().escape(),
    validator.body('approx_time', 'Błędny czas.').not().isEmpty().trim().escape(),
    validator.body('price', 'Błędna cena.').not().isEmpty().trim().escape(),
    validator.body('notes', 'Błąd w notatkach.').not().isEmpty().trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        const errors = validator.validationResult(req);

        // Reload with data if error
        if (!errors.isEmpty()) {
            res.render('service', {
                name: req.body.name,
                gender: req.body.gender,
                approx_time: req.body.approx_time,
                price: req.body.price,
                notes: req.body.notes,
                errMsg: 'Popraw podane dane.',
                errors: errors.array()
            });
            return;
        }

        // Update in db
        else {
            const newService = new Service({
                name: req.body.name,
                gender: req.body.gender,
                approx_time: req.body.approx_time,
                price: req.body.price,
                notes: req.body.notes,
                _id: req.params.id
            })
            Service.findByIdAndUpdate(req.params.id, newService, {}, function (err, service) {
                if (err) { return next(err); }
                res.redirect(service.url);
            });
        }
    }
];

// Display service delete form | GET (Debugging only, not need for React)
exports.delete_get = function (req, res) {
    Service.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Service not found');
            err.status = 404;
            return next(err);
        }
        res.render('service/delete', { service: details });
    });
};

// Handle service delete | POST
exports.delete_post = function (req, res) {
    Service.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Service not found');
            err.status = 404;
            return next(err);
        }
        Service.findByIdAndRemove(req.body.serviceid, function deleteItem(err) {
            if (err) { return next(err); }
            res.redirect('/')
        })
    });
};
