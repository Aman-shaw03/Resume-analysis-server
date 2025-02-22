import crypto from "crypto"

function generateEncryptionKey(){
    const key = crypto.randomBytes(32).toString("base64"); // Generates a 256-bit key

    return key;
};
const key = generateEncryptionKey()
const ENCRYPTION_KEY = Buffer.from(
    key,
    "base64"
); // 32 bytes (256 bits)
const IV_LENGTH = 16;

export const encryptData = (data)=>{
    let iv = crypto.randomBytes(IV_LENGTH)
    let cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv)
    let encrypted = cipher.update(data, "utf-8", "hex")
    encrypted += cipher.final("hex")
    return iv.toString("hex") + ":" + encrypted
}

export const decryptData = (encryptedData) => {
    let textParts = encryptedData.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = textParts.join(":");
    let decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted.toString();
};