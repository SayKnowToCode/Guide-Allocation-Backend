const Guide = require('../model/Guide')
const Student = require('../model/Student')

const sendData = async (req, res) => {

    const { facultyName, teamName } = req.body

    try {
        // Fetch all documents from the Guide collection
        const guide = await Guide.findOne({ name: facultyName }).exec();
        const team = await Student.findOne({ teamName: teamName }).exec();

        const wrong1 = (guide.acceptedTeams).find((team) => team === teamName)
        const wrong2 = team.acceptedGuide !== '' ? true : false

        if (wrong1 || wrong2) {
            res.status(200).json({ "message": "Already present in accepted teams" })
            console.log("Already present in accepted teams");
        }

        else {
            if (guide.teams.includes(teamName)) {
                console.log("Already requested")
            }

            else {
                guide.teams = [...guide.teams, teamName];
                team.guides = [...team.guides, facultyName];
                await guide.save()
                await team.save()
                req.emitChanges(`RequestFor${guide.name}`, guide)
                res.status(200).json(team);
            }
            console.log("Successful request");
        }

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

module.exports = { sendData }