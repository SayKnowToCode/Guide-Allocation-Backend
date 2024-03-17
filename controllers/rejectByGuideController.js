const Guide = require('../model/Guide')

const handleFunc = async (req,res) => {

    const {facultyName,teamName} = req.body

    try {
        // Fetch all documents from the Guide collection
        const guide = await Guide.findOne({name : facultyName}).exec();

        if (!guide) {
            // Handle case where guide is not found
            return res.status(404).json({ error: 'Guide not found' });
          }

        const newArray = (guide.teams).filter((team) => team !== teamName)
        guide.teams = newArray;
        const result = await guide.save()
        
        res.status(200).json(result);
        console.log("Successful reject");
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

module.exports = {handleFunc}