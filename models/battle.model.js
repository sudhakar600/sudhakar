const sql = require('../db.js')
const Battles = function(battle){

}

Battles.getBattlelist = function(result){
    sql.query('select * from battles',null,(err,res)=>{
        if(err){
            console.log('Err ::',err)
            result(err,null)
        }else{
            result(null,res)
        }
    })
}

Battles.getBattleTotalCount = function(result){
    sql.query('select count(*) as totalbattlecount from battles',null,(err,res)=>{
        if(err){
            console.log('Err ::',err)
            result(err,null)
        }else{
            result(null,res)
        }
    })
}


Battles.seachForBattledata = function(params,result){
    sql.query(`select * from battles where ${params}`,null,(err,res)=>{
        if(err){
            console.log('Err ::',err)
            result(err,null)
        }else{
            result(null,res)
        }
    })
}


module.exports = Battles