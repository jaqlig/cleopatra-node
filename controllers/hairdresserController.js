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
