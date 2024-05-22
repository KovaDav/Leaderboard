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




function addCharacter(characterName, characterClass, main, region){
return new Promise((resolve, reject) => {
    client.query(
    `INSERT INTO Character (name, class, main, region)
    VALUES ('${characterName}', '${characterClass}', '${main}', '${region}')
    RETURNING id;`
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

function addLeaderboard(){ 
return new Promise((resolve, reject) => {
    client.query(`INSERT INTO leaderboard DEFAULT VALUES RETURNING id;`
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

function addCharactersToLeaderboard(leaderboardid, characters){ 
    return new Promise((resolve, reject) => {
        if (characters.length === 0) {
            resolve([]);
            return;
        }

        const values = characters.map((characterid, index) => `($1, $${index + 2})`).join(", ");
        const query = `INSERT INTO leaderboard_character (leaderboardid, characterid) VALUES ${values}`;

        const params = [leaderboardid, ...characters];

        client.query(query, params, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                reject(err); // Reject the promise with the error
            } else {
                resolve(result.rows); // Resolve the promise with the query result
            }
        });
    });
    }

function addToRecord(id, dps, support, boss, difficulty){
    return new Promise((resolve, reject) => {
    client.query(`INSERT INTO record (characterid, bossname, difficulty, dps, support)
     VALUES('${id}', '${boss}', '${difficulty}', '${dps}', '${support}');`
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

function updateRecordById(id, dps, support, boss, difficulty, date){
    return new Promise((resolve, reject) => {
    client.query(`UPDATE record
    SET  
    dps = '${dps}',
    support = '${support}',
    date = '${date}'
    WHERE characterid = '${id}'
    AND boss = '${boss}'
    AND difficulty = '${difficulty}';`
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
    client.query(`SELECT name 
    FROM character 
    WHERE id = '${id}'`
    , (err, result) => {
        if(err){
            console.log('Error executing query', err);
        } else{
            console.log('Query result:', result.rows);
        }
});
}


function findCharacterIdByName(name, region){
return new Promise((resolve, reject) => {
    client.query(`SELECT id 
    FROM character 
    WHERE name = '${name}'
    AND region = '${region}';
    `
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

function characterExists(name, region){
        return new Promise((resolve, reject) => {
            client.query(`
            SELECT EXISTS (
                SELECT 1
                FROM character
                WHERE name = '${name}'
                AND region = '${region}'
            );
            `
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

    function getTop3(idList){
        return new Promise((resolve, reject) => {
            const idString = idList.map(id => `'${id}'`).join(', ');
            client.query(`WITH ranked_records AS (
                SELECT
                    r.characterid,
                    r.dps,
                    r.support,
                    r.boss,
                    r.difficulty,
                    r.date,
                    ROW_NUMBER() OVER (PARTITION BY r.boss, r.difficulty ORDER BY r.dps DESC) AS rank,
                    c.charactername  -- Include charactername from the character table
                FROM
                    record r
                JOIN
                    character c ON r.characterid = c.characterid  -- Join with the character table
                WHERE
                    r.characterid IN (${idString})
            )
            SELECT
                characterid,
                charactername,
                dps,
                support,
                boss,
                difficulty,
                date
            FROM
                ranked_records
            WHERE
                rank <= 3
            ORDER BY
                boss,
                difficulty,
                rank;`
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

    function getCharacterListOfLeaderboardMainOrAlt(leaderboardId, main){
        return new Promise((resolve, reject) => {
            client.query(`SELECT
            c.characterid,
            c.charactername,
            c.characterclass,
            c.main,
            c.region,
            c.rostername
        FROM
            leaderboard l
        JOIN
            unnest(l.characterid) AS lcharacterid ON TRUE
        JOIN
            character c ON lcharacterid = c.characterid
        WHERE
            l.leaderboardid = '${leaderboardId}'
            AND c.main = '${main}';`
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

    function getCharacterListOfLeaderboard(leaderboardId){
        return new Promise((resolve, reject) => {
            client.query(`SELECT
            c.characterid,
            c.charactername,
            c.characterclass,
            c.main,
            c.region,
            c.rostername
        FROM
            leaderboard l
        JOIN
            unnest(l.characterid) AS lcharacterid ON TRUE
        JOIN
            character c ON lcharacterid = c.characterid
        WHERE
            l.leaderboardid = '${leaderboardId}';`
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
exports.addCharacter = addCharacter;
exports.addLeaderboard = addLeaderboard;
exports.updateRecordById = updateRecordById;
exports.getTop3 = getTop3;
exports.getCharacterListOfLeaderboardMainOrAlt = getCharacterListOfLeaderboardMainOrAlt;
exports.getCharacterListOfLeaderboard = getCharacterListOfLeaderboard;
exports.characterExists = characterExists;
exports.addCharactersToLeaderboard = addCharactersToLeaderboard;