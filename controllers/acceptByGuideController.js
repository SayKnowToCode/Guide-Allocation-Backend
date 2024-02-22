const Guide = require('../model/Guide')

const handleFunc = async (req,res) => {

    const {facultyName,teamName} = req.body

    try {
        // Fetch all documents from the Guide collection
        console.log('here');
        const guide = await Guide.findOne({name : facultyName}).exec();
        
        guide.count -= 1;
        const result = await guide.save()
        
        res.status(200).json(result);
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

module.exports = {handleFunc}