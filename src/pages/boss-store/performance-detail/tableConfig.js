export const tableConfig=[
    {
        key:'project',
        url:'/wide-business/achievement/project',
        name:'项目',
        children:[ { name:'项目名称',value:18 },{ name:'所属分类',value:18 },{ name:'销售数量',value:18,sort:true },{ name:'业绩金额',value:18,sort:true },{ name:'成本',value:18,sort:true },{ name:'毛利',value:10,sort:true }],
    },
    {
        key:'product',
        name:'产品',
        url:'/wide-business/achievement/product',
        children:[ { name:'产品名称',value:18 },{ name:'编码',value:18 },{ name:'所属分类',value:18 },{ name:'销售数量',value:18,sort:true },{ name:'业绩金额',value:18,sort:true },{ name:'成本',value:18,sort:true },{ name:'毛利',value:10,sort:true }],
    },
    // {
    //     key:'additional',
    //     name:'附加费用',
    //     url:'/wide-business/achievement/additional',
    //     children:[ { name:'名称',value:25 },{ name:'销售数量',value:25,sort:true },{ name:'业绩金额',value:25,sort:true },{ name:'成本',value:25,sort:true },{ name:'毛利',value:18,sort:true }],
    // },
    {
        key:'species',
        name:'充值卡',
        url:'/wide-business/achievement/species',
        children:[ { name:'充值卡',value:33 },{ name:'销售数量',value:33,sort:true },{ name:'业绩金额',value:33,sort:true }],
    },
    {
        key:'records',
        name:'计次卡',
        url:'/wide-business/achievement/records',
        children:[ { name:'计次卡',value:33 },{ name:'销售数量',value:33,sort:true },{ name:'业绩金额',value:33,sort:true }],
    },
]