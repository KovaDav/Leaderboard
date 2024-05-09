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

function addRoster(){
    client.query("INSERT INTO Roster (rostername) VALUES('Inga');", (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            console.log('Query result:', result.rows);
        }
});  
}

function addCharacter(){
    client.query("INSERT INTO Character (rosterid, charactername, characterclass, main) VALUES('e47c6a8b-4aad-4818-9eba-611e149be37d','Ingabet', 'Gunslinger', 'true');", (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            console.log('Query result:', result.rows);
        }
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

function addToLeaderboard(){
    client.query(`INSERT INTO Leaderboard (characterid) VALUES('{"4d23defc-fe1f-4205-8150-884788f16afc",
    "6e6fad5a-5ef8-45f6-bd67-f608b547a5aa",
    "268d99f1-5778-48b9-bae3-85396efdaa8c",
    "6780cc2d-c29c-47ca-97a6-53388abafc6c",
    "64e2b50c-25ce-4f0f-9dd7-1256368a227f",
    "953de9ce-7c8f-4b6b-8569-72c00a8b05ef"}');`, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            console.log('Query result:', result.rows);
        }
});  
}



exports.getListOfPlayersMains = getListOfPlayersMains;
exports.getListOfPlayersAlts = getListOfPlayersAlts;
exports.getListOfSupports = getListOfSupports;