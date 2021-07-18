const battles = require("../controllers/battle.controller");
module.exports = app => {

    // Retrieve all battles
    app.get("/", battles.getAllBattles);
    app.get("/list", battles.getAllBattles);

    //Retrieve battle count
    app.get("/count", battles.getTotalBattleCount);

    //Stats 
    app.get("/stats", battles.getBattleStats);

    //search 
    app.get("/search", battles.seachBattleData);

  };