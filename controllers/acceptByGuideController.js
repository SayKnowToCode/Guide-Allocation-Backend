const Guide = require('../model/Guide')

const handleFunc = async (req,res) => {

    const {facultyName,teamName} = req.body

    try {
        const guide = await Guide.findOne({name : facultyName}).exec();
        
        guide.count -= 1;

        // if(guide.count < 0)
        // {
        //     res.status(200).json({"message" : "No more slots available"})
        //     console.log("No more slots available");
        // }

        const newArray = (guide.teams).filter((team) => team !== teamName)
        guide.teams = newArray;
        if(guide.acceptedTeams.length > 0)
        {
            if((guide.acceptedTeams).find((team) => team === 'teamName'))
                res.status(200).json(guide)
                
            else
            {
                guide.acceptedTeams = [...guide.acceptedTeams,teamName];
                const result = await guide.save()
                res.status(200).json(result);
            }
                
        }
        else
        {
            guide.acceptedTeams = [...guide.acceptedTeams,teamName];
            const result = await guide.save()
            res.status(200).json(result);
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

module.exports = {handleFunc}