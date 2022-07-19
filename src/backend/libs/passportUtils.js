const crypto = require('crypto');

/** Credits to Zachgoll 
 *  
 * Since I copied this there
*/  

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}

function isValid(password, salt, verify) {
    var hashVerify = crypto.pbkdf2Sync(verify, salt, 10000, 64, 'sha512').toString('hex');
    return password === hashVerify;
}

module.exports = { isValid, genPassword }