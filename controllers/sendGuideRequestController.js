const Guide = require('../model/Guide')

const sendData = async (req,res) => {

    const {facultyName,teamName} = req.body

    try {
        // Fetch all documents from the Guide collection
        const guide = await Guide.findOne({name : facultyName}).exec();

        const wrong = guide.acceptedTeams.find((team) => team === teamName)

        if(wrong)
            res.status(200).json(guide)
        else
        {

        if(guide.teams.length > 0)
        {
            if((guide.teams).find((team) => team === 'teamName'))
                res.status(200).json(guide) 
            
            else
            {
                guide.teams = [...guide.teams,teamName];
                const result = await guide.save()
                res.status(200).json(result);
            }
                
        }
        else
        {
            guide.teams = [...guide.teams,teamName];
            const result = await guide.save()
            res.status(200).json(result);
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

module.exports = {sendData}