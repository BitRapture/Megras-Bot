
module.exports = {
    GetExperience(_level) {
        return Math.ceil(((_level) * (_level * 12) * (_level * 0.1435)) + ((_level + 1) * 500));
    }
}