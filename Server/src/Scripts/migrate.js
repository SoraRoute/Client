const fs = require("fs");
const path = require("path");
const db = require("../Config/dbConnection");

async function migrate(){

    const schemaFolder =
    path.join(__dirname,"../Database");

    const files = fs.readdirSync(schemaFolder);

    for(const file of files){

        const sql = fs.readFileSync(
            path.join(schemaFolder,file),
            "utf8"
        );

        try{
            await db.query(sql);
            console.log(`${file} True`);
        }
        catch(err){

            console.log(`${file} False`);
            console.log(err.message);
        }
    }
}

migrate();