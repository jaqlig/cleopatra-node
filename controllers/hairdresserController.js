var Hairdresser = require('../models/hairdresser');
const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Display hairdresser details | GET
exports.detail = function (req, res, next) {
    Hairdresser.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Hairdresser not found');
            err.status = 404;
            return next(err);
        }
        res.render('hairdresser/detail', { hairdresser: details });
        // res.send({ hairdresser: details });
    });
}

// Display list of all hairdressers | GET
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
        res.render('hairdresser/list', { hairdresser_list: allItems });
        // res.send({ hairdresser_list: allItems });
    });
}


// Create new hairdresser account | POST
exports.create_post = [

    // Validate and sanitize fields.
    validator.body('first_name', 'first_name must not be empty.').not().isEmpty().trim().escape(),
    validator.body('last_name', 'last_name must not be empty.').not().isEmpty().trim().escape(),
    validator.body('birth', 'birth must not be empty.').not().isEmpty().trim().escape(),
    validator.body('phone_number', 'Błędny numer telefonu.').not().isEmpty().trim().escape(),
    validator.body('email', 'Błędny email.').isEmail().normalizeEmail(),
    validator.body('password', 'Hasło musi mieć 8 znaków.').trim().isLength({ min: 8}).escape(),
    validator.body('passwordConfirmation', 'Hasło w obu polach musi być takie samo.').exists().custom((value, { req }) => value === req.body.password),
    validator.body('notes', 'Błąd w notatkach.').not().isEmpty().trim().escape(),

    (req, res, next) => {

        const errors = validator.validationResult(req);

        Hairdresser.findOne({'email': req.body.email}) // Check if mail already exists
            .exec(function (err, user_in_db) {
                if (err) {
                    const err = new Error('Error while searching username in database');
                    err.status = 404;
                    return next(err);
                }
                if (user_in_db == null) { //Mail doesnt exist in database

                    // Reload with data if error
                    if (!errors.isEmpty()) {
                        res.render('new_hairdresser', {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            birth: req.body.birth,
                            phone_number: req.body.phone_number,
                            email: req.body.email,
                            notes: req.body.notes,
                            errMsg: 'Popraw podane dane.',
                            errors: errors.array()
                        });
                        return;
                    }

                    // Save to db
                    else {
                        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                            if (err) return next(err);
                            let today = new Date().toLocaleString();
                            const newHairdresser = new Hairdresser({
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                birth: req.body.birth,
                                phone_number: req.body.phone_number,
                                email: req.body.email,
                                password: hashedPassword,
                                employment_date: today,
                                notes: req.body.notes,
                            }).save(err => {
                                if (err) return next(err);
                                res.render('index', { msg: "Konto utworzone poprawnie, możesz się zalogować." });
                            });
                        });
                    }

                }
                else {
                    res.render('hairdresser/new', {
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

// Display hairdresser update form | GET
exports.update_get = function (req, res, next) {
    Hairdresser.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Hairdresser not found');
            err.status = 404;
            return next(err);
        }
        res.render('hairdresser/new', { hairdresser: details });
        // res.send({ hairdresser: details });
        });
}

// Handle hairdresser update | POST
exports.update_post = [

    // Validate and sanitize fields.
    validator.body('first_name', 'first_name must not be empty.').not().isEmpty().trim().escape(),
    validator.body('last_name', 'last_name must not be empty.').not().isEmpty().trim().escape(),
    validator.body('birth', 'birth must not be empty.').not().isEmpty().trim().escape(),
    validator.body('phone_number', 'Błędny numer telefonu.').not().isEmpty().trim().escape(),
    validator.body('email', 'Błędny email.').isEmail().normalizeEmail(),
    validator.body('password', 'Hasło musi mieć 8 znaków.').trim().isLength({ min: 8}).escape(),
    validator.body('passwordConfirmation', 'Hasło w obu polach musi być takie samo.').exists().custom((value, { req }) => value === req.body.password),
    validator.body('notes', 'Błąd w notatkach.').not().isEmpty().trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        const errors = validator.validationResult(req);

        // Reload with data if error
        if (!errors.isEmpty()) {
            res.render('new_hairdresser', {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                birth: req.body.birth,
                phone_number: req.body.phone_number,
                email: req.body.email,
                notes: req.body.notes,
                errMsg: 'Popraw podane dane.',
                errors: errors.array()
            });
            return;
        }

        // Update in db
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
                    notes: req.body.notes,
                    _id: req.params.id
                })
                Hairdresser.findByIdAndUpdate(req.params.id, newHairdresser, {}, function (err, thehaidresser) {
                    if (err) { return next(err); }
                    res.redirect(thehaidresser.url);
                });
            });
        }
    }
];

// Display hairdresser delete form | GET (Debugging only, not need for React)
exports.delete_get = function (req, res) {
    Hairdresser.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Hairdresser not found');
            err.status = 404;
            return next(err);
        }
        res.render('hairdresser/delete', { hairdresser: details });
    });
};

// Handle hairdresser delete | POST
exports.delete_post = function (req, res) {
    Hairdresser.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Hairdresser not found');
            err.status = 404;
            return next(err);
        }
        Hairdresser.findByIdAndRemove(req.body.hairdresserid, function deleteItem(err) {
            if (err) { return next(err); }
            res.redirect('/')
        })
    });
};
