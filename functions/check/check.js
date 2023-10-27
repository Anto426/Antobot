function checkvas(arr, valu) {
    return new Promise((resolve, reject) => {
        console.log(arr)
        if (arr && arr.length != 0) {

            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === valu) {
                    resolve(true);
                }
            }
        } else {
            return false;

        }
    });
}

function checkvs(arr, valu) {

    if (arr.length != 0) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === valu) {
                return true;
            }
        }
    } else {
        return false;
    }
}




module.exports = {
    checkvs,
    checkvas
}