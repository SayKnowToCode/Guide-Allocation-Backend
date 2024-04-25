const Student = require('../model/Student');

const getTeamInfo = async (req, res) => {
    const { teamName } = req.query;
    console.log(teamName);
    try {
        // Fetch all documents from the Guide collection
        const team = await Student.find({ teamName: teamName });
        res.status(200).json(team)
        console.log(team);
    } catch (error) {
        // Handle errors and send an error response
        console.error('Error fetching data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Error fetching data'
        });
    }
    console.log("Team sent succesfully");
}

module.exports = { getTeamInfo }