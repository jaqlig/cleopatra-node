var Client = require('../models/client');
const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Display client details | GET
exports.detail = function (req, res, next) {
    Client.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Client not found');
            err.status = 404;
            return next(err);
        }
        res.render('client/detail', { client: details });
        // res.send({ client: details });
    });
}

// Display list of all clients | GET
exports.list = function (req, res, next) {
    Client.find().exec(function (err, allItems) {
        if (err) {
            var err = new Error('Client not found');
            err.status = 404;
            return next(err);
        }
        if (allItems == null) {
            var err = new Error('Not found');
            err.status = 404;
            return next(err);
        }
        res.render('client/list', { client_list: allItems });
        // res.send({ client_list: allItems });
    });
}


// Create new client account | POST
exports.create_post = [

    // Validate and sanitize fields.
    validator.body('first_name', 'Błąd w imieniu.').not().isEmpty().trim().escape(),
    validator.body('last_name', 'Błąd w nazwisku.').not().isEmpty().trim().escape(),
    validator.body('phone_number', 'Błędny numer telefonu.').not().isEmpty().trim().escape(),
    validator.body('email', 'Błędny email.').isEmail().normalizeEmail(),
    validator.body('password', 'Hasło musi mieć 8 znaków.').trim().isLength({ min: 8}).escape(),
    validator.body('passwordConfirmation', 'Hasło w obu polach musi być takie samo.').exists().custom((value, { req }) => value === req.body.password),
    validator.body('gender').not().isEmpty().trim().escape(),
    validator.body('hair_length', 'Błąd w długości włosów.').trim().escape(),
    validator.body('hair_type', 'Błąd w rodzaju włosów.').trim().escape(),
    validator.body('loyalty_points', 'Błąd ilości punktów.').trim().escape(),
    validator.body('notes', 'Błąd w notatkach.').trim().escape(),

    (req, res, next) => {

        const errors = validator.validationResult(req);

        Client.findOne({'email': req.body.email}) // Check if mail already exists
            .exec(function (err, user_in_db) {
                if (err) {
                    const err = new Error('Error while searching username in database');
                    err.status = 404;
                    return next(err);
                }
                if (user_in_db == null) { //Mail doesnt exist in database

                    // Reload with data if error
                    if (!errors.isEmpty()) {
                        res.render('client/new', {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            phone_number: req.body.phone_number,
                            email: req.body.email,
                            gender: req.body.gender,
                            hair_length: req.body.hair_length,
                            hair_type: req.body.hair_type,
                            loyalty_points: req.body.loyalty_points,
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
                            const newClient = new Client({
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                phone_number: req.body.phone_number,
                                email: req.body.email,
                                password: hashedPassword,
                                gender: req.body.gender,
                                hair_length: req.body.hair_length,
                                hair_type: req.body.hair_type,
                                registration_date: today,
                                loyalty_points: req.body.loyalty_points,
                                notes: req.body.notes,
                            }).save(err => {
                                if (err) return next(err);
                                res.render('index', { msg: "Nowy klient dodany." });
                            });
                        });
                    }

                }
                else {
                    res.render('client/new', {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        phone_number: req.body.phone_number,
                        email: req.body.email,
                        gender: req.body.gender,
                        hair_length: req.body.hair_length,
                        hair_type: req.body.hair_type,
                        loyalty_points: req.body.loyalty_points,
                        notes: req.body.notes,
                        errMsg: "Taki użytkownik już istnieje",
                        errors: errors.array()
                    });
                    return;        
                }
            });
    }
];

// Display client update form | GET
exports.update_get = function (req, res, next) {
    Client.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Client not found');
            err.status = 404;
            return next(err);
        }
        res.render('client/new', { client: details });
        // res.send({ client: details });
        });
}

// Handle client update | POST
exports.update_post = [

    // Validate and sanitize fields.
    validator.body('first_name', 'Błąd w imieniu.').not().isEmpty().trim().escape(),
    validator.body('last_name', 'Błąd w nazwisku.').not().isEmpty().trim().escape(),
    validator.body('phone_number', 'Błędny numer telefonu.').not().isEmpty().trim().escape(),
    validator.body('email', 'Błędny email.').isEmail().normalizeEmail(),
    validator.body('password', 'Hasło musi mieć 8 znaków.').trim().isLength({ min: 8}).escape(),
    validator.body('passwordConfirmation', 'Hasło w obu polach musi być takie samo.').exists().custom((value, { req }) => value === req.body.password),
    validator.body('gender').not().isEmpty().trim().escape(),
    validator.body('hair_length', 'Błąd w długości włosów.').trim().escape(),
    validator.body('hair_type', 'Błąd w rodzaju włosów.').trim().escape(),
    validator.body('loyalty_points', 'Błąd ilości punktów.').trim().escape(),
    validator.body('notes', 'Błąd w notatkach.').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        const errors = validator.validationResult(req);

        // Reload with data if error
        if (!errors.isEmpty()) {
            res.render('new_client', {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone_number: req.body.phone_number,
                email: req.body.email,
                gender: req.body.gender,
                hair_length: req.body.hair_length,
                hair_type: req.body.hair_type,
                loyalty_points: req.body.loyalty_points,
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
                const newClient = new Client({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone_number: req.body.phone_number,
                    email: req.body.email,
                    password: {type: String, required: true},
                    gender: req.body.gender,
                    hair_length: req.body.hair_length,
                    hair_type: req.body.hair_type,
                    loyalty_points: req.body.loyalty_points,
                    notes: req.body.notes,
                    _id: req.params.id
                })
                Client.findByIdAndUpdate(req.params.id, newClient, {}, function (err, theclient) {
                    if (err) { return next(err); }
                    res.redirect(theclient.url);
                });
            });
        }
    }
];

// Display client delete form | GET (Debugging only, not need for React)
exports.delete_get = function (req, res) {
    Client.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Client not found');
            err.status = 404;
            return next(err);
        }
        res.render('client/delete', { client: details });
    });
};

// Handle client delete | POST
exports.delete_post = function (req, res) {
    Client.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Client not found');
            err.status = 404;
            return next(err);
        }
        Client.findByIdAndRemove(req.body.clientid, function deleteItem(err) {
            if (err) { return next(err); }
            res.redirect('/')
        })
    });
};
