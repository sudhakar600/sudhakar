const Battles = require("../models/battle.model");
const async = require('async')


// Retrieve all Battle from the database.
exports.getAllBattles = (req, res) => {
    Battles.getBattlelist((err,resp)=>{
        if(err){
            console.log('ERR',err)
            res.send({
                status:500,
                message:'Error in fetching battle list'
            })
        }else{
            res.send({
                status:200,
                message:resp
            })
        }
    })
};

// Retrieve  Battle Count from the database.
exports.getTotalBattleCount = (req, res) => {
    Battles.getBattleTotalCount((err,resp)=>{
        if(err){
            console.log('ERR',err)
            res.send({
                status:500,
                message:'Error in fetching battle count'
            })
        }else{
            res.send({
                status:200,
                message:resp
            })
        }
    })
};

// seachBattleData
exports.seachBattleData = (req, res) => {
    if(req.query){
        let receivedParameters =  req.query;
        let searchQuery = [];
        if(receivedParameters.king){
            searchQuery.push(` (attacker_king LIKE '%${receivedParameters.king}%' OR defender_king LIKE '%${receivedParameters.king}%')`)
        }
    
        if(receivedParameters.name){        
            searchQuery.push(` name LIKE '%${receivedParameters.name}%'`)
        }
        if(receivedParameters.year){
            searchQuery.push(` year = ${receivedParameters.year}`)
        }
        if(receivedParameters.battle_number){
            searchQuery.push(` battle_number = ${receivedParameters.battle_number} `)
        }
        if(receivedParameters.attacker){
            searchQuery.push(` (attacker_1 LIKE '%${receivedParameters.attacker}%'
            OR attacker_2 LIKE '%${receivedParameters.attacker}%'
            OR attacker_3 LIKE '%${receivedParameters.attacker}%'
            OR attacker_4 LIKE '%${receivedParameters.attacker}%'
           ) `)
        }
        if(receivedParameters.defender){
            searchQuery.push(` (defender_1 LIKE '%${receivedParameters.defender}%'
            OR defender_2 LIKE '%${receivedParameters.defender}%'
            OR defender_3 LIKE '%${receivedParameters.defender}%'
            OR defender_4 LIKE '%${receivedParameters.defender}%'
           ) `)
        }
        if(receivedParameters.defender){
            searchQuery.push(` (defender_1 LIKE '%${receivedParameters.defender}%'
            OR defender_2 LIKE '%${receivedParameters.defender}%'
            OR defender_3 LIKE '%${receivedParameters.defender}%'
            OR defender_4 LIKE '%${receivedParameters.defender}%'
           ) `)
        }
        if(receivedParameters.battletype){
            searchQuery.push(` battle_type = '${receivedParameters.battletype}' `)
        }
        if(receivedParameters.attacker_outcome){
            searchQuery.push(` attacker_outcome = '${receivedParameters.attacker_outcome}' `)
        }
        if(receivedParameters.majordeath){
            searchQuery.push(` major_death = ${receivedParameters.majordeath} `)
        }
        if(receivedParameters.majorcapture){
            searchQuery.push(` major_capture = ${receivedParameters.majorcapture} `)
        }
        if(receivedParameters.attackersize){
            searchQuery.push(` attacker_size = ${receivedParameters.attackersize} `)
        }
        if(receivedParameters.defendercommander){
            searchQuery.push(` defender_commander = '${receivedParameters.defendercommander}' `)
        }
        if(receivedParameters.region){
            searchQuery.push(` region = '${receivedParameters.region}' `)
        }
        if(receivedParameters.location){
            searchQuery.push(` location = '${receivedParameters.location}' `)
        }
        if(receivedParameters.summer){
            searchQuery.push(` summer = '${receivedParameters.summer}' `)
        }
        if(receivedParameters.note){
            searchQuery.push(` note = '${receivedParameters.note}' `)
        }
        if(searchQuery.length>1){
            searchQuery = searchQuery.join (' AND')
        }
        console.log(searchQuery)
        Battles.seachForBattledata(searchQuery,(err,resp)=>{
            if(err){
                console.log('ERR',err)
                res.send({
                    status:500,
                    message:'Error in fetching battle count'
                })
            }else{
                res.json({
                    status:200,
                    message:resp
                })
            }
        })
    }else{
        res.send({status:400,message:"Missing parameters, Pass some query parameter"})
    }
};

//get stats
exports.getBattleStats = async (req,res) =>{
    let result ={
        "mostactive":{
            "attacker_king":null,
            "defender_king":null,
            "region":null,
            "name" : null,
            "battle_type":null
        },
        "attacker_outcome":{
            "win":null,
            "lose":null
        },
        'defender_size':{
            "min":null,
            "max":null,
            "avg":null
        }
    };
    
    async.waterfall([
        function(callback){
            let requireColumns = ['attacker_king','defender_king','region','name']
            async.map(requireColumns, function(param, nextCall) {
                 Battles.mostActive(param,(err,queryResp)=>{
                    if(err){
                        console.log('ERR',err)
                        return(err)
                    }else{
                        result.mostactive[param] = queryResp[0][param]
                        nextCall(null,queryResp[0][param])
                    }
                })
            },(err,loopresult)=>{
                if(err){
                    callback(err,null)
                }else{
                    callback(null,loopresult)
                }
            });
        },
        function(status,callback){
            let requireColumns = ['win','lose']
            async.map(requireColumns, function(param, nextCall) {
                 Battles.attackerOutcome(result.mostactive.attacker_king,param,(err,queryResp)=>{
                    if(err){
                        console.log('ERR',err)
                        return(err)
                    }else{
                        result.attacker_outcome[param] = queryResp[0][param]
                        nextCall(null,queryResp[0][param])
                    }
                })
            },(err,loopresult)=>{
                if(err){
                    callback(err,null)
                }else{
                    callback(null,loopresult)
                }
            });
            
            
        },
        function(status,callback){
                Battles.battleType(function(err,battletypes){
                    if(err){
                        callback(err,null)
                    }else{
                        result.battle_type = battletypes.map((x)=>x.battle_type).filter(Boolean)
                        callback(null,battletypes)
                    }
                })
        },
        function(status,callback){
            Battles.defenderInfo(result.mostactive.attacker_king,function(err,defenderInfoResp){
                if(err){
                    callback(err,null)
                }else{
                    result.defender_size.min = defenderInfoResp[0].min
                    result.defender_size.max = defenderInfoResp[0].max
                    result.defender_size.avg = defenderInfoResp[0].avg
                    console.log('battleType',defenderInfoResp)
                    callback(null,result)
                }
            })
    }
        
    ],(err,finalresult)=>{
        if(err){
            res.send({status:500,message:'Something went wrong',err:err})

        }else{
            res.send({status:200,message:result})
        }
    })
   
}



