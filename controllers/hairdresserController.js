const { nextTick } = require('async');
var Hairdresser = require('../models/hairdresser');
var async = require('async');
// const validator = require('express-validator');
// const { body, validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

// Display hairdresser details
exports.detail = function (req, res) {
    async.parallel({
        hairdresser: function (callback) {
            Hairdresser.findById(req.params.id)
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.hairdresser == null) {
            var err = new Error('Hairdresser not found');
            err.status = 404;
            return next(err);
        }
        res.render('hairdresser_detail', { hairdresser: results.hairdresser });
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
