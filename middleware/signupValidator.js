
const {check, validationResult} = require('express-validator');
const auth = function (req, res,next) {
        check('fName', 'Buyer Full name must be mentioned').not().isEmpty(),
        check('lName', 'Buyer must be included').not().isEmpty(),
        //.isLength({ min: 12 }),
        check('email', 'Email must be unique').isEmail(),
        check('mobileNumber', 'Phone must be included').isMobilePhone(),
        check('password', 'Gander must be included').not().isEmpty(),
        next();

}
module.exports=auth