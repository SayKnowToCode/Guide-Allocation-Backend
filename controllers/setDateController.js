const Dates = require('../model/Date'); // Import utcToZonedTime function from date-fns-tz for timezone conversion

const setDateInfo = async (req, res) => {
    const { startDate, endDate, topic } = req.body;

    try {
        // Convert incoming dates to UTC before storing them

        // Fetch existing document from the Dates collection for the specified topic
        const findDate = await Dates.findOne({ topic }).exec();

        if (findDate) {
            // Update existing document with new zoned dates
            findDate.startDate = startDate;
            findDate.endDate = endDate;
            await findDate.save();
            console.log("Date Updated successfully");
            res.status(200).json(findDate);
        } else {
            // Create a new document if none exists for the specified topic
            const newDate = await Dates.create({ startDate, endDate, topic });
            console.log("Date Stored successfully");
            res.status(200).json(newDate);
        }
    } catch (error) {
        // Handle errors and send an error response
        console.error('Error updating date information:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Error updating date information'
        });
    }
}

module.exports = { setDateInfo };
