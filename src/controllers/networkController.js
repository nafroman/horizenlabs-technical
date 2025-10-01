const { getNetwork } = require('../services/ethereumService');

exports.getNetwork = async (req, res) => {
	try {
		const network = await getNetwork();
		res.json(network);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
