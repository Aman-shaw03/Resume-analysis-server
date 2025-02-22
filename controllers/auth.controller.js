
import { generateToken } from "../lib/utils.js";

export const login = async (req, res)=>{
    try {
        const {username, password} = req.body
        if(!username || !password){
            res.status(405).json({message: "Name or password is missing"})
        }
    
        const validUserName = "naval.ravikant";
        const validPassword = "05111974";
    
        if(username !== validUserName || password !== validPassword){
            res.status(405).json({message: "Invalid Credentials, Pls check the details"})
        }
    
        const token = generateToken(username, res)
        res.status(200).json({jwt: token})
    } catch (error) {
        res.status(401).json({error: error})
    }

}