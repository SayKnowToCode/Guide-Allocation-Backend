// const bcrypt = require('bcrypt');
const User = require('../model/User');

const handleLogin = async (req, res) => {
    const { teamName, password } = req.body;
    if (!teamName || !password) return res.status(400).json({ 'message': 'Teamname and password are required.' });
    const foundUser = await User.findOne({teamName}).exec()
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    // evaluate password 
    const match = (password === foundUser.password)

    if(match)
    {
        res.json(foundUser)
    }
    else
    {
        console.log("Unauthorized");
    }
}

module.exports = {handleLogin}