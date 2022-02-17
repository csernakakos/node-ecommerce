module.exports = {
    getError(errors, prop) {
        try {
            return console.log(errors), errors.mapped()[prop].msg;
        } catch (err) {
            return "";
        }
    }
};