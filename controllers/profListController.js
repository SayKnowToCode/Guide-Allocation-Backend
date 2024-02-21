const Guide = require('../model/Guide')

const sendData = async (req,res) => {

    try {
        // Fetch all documents from the Guide collection
        const guides = await Guide.find();

        // Send the data as a JSON response
        res.status(200).json(guides);
        // res.status(200).json({
        //     success: true,
        //     data: guides,
        //     message: 'Data retrieved successfully'
        // });
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

module.exports = {sendData}