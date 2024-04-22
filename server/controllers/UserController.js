const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');
const session = require('express-session');


const UserController = {
    async SignUpUser(req, res) {
        try {
            const { username, email, password, picture, acc_type, role_access } = req.body;

            const newUser = await UserService.SignUpUser({
                username,
                email,
                password,
                picture: picture || "./images/profile-img.png",
                acc_type: acc_type || "traditional",
                role_access: role_access || "public",
                email_verified: false,
            })

            res.status(201).json({
                message:
                    "Verification email sent. Please verify your email to complete registration.",
                })
        } catch (error) {
            console.error("Error registering user:", error)
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async SignUpGoogleUser(req, res) {
        try {
            const googleUser = req.body;
            const newUser = await UserService.SignUpGoogleUser(googleUser)

            res.status(201).json(newUser)
        } catch (error) {
            console.error("Error registering user:", error)
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async VerifyEmail(req, res) {
        try {
            const token = req.query.token;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserService.VerifyEmail(token);
            
            if (user) {
                if (user.email === decodedToken.email) {
                    res.redirect(`${process.env.FRONTEND_URL}/login`);
                } else {
                    res.status(400).send("Invalid or expired token");
                }
            }

            // res.status(200).json({ message: "Email verified successfully" });
        } catch (error) {
            console.error("Error verifying email:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async LoginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserService.LoginUser({email, password});
          
            if (user) {

                if (user.password !== req.body.password || user.email !== req.body.email) {
                    return res.status(401).json({ error: "Incorrect email or password" });
                }
    
                if (user.email_verified === false) {
                    return res.status(403).json({ error: "Email not verified" });
                }

                const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                    expiresIn: "7d",
                });

                req.session.isLoggedIn = true;
                req.session.username = user.username;
                req.session.email = user.email;
                req.session.picture = user.picture;
                req.session.acc_type = user.acc_type;
                req.session.role_access = user.role_access;

                res.status(200).json({
                    Login: true,
                    username: req.session.username,
                    role_access: req.session.role_access,
                    picture: req.session.picture,
                    token: token,
                    message: "Login successful",
                });
            } else {
                res.status(401).json({ error: "Invalid email or password" });
            }
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async LogoutUser(req, res) {
        try {
            // if (!req.session.isLoggedIn) {
            //     return res.status(401).json({ error: "Not logged in" });
            // }

            req.session.destroy();
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            console.error("Error logging out user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async ForgetPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await UserService.ForgetPassword({ email });

            if (user) {
                res.status(200).json({ message: "Password reset email sent" });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            console.error("Error forgetting password:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async ResetPassword(req, res) {
        try {
            const { token, password } = req.body;
            const user = await UserService.ResetPassword({ token, password });

            if (user) {
                res.status(200).json({ message: "Password reset successfully" });
            } else {
                res.status(400).json({ error: "Invalid or expired token" });
            }
        } catch (error) {
            console.error("Error resetting password:", error);
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
    },
    
    async GetAllUsers(req, res) {
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