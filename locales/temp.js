module.exports = {
    encryptPass(orignalPass){
        var encryptedPass = "";
        for(var i = 0 ; i < orignalPass.length ; i++){
            var code = (orignalPass.charCodeAt(i)*4)-3;
            encryptedPass = encryptedPass + code + ".";
        }
        return encryptedPass;
    },
    decryptPass(encryptedPass){
        var decrypt = encryptedPass.split('.');
        var decryptedPass = "";
        for(var i = 0 ; i < decrypt.length -1 ; i++){
            decrypt[i] = (parseInt(decrypt[i])+3)/4;
            decryptedPass = decryptedPass + String.fromCharCode(decrypt[i]);
        }
        return decryptedPass;
    }
}