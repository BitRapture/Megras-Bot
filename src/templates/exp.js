
module.exports = {
    GetExperience(_level) {
        return Math.ceil(5 / 6 * _level * (2 * _level * _level + 27 * _level + 91));
    }
}