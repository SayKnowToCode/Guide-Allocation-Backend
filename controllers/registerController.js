const Student = require('../model/Student');
// const bcrypt = require('bcrypt');

const handleNewTeam = async (req, res) => {
    
    const { teamName, leaderPassword, leaderName, leaderEmail, leaderUID, leaderBranch, member1Name, member1Email, member2Name,member2Email } = req.body;

    if (!teamName || !leaderName) return res.status(400).json({ "message" : 'Team name and Leader name are required.' });

    // check for duplicate usernames in the db
    const duplicate = await Student.findOne({ teamName }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        // const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
      
            const result = await Student.create({
                teamName,
                membersList: [
                    { name: leaderName, email: leaderEmail, UID: leaderUID,branch: leaderBranch,password: leaderPassword, isTeamLeader: true, registerationFinal: true},
                    { name: member1Name, email: member1Email },
                    { name: member2Name, email: member2Email }
                ]
            });

        console.log(result);

        res.status(201).json({ 'success': `New user created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const handleNewUser = async (req, res) => {

    //Write a function to check if the team name already exists and then add the user to the team
    
    const { name,UID,email,branch,password,teamName } = req.body;

    if (!teamName || !name) return res.status(400).json({ "message" : 'Team name and User name are required.' });

    // check for duplicate usernames in the db
    const team = await Student.findOne({ teamName }).exec();

    if(team)
    {

        const member = team.membersList.find((member) => member.email === email);
        console.log(member);

        if(typeof member !== 'undefined')
        {
            try {
                
                const newMember = team.membersList.map((member) => {
                    if(member.email === email)
                    {
                        member.name = name;
                        member.UID = UID;
                        member.branch = branch;
                        member.password = password;
                        member.registerationFinal = true;
                    }
                    return member;
                })

                team.membersList = newMember;
                const result = await team.save();
        
                console.log(result);
        
                res.status(201).json({ 'success': `New member added to team!` });
            } catch (err) {
                res.status(500).json({ 'message': err.message });
            }
        }
        else
        {
            return res.status(400).json({"message" : "Team member does not exist in team"});
        }

    }
    else
    {
        console.log("No team exists");
        return res.status(400).json({"message" : "No such team name exists"}); 
    }

    
}

module.exports = {handleNewTeam,handleNewUser} ;