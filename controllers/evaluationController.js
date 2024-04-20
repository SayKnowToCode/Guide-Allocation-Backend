const Guide = require('../model/Guide')
const Student = require('../model/Student')

const handleEval = async (req, res) => {

    const { teamName, marks, phase, role, facultyName } = req.body
    console.log(teamName, marks, phase, role, facultyName);

    try {
        const team = await Student.findOne({ teamName: teamName }).exec();
        switch (phase) {
            case 1:
                if (role === 'guide') {
                    team.phase1.marksByGuide = marks;
                }
                else {
                    team.phase1.marksByExternal = marks;
                }
                break;
            case 2:
                if (role === 'guide') {
                    team.phase2.marksByGuide = marks;
                }
                else {
                    team.phase2.marksByExternal = marks;
                }
                break;
            case 3:
                if (role === 'guide') {
                    team.phase3.marksByGuide = marks;
                }
                else {
                    team.phase3.marksByExternal = marks;
                }
                break;
            default:
                break;
        }
        await team.save();
        req.emitChanges(`EvaluationFor${teamName}`, team);

        const facultyGuide = await Guide.findOne({ name: facultyName }).exec();
        if (role === 'guide') {
            const newArray = facultyGuide.acceptedTeams.filter(team => team.teamName !== teamName);
            console.log(newArray);
            const newTeam = facultyGuide.acceptedTeams.find(team => team.teamName === teamName);
            console.log(newTeam);
            switch (phase) {
                case 1:
                    const newObject1 = { ...newTeam, phase1Marks: marks };
                    newArray.push(newObject1);
                    facultyGuide.acceptedTeams = newArray;
                    break;
                case 2:
                    const newObject2 = { ...newTeam, phase2Marks: marks };
                    newArray.push(newObject2);
                    facultyGuide.acceptedTeams = newArray;
                    break;
                case 3:
                    const newObject3 = { ...newTeam, phase3Marks: marks };
                    newArray.push(newObject3);
                    facultyGuide.acceptedTeams = newArray;
                    break;
                default:
                    break;
            }
        }
        else {
            const newTeam = facultyGuide.teamsAllocatedToMe.find(team => team.teamName === teamName);
            const newArray = facultyGuide.teamsAllocatedToMe.filter(team => team.teamName !== teamName);
            switch (phase) {
                case 1:
                    const newObject1 = { ...newTeam, phase1Marks: marks };
                    newArray.push(newObject1);
                    facultyGuide.teamsAllocatedToMe = newArray;
                    break;
                case 2:
                    const newObject2 = { ...newTeam, phase2Marks: marks };
                    newArray.push(newObject2);
                    facultyGuide.teamsAllocatedToMe = newArray;
                    break;
                case 3:
                    const newObject3 = { ...newTeam, phase3Marks: marks };
                    newArray.push(newObject3);
                    facultyGuide.teamsAllocatedToMe = newArray;
                    break;
                default:
                    break;
            }
        }
        await facultyGuide.save();
        console.log(facultyGuide.acceptedTeams, facultyGuide.teamsAllocatedToMe);
        res.status(200).json(facultyGuide);

    } catch (error) {
        // Handle errors and send an error response
        console.error('Error fetching data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Error fetching data'
        });
    }
    console.log("Successful expert allocation");
}

module.exports = { handleEval }