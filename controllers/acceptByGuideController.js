const Guide = require('../model/Guide')
const Student = require('../model/Student')

const handleFunc = async (req, res) => {

    const { facultyName, teamName } = req.body

    try {
        const guide = await Guide.findOne({ name: facultyName }).exec();
        const team = await Student.findOne({ teamName: teamName }).exec();

        guide.count -= 1;

        // if(guide.count < 0)
        // {
        //     res.status(200).json({"message" : "No more slots available"})
        //     console.log("No more slots available");
        // }

        const newArray = (guide.teams).filter((team) => team !== teamName)
        guide.teams = newArray;

        if (guide.acceptedTeams.length > 0) {
            (guide.acceptedTeams).find((team) => {
                if (team.teamName === teamName) {
                    res.status(200).json({ "message": "Already accepted" })
                    return;
                }
            })
        }
        else {
            guide.acceptedTeams.push({ teamName: teamName });
            team.acceptedGuide = facultyName;
            team.guides = [];
            await guide.save()
            await team.save()
            req.emitChanges(`AcceptFor${team.teamName}`, team)
            res.status(200).json(guide);
        }
        console.log("Successful accept");
    } catch (error) {
        // Handle errors and send an error response
        console.error('Error fetching data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Error fetching data'
        });
    }

}

module.exports = { handleFunc }