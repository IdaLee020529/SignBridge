const CategoryService = require("../services/CategoryService");

const CategoryController = {
    async fetchCat(req, res) {
        try {
            const cat = await CategoryService.fetchCat();
            res.status(200).json(cat);
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async insertPresetSignCategories(res){
        try{
            const result = await CategoryService.insertPresetSignCategories();
            if(res){
                res.status(200).json({ message: "Preset sign categories inserted successfully" });
            }
        } catch (error) {
            console.error("Error inserting preset sign categories:", error);
            if (res) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
};

module.exports = CategoryController;
