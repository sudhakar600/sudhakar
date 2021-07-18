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

Battles.mostActive = function(params,result){
    if(params){
        let field = params;
        sql.query(`select ${field} , count(${field}) as mostactive${field}count from battles group by ${field} having count( mostactive${field}count>1) order by count(mostactive${field}count) desc; `,null,(err,res)=>{
            if(err){
                console.log('Err ::',err)
                result(err,null)
            }else{
                result(null,res)
            }
        })
    }else{
        result('no params provided',null)
    }
}

Battles.attackerOutcome = function(attacker_king,param,result){
    if(param){
        console.log(`select count(attacker_outcome) from battles where attacker_king='${attacker_king}' and attacker_outcome=${param}`)
        sql.query(`select count(attacker_outcome) as ${param} from battles where attacker_king='${attacker_king}' and attacker_outcome='${param}'`,null,(err,res)=>{
            if(err){
                console.log('Err ::',err)
                result(err,null)
            }else{
                result(null,res)
            }
        })
    }else{
        result('no params provided',null)
    }
}

Battles.battleType = function(result){
        sql.query(`select distinct(battle_type) as battle_type from battles `,null,(err,res)=>{
            if(err){
                console.log('Err ::',err)
                result(err,null)
            }else{
                result(null,res)
            }
        })
}

Battles.defenderInfo = function(attacker_king,result){
        console.log(`select MIN(defender_size) as min , MAX(defender_size) , AVG(defender_size) from battles where attacker_king='${attacker_king}'`)
        sql.query(`select MIN(defender_size) as min , MAX(defender_size) as max , AVG(defender_size) as avg from battles where attacker_king='${attacker_king}'`,null,(err,res)=>{
            if(err){
                console.log('Err ::',err)
                result(err,null)
            }else{
                result(null,res)
            }
        })
}

module.exports = Battles