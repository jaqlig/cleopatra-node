const { nextTick } = require('async');
var Hairdresser = require('../models/hairdresser');
var async = require('async');
// const validator = require('express-validator');
// const { body, validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

// Display hairdresser details
exports.detail = function (req, res, next) {
    Hairdresser.findById(req.params.id).exec(function (err, details) {
        if (err) return next(err); 
        if (details == null) {
            var err = new Error('Hairdresser not found');
            err.status = 404;
            return next(err);
        }
        res.send({ hairdresser: details });
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
        res.render('hairdressers', { hairdresser_list: allItems });
    });
}
