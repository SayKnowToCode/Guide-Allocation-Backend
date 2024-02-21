const User = require('../model/User');
const { ObjectId } = require('mongodb');
// const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { teamName, password, leaderName, leaderUID, leaderEmail, member1Name, member1UID, member1Email, member2Name, member2UID, member2Email } = req.body;

    if (!teamName || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ teamName }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        // const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
      
            const result = await User.create({
                teamName,
                password,
                membersList: [
                    { name: leaderName, UID: leaderUID, email: leaderEmail, isTeamLeader: true },
                    { name: member1Name, UID: member1UID, email: member1Email },
                    { name: member2Name, UID: member2UID, email: member2Email }
                ]
            });

        console.log(result);

        res.status(201).json({ 'success': `New user created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = {handleNewUser} ;