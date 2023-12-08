import crypto from 'crypto';

class Encryption {
    constructor(algorithm, initVector, securityKey) {
        this.algorithm = algorithm;
        this.initVector = initVector;
        this.securityKey = securityKey;
    }
    encrypt(data) {
        const cipher = crypto.createCipheriv(
            this.algorithm,
            this.securityKey,
            this.initVector
        );

        let encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    }

    decrypt(encryptedData) {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.securityKey,
            this.initVector
        );

        let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return decryptedData;
    }
}

const hash = new Encryption(
    'aes-256-cbc',
    crypto.randomBytes(16),
    crypto.randomBytes(32)
);

export default hash;
