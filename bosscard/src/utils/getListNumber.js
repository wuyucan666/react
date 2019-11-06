
import services from "services"
const  GET_PERSONTOTAL_LIST = [ 'all' ,'processing'  , 'alreadyPosted' , 'completed','delete', 'bSingle' ]
//all:全部订单， processing: 进行中，  alreadyPosted：已挂涨， completed：已完成，delete：已作废，bSingle：B单

const  GET_RETURN_TOTAL = [ 1 , 2 , 4 , 3 , false  ]

/**
 * 判断结构类型
 * @param name 接口名称
 * @returns {number[]}
 */

function fromNameToArray(name){
    switch(name){
        case 'getPersonListTotal':
        return GET_PERSONTOTAL_LIST
        case 'getReturnTatal':
        return GET_RETURN_TOTAL
        default:
        return []
    }
}


/**
 * 根据传入接口名称，调用接口 获取数量数组
 * @param name
 * @returns {number[]}
 */

export default async function getListNumber(name){
    let lengthArr
    try {
    await services[name]().then( res =>{
        if(res.success){
            let nameArray = fromNameToArray(name)
            const { data , list } = res
            if(data){
                if(name==='getPersonListTotal'){
                    lengthArr = [ data.alreadyPosted * 1 + data.completed * 1 + data.delete * 1 , data.bSingle * 1 ,false  ]
                }else{
                    lengthArr = nameArray
                    .map(i=>data[i])
                }
            }

            if(list){
            lengthArr = nameArray
            .map(item=> item ? list.filter(i=> item ===i.state*1)[0].count : item )
            }
        }
    })
    } catch (error) {
        lengthArr = []
    }
    return lengthArr
}
