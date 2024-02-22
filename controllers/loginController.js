// const bcrypt = require('bcrypt');
const Student = require('../model/Student');
const Guide = require('../model/Guide')

const handleLogin = async (req, res) => {
    const { teamName,facultyName, password,role } = req.body;

    if(role === 'student')
    {
        if (!teamName || !password) return res.status(400).json({ 'message': 'Teamname and password are required.' });
        const foundUser = await Student.findOne({teamName}).exec()
        if (!foundUser) return res.sendStatus(401); //Unauthorized 

        // evaluate password 
        const match = (password === foundUser.password)

        if(match)
            res.json(foundUser)
        else
            console.log("Unauthorized");
        
    }
    else
    {
        if (!facultyName || !password) return res.status(400).json({ 'message': 'Teamname and password are required.' });
        const foundUser = await Guide.findOne({name : facultyName}).exec()
        if (!foundUser) return res.sendStatus(401); //Unauthorized

        // const match = (password === foundUser.password)
        const match = true;

        if(match)
            res.json(foundUser)
        else
            console.log("Unauthorized");
    }
}

module.exports = {handleLogin}