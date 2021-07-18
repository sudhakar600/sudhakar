const battles = require("../controllers/battle.controller");
module.exports = app => {
    // Retrieve all battles
    app.get("/", battles.getAllBattles);
    app.get("/list", battles.getAllBattles);

    //Retrieve battle count
    app.get("/count", battles.getTotalBattleCount);

    //search 
    app.get("/search", battles.seachBattleData);

  };