const Guide = require('../model/Guide')
const Student = require('../model/Student')

const handleFunc = async (req, res) => {

    const { facultyName, teamName } = req.body

    try {
        const guide = await Guide.findOne({ name: facultyName }).exec();
        const team = await Student.findOne({ teamName: teamName }).exec();

        // Need to handle the case where some other guide has already accepted the team

        if (guide.count === 0) {
            res.status(200).json({ "message": "No more slots available" })
            return;
        }
        guide.count -= 1;

        const newArray = (guide.teams).filter((team) => team !== teamName)
        guide.teams = newArray;

        if (guide.acceptedTeams.includes(teamName)) {
            console.log("Already present in accepted teams");
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

        if (guide.count === 0) {
            req.emitChanges(`GuideFull`, {})
        }

        const guides = await Guide.find({ teams: { $in: [teamName] } })
        guides.forEach(async (guide) => {
            const newArray = (guide.teams).filter((team) => team !== teamName)
            guide.teams = newArray;
            await guide.save()
            req.emitChanges(`TeamAcceptedFor${guide.name}`, guide)
        })

        console.log("All requests removed");

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