export default {
    acyncupdata1({commit},msg) {
        window.setTimeout(()=>{
            commit('updata1',msg)
        },1000)
    },
    asyncupdata2(fre) {
        console.log(fre)
    }
}