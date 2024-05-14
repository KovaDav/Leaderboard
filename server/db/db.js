const { Client } = require('pg');
const config = require('../.env')


const client = new Client({
	user: process.env.uName,
	password: process.env.password,
	host: process.env.host,
	port: process.env.port,
	database: process.env.database,
});


client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});

function createRosterTable(){
    client.query("CREATE TABLE Roster ( RosterID UUID PRIMARY KEY DEFAULT gen_random_uuid(), RosterName varchar(255) )", (err, result) => {
            if (err) {
                console.error('Error executing query', err);
            } else {
                console.log('Query result:', result.rows);
            }
    });  
}

function createCharacterTable(){
    client.query("CREATE TABLE Character ( CharacterID UUID PRIMARY KEY DEFAULT gen_random_uuid(), RosterID UUID, CharacterName varchar(255), CharacterClass varchar(255), Main boolean )", (err, result) => {
            if (err) {
                console.error('Error executing query', err);
            } else {
                console.log('Query result:', result.rows);
            }
    });  
}

function addRoster(rosterName, region){
return new Promise((resolve, reject) => {
    client.query(
    `INSERT INTO Roster (rostername, region) 
    VALUES('${rosterName}', '${region}')
    RETURNING rosterid;`
    ,   (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                reject(err); // Reject the promise with the error
            } else {
                console.log('OK', "OK")
                resolve(result.rows); // Resolve the promise with the query result
            }
        });
});
}

function addCharacter(rosterId, characterName, characterClass, main){
return new Promise((resolve, reject) => {
    client.query(
    `INSERT INTO Character (rosterid, charactername, characterclass, main)
    VALUES('${rosterId}','${characterName}', '${characterClass}', '${main}')
    RETURNING characterid;`
    ,   (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                reject(err); // Reject the promise with the error
            } else {
                console.log('OK', "OK")
                resolve(result.rows); // Resolve the promise with the query result
            }
        });
});
}

function createLeaderboardTable(){
    client.query("CREATE TABLE Leaderboard (LeaderboardID UUID PRIMARY KEY DEFAULT gen_random_uuid(), characterID UUID[]);", (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            console.log('Query result:', result.rows);
        }
});  
}

function getListOfPlayersMains(leaderboardID) {
    return new Promise((resolve, reject) => {
        client.query(`
            SELECT 
                leaderboard.leaderboardid,
                character.charactername,
                character.main
            FROM leaderboard
            JOIN character ON character.characterid = ANY (leaderboard.characterid)
            WHERE leaderboard.leaderboardid = '${leaderboardID}'
            AND character.main = true;`,
            (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err); // Reject the promise with the error
                } else {
                    resolve(result.rows); // Resolve the promise with the query result
                }
            });
    });
}

function getListOfPlayersAlts(leaderboardID) {
    return new Promise((resolve, reject) => {
        client.query(`
            SELECT 
                leaderboard.leaderboardid,
                character.charactername,
                character.main
            FROM leaderboard
            JOIN character ON character.characterid = ANY (leaderboard.characterid)
            WHERE leaderboard.leaderboardid = '${leaderboardID}'
            AND character.main = false;`,
            (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err); // Reject the promise with the error
                } else {
                    console.log('OK', "OK")
                    resolve(result.rows); // Resolve the promise with the query result
                }
            });
    });
}

function getListOfSupports(leaderboardID) {
    return new Promise((resolve, reject) => {
        client.query(`
            SELECT 
                leaderboard.leaderboardid,
                character.charactername,
                character.main
            FROM leaderboard
            JOIN character ON character.characterid = ANY (leaderboard.characterid)
            WHERE leaderboard.leaderboardid = '${leaderboardID}'
            AND character.characterclass = 'Bard'
			OR character.characterclass = 'Paladin'
			OR character.characterclass = 'Artist';`,
            (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err); // Reject the promise with the error
                } else {
                    console.log('OK', "OK")
                    resolve(result.rows); // Resolve the promise with the query result
                }
            });
    });
}

function addLeaderboard(listOfCharacterId){ 
return new Promise((resolve, reject) => {
    client.query(`INSERT INTO Leaderboard (characterid) 
    VALUES('{${listOfCharacterId.join(',')}}')
    RETURNING leaderboardid;`
     ,   (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            reject(err); // Reject the promise with the error
        } else {
            resolve(result.rows); // Resolve the promise with the query result
        }
    });
});
}

function addToRecord(id, dps, support, boss, difficulty, date){
    return new Promise((resolve, reject) => {
    client.query(`INSERT INTO record (characterid, dps, support, boss, difficulty, date)
     VALUES('${id}', '${dps}', '${support}', '${boss}', '${difficulty}', '${date}');`
     ,   (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            reject(err); // Reject the promise with the error
        } else {
            resolve(result.rows); // Resolve the promise with the query result
        }
    });
});  
}

function findCharacterById(id){
    client.query(`SELECT charactername 
    FROM character 
    WHERE characterid = '${id}'`
    , (err, result) => {
        if(err){
            console.log('Error executing query', err);
        } else{
            console.log('Query result:', result.rows);
        }
});
}

function findCharacterIdByName(name){
return new Promise((resolve, reject) => {
    client.query(`SELECT characterid 
    FROM character 
    WHERE charactername = '${name}'`
    ,   (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
});
}

function recordById(id, boss, difficulty){
    return new Promise((resolve, reject) => {
        client.query(`SELECT * 
        FROM record 
        WHERE characterid = '${id}'
        AND boss = '${boss}'
        AND difficulty = '${difficulty}'`
        ,   (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
    });
    }


exports.getListOfPlayersMains = getListOfPlayersMains;
exports.getListOfPlayersAlts = getListOfPlayersAlts;
exports.getListOfSupports = getListOfSupports;
exports.findCharacterIdByName = findCharacterIdByName;
exports.addToRecord = addToRecord;
exports.recordById = recordById;
exports.addRoster = addRoster;
exports.addCharacter = addCharacter;
exports.addLeaderboard = addLeaderboard;