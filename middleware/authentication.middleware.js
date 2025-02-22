import jwt from "jsonwebtoken";

export const authorize = function (req, res, next) {
    try {
        const bearerHeader = req.headers["authorization"];
        if (!bearerHeader || typeof bearerHeader === undefined) {
            res.status(400).json({
                message: "authorization token is required",
            });
        }
        const bearer = bearerHeader.split(" ");
        const unverifiedToken = bearer[1];

        if (!unverifiedToken) {
            res.status(401).json({ message: "Payload data is missing" });
        }
        const verifiedToken = jwt.verify(
            unverifiedToken,
            process.env.JWT_SECRET
        );
        req.user = verifiedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};
