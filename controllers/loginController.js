// const bcrypt = require('bcrypt');
const Student = require('../model/Student');
const Guide = require('../model/Guide')

const handleLogin = async (req, res) => {

    const {teamName,email,facultyName,password,role} = req.query;

    if(role === 'student')
    {
        if (!teamName || !email || !password) return res.status(400).json({ 'message': 'Teamname, password and email are required.' });
        
        const team = await Student.findOne({teamName}).exec()
        if (!team) return res.sendStatus(401); //Unauthorized 

        // evaluate password 
        const match = (team.membersList.find((member) => member.email === email && member.password === password))

        if(match)
            res.status(200).json(team)
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