const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@";

const XOR = (data, key) => {
    let result = '';
    for (let i = 0; i < data.length; i++) {
        let charAtData = possible.indexOf(data[i]);
        let charAtKey = possible.indexOf(key[i % key.length]);
        result += possible[charAtData ^ charAtKey];
    }
    return result;
}

const encodeNumber = (num) => {
    let result = '';
    let bytes = possible.length;
    result += possible[Math.floor(num / bytes)];
    result += possible[num % bytes];
    return result;
}

const decodeNumber = (str) => {
    let result = 0;
    let bytes = possible.length;
    result += possible.indexOf(str[0]) * bytes;
    result += possible.indexOf(str[1]);
    return result;
}

const makeKey = (letters) => {
    letters = letters || 5;
    let section = '';
    for (let i = 0; i < letters; i++) {
        section += possible[Math.floor(Math.random() * possible.length)];
    }
    return section;
}

const makeActivatedKey = (productId, serialPrefix, trialCount, licenseCount) => {
    let xorKey = makeKey(6);
    let trialSection = XOR(encodeNumber(trialCount), xorKey) + makeKey(4);
    let licenseSection = XOR(encodeNumber(licenseCount), xorKey) + makeKey(4);
    let activatedKey = `${productId}-${serialPrefix}-${trialSection}-${licenseSection}-${xorKey}`
    return activatedKey;
}

const parseActivatedKey = (activatedKey) => {
    activatedKey = activatedKey.split('-');
    let result = {};
    result.productId = activatedKey[0];
    result.serialPrefix = activatedKey[1];
    let decodedTrialSection = XOR(activatedKey[2].slice(0, 2), activatedKey[4]);
    result.trialCount = decodeNumber(decodedTrialSection);
    let decodedLicenseSection = XOR(activatedKey[3].slice(0, 2), activatedKey[4]);
    result.licenseCount = decodeNumber(decodedLicenseSection);
    return result;
}
module.exports = {
    makeActivatedKey,
    parseActivatedKey
};
// let secret = makeKey(6);
// let key = makeActivatedKey('APPRODU', 'XG6032', 4095, 4031, secret);
// console.log(key);
// let parsed = parseActivatedKey(key);
// console.log(parsed);

// for (var testNumber = 0; testNumber < 10000; testNumber++) {
//     let key = makeActivatedKey('APPRODU', 'XG6032', testNumber, 303, makeKey(6));
//     let parsed = parseActivatedKey(key);
//     if(parsed.trialCount !== testNumber){
//         console.log('Max error - ', testNumber);
//         break;
//     }
// }