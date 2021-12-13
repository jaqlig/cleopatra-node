const { nextTick } = require('async');
var Hairdresser = require('../models/hairdresser');
var async = require('async');
const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Display hairdresser details
exports.detail = function (req, res, next) {
    Hairdresser.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Hairdresser not found');
            err.status = 404;
            return next(err);
        }
        res.render('hairdresser_detail', { hairdresser: details });
        // res.send({ hairdresser: details });
        });       
}

// Display list of all hairdressers
exports.list = function (req, res, next) {
    Hairdresser.find().exec(function (err, allItems) {
        if (err) {
            var err = new Error('Hairdresser not found');
            err.status = 404;
            return next(err);
        }
        if (allItems == null) {
            var err = new Error('Not found');
            err.status = 404;
            return next(err);
        }
        // res.send({ hairdresser_list: allItems });
        res.render('hairdressers', { hairdresser_list: allItems });
    });
}


// Create new hairdresser account
exports.hairdresser_create_post = [

    // Validate fields.
    validator.body('first_name', 'first_name must not be empty.').trim().isLength({ min: 1 }),
    validator.body('last_name', 'last_name must not be empty.').trim().isLength({ min: 1 }),
    validator.body('birth', 'birth must not be empty.').trim().isLength({ min: 1 }),
    validator.body('phone_number', 'phone_number must not be empty.').trim().isLength({ min: 9}),
    validator.body('email', 'email must not be empty.').trim().isLength({ min: 5 }),
    validator.body('password', 'password must not be empty.').exists().isLength({ min: 8}),
    validator.body('passwordConfirmation').exists().custom((value, { req }) => value === req.body.password),

    // Sanitize fields
    validator.sanitizeBody('first_name').escape(),
    validator.sanitizeBody('last_name').escape(),
    validator.sanitizeBody('birth').escape(),
    validator.sanitizeBody('phone_number').escape(),
    validator.sanitizeBody('email').escape(),
    validator.sanitizeBody('password').escape(),

    (req, res, next) => {

        const errors = validator.validationResult(req);

        Hairdresser.findOne({'email': req.body.email})
            .exec(function (err, user_in_db) {
                if (err) {
                    const err = new Error('Error while searching username in database');
                    err.status = 404;
                    return next(err);
                }
                if (user_in_db == null) {

                    // Reload with data if error
                    if (!errors.isEmpty()) {
                        res.render('new_hairdresser', {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            birth: req.body.birth,
                            phone_number: req.body.phone_number,
                            email: req.body.email,
                            errMsg: 'Popraw podane dane.',
                            errors: errors.array()
                        });
                        return;
                    }

                    // Save to db
                    else {
                        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                            if (err) return next(err);

                            const newHairdresser = new Hairdresser({
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                birth: req.body.birth,
                                phone_number: req.body.phone_number,
                                email: req.body.email,
                                password: hashedPassword,
                                // employment_date: today,
                                notes: ""
                            }).save(err => {
                                if (err) return next(err);
                                res.render('index', { msg: "Konto utworzone poprawnie, możesz się zalogować." });
                            });
                        });
                    }

                }
                else {
                    res.render('new_hairdresser', {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        birth: req.body.birth,
                        phone_number: req.body.phone_number,
                        email: req.body.email,
                        errMsg: "Taki użytkownik już istnieje",
                        errors: errors.array()
                    });
                    return;        
                }
            });
    }
];