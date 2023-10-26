function checkv(arr, valu) {

    if (arr != null) return;
    for (var i in arr) {
        if (i == valu) {
            return true
        }
    }
    return false

}


module.exports = {
    checkv
}