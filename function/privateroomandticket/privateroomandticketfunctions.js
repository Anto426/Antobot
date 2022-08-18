const jsonf = require("../json/jsnonfunctions")


async function closetticketandroom(file,member){

            temp = [];
            let content = await jsonf.jread(file)
            content.list.forEach((x) => {
                if (x.IDuser != member.id) {
                    temp.push(x)
                } else {
                    for (let y in x) {
                        if (y != "IDuser") {
                            let channel = member.guild.channels.cache.find(z => z.id == x[y])
                            try {
                                channel.delete("")
                            } catch (err) { console.log(err) }
                        }
                    }
        
        
                }
            })
            content.list = temp
            jsonf.jwrite(file,content)
        

    
}

async function findchannel(arrey,member){
    let id =""
    arrey.forEach(x => {
        if (x.IDuser == member.id) {
            id = x.IDticket
        }
    })
    return id
}


module.exports={
    closetticketandroom:closetticketandroom,
    findchannel:findchannel
}