const {Pool,Client}=require("pg");
const config=require("config");
const connectionString= `postgressql://postgres:${config.get("postgresPass")}@localhost:5432/onlineLottery`

const User= new Client({
  connectionString
});
  //User.connect();

const Lottery= new Client({
  connectionString
});
  //Lottery.connect();

module.exports={
    User, Lottery
}