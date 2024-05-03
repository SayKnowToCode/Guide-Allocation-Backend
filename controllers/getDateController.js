const Dates = require('../model/Date');

const getDateInfo = async (req, res) => {
    try {
        const allDates = await Dates.find();
        res.json(allDates);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve date information' });
    }
}

module.exports = { getDateInfo }