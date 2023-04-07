const User = require("../../models/User");
const bcrypt = require("bcrypt");

async function createUser(req, res){
    const salt = await bcrypt.genSalt(30);
    const pass = await bcrypt.hash(req.body.password, salt);
}

module.exports = createUser;