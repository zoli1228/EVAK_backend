module.exports.check  = function(req, res, next) {

         if (error) {
            return next(error);
        } else {      
            if (req.body.username === null) {     
                var err = new Error('Not authorized! Go back!');
                err.status = 400;
                return next(err);
            } else {
                return next();
            }
        }
    };
