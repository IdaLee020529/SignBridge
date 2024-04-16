const UserService = require('../services/UserService');

const UserController = {
    async SignUpUser(req, res) {
        try {
            const { username, email, password, picture, acc_type, role_access } = req.body;

            const newUser = await UserService.SignUpUser({ username, email, password, picture, acc_type, role_access })

            res.status(201).json(newUser)
        } catch (error) {
            console.error("Error registering user:", error)
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    async insertPresetAccounts(req, res) {
        try {
            await UserService.insertPresetAccounts();
            if (res) {
                res.status(200).json({ message: "Preset accounts inserted successfully" });
            }
        } catch (error) {
            console.error("Error inserting preset accounts:", error);
            if (res) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }, async GetAllUsers(req, res) {
        try {
            const users = await UserService.GetAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}

module.exports = UserController