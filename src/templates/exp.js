
module.exports = {
    GetExperience(_level) {
        return Math.ceil((_level ** 1.7 * 4) * 500);
    }
}