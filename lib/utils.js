import jwt from "jsonwebtoken";

export const generateToken = (username, res) => {
    try {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        if (!token) {
            res.status(406).json({ message: "Error while creating token" });
        }
        return token;
    } catch (error) {
        res.status(410).json({
            message: "Error :: Token :: generate Token ",
        });
    }
};
