const { connectDB, DATABASE_COLLECTIONS } = require("../config/database");
const PRESET_SIGN_CATEGORIES = require("../constants/PresetSignCategories")

const LibraryService = {

    async fetchCat(){
        try{
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.LIBRARY);
            const result = await collection.find({}).toArray();
            client.close();
            return result;
        } catch (error) {
            throw new Error(`Error fetching sign categories: ${error.message}`);
        }
    },

    async insertPresetSignCategories(){
        const { client, database } = await connectDB();
        const presetSignsCategories = PRESET_SIGN_CATEGORIES.PRESET_SIGN_CATEGORIES;
        try{
            const collection = database.collection(DATABASE_COLLECTIONS.LIBRARY);

            const existingsigncategories = await collection
                .find({ $or: [{ category_id : 1 }, {  category_id : 2}, {  category_id : 3} , {  category_id : 4}] })
                .toArray();
            
            if (existingsigncategories.length === 0) {
                const presetcategorieswithID = presetSignsCategories.map((category, index) => ({
                    ...category,
                    category_id: index + 1 
                }));
    
                const result = await collection.insertMany(presetcategorieswithID);
                console.log(`${result.insertedCount} preset categories inserted`);
            } else {
                console.log("Preset sign categories already exist");
            }
        } catch (error) {
            console.error("Error inserting preset sign categories:", error);
            throw new Error(`Error inserting preset sign categories: ${error.message}`);
        } finally {
            client.close();
        }
    }
};

module.exports = LibraryService;