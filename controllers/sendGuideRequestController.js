const Guide = require('../model/Guide')
const Student = require('../model/Student')

const sendData = async (req,res) => {

    const {facultyName,teamName} = req.body

    try {
        // Fetch all documents from the Guide collection
        const guide = await Guide.findOne({name : facultyName}).exec();
        const team = await Student.findOne({teamName : teamName}).exec();

        const wrong1 = (guide.acceptedTeams).find((team) => team === teamName)

        if(wrong1)
        {
            res.status(200).json({"message" : "Already present in accepted teams"})
            console.log("Already present in accepted teams");
        }
        

        else
        {
            if((guide.teams).find((team) => team === teamName))
                res.status(200).json({"message" : "Request already sent"}) 
            
            else
            {
                guide.teams = [...guide.teams,teamName];
                await guide.save()
                req.emitChanges(`RequestFor${guide.name}`, guide)
                res.status(200).json({"message" : "Request sent successfully"});
            }
            console.log("Successful request");
        }

        const wrong2 = (team.acceptedGuides).find((guide) => guide === facultyName)

        if(wrong2)
        {
            res.status(200).json({"message" : "Already present in accepted guides"})
            console.log("Already present in accepted guides");
        }
        else
        {
            if((team.guides).find((guide) => guide === facultyName))
                res.status(200).json({"message" : "Request already sent"}) 
            
            else
            {
                team.guides = [...team.guides,facultyName];
                await team.save()
                req.emitChanges(`RequestBy${team.teamName}`, team)
                res.status(200).json({"message" : "Request sent successfully"});
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