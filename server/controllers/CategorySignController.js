const CategorySignService = require("../services/CategorySignService");

const CategorySignController = {
    async fetchSign(req, res) {
        const cat = req.params.cat; // Assuming category is passed as a query parameter
        try {
            const signs = await CategorySignService.fetchSign(cat);
            res.status(200).json(signs);
        } catch (error) {
            console.error("Error fetching signs for:", cat, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = CategorySignController;
