const Guide = require('../model/Guide')
const Student = require('../model/Student')

const handleFunc = async (req, res) => {

    const { facultyName, teamName, selectedFaculty } = req.body

    try {
        const facultyGuide = await Guide.findOne({ name: facultyName }).exec();
        const expertGuide = await Guide.findOne({ name: selectedFaculty }).exec();

        facultyGuide.teamsAllocatedByMe.push({ teamName: teamName, allocatedTo: selectedFaculty });
        await facultyGuide.save();

        expertGuide.teamsAllocatedToMe.push({ teamName: teamName, allocatedBy: facultyName });
        await expertGuide.save();

        const team = await Student.findOne({ teamName: teamName }).exec();
        team.expertAllocated = selectedFaculty;
        await team.save();

        req.emitChanges(`expertGuideFor${teamName}`, team);
        req.emitChanges(`expertGuideFor${selectedFaculty}`, expertGuide);
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

module.exports = { handleFunc }