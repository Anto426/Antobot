async function arreyremoveelement(content, element) {
    try {
        let temp = [];
        content.forEach(x => {
            for (let i in x.legth) {
                if (x[i] != element) {
                    temp.push(x)
                }
            }
        })
        return temp
    } catch {

    }
}
async function arreycheckelement(arrey, element) {
    let trovato = false
    arrey.forEach(async x => {
        for (let y in x) {
            if (x[y] == element) { trovato = true }
        }
    })
    return trovato

}

async function arreyfindlement(arrey, elementfind) {
    let t = false
    try {
        console.log(arrey.length)
        arrey.forEach(async x => {
            for (let y in x) {
                if (y == elementfind) { t =  true }
            }
            t =  false
        })
    } catch (err) { t =  true }

    return t
}
module.exports = {
    arreyremoveelement: arreyremoveelement,
    arreyfindlement: arreyfindlement,
    arreycheckelement: arreycheckelement

}