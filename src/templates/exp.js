
module.exports = {
    GetExperience(_level) {
        return Math.ceil(((_level) * (_level * 1024) * (_level * 0.65)) + 500);
    }
}