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


    function addCharacter(characterName, characterClass, region) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO Character (name, class, region)
                VALUES ($1, $2, $3, $4)
                RETURNING id;
            `;
            const values = [characterName, characterClass, region];
    
            client.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err); // Reject the promise with the error
                } else {
                    resolve(result.rows); // Resolve the promise with the query result
                }
            });
        });
    }

    function login(username) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM users WHERE username = $1`;
            const values = [username];
    
            client.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err); // Reject the promise with the error
                } else {
                    resolve(result.rows); // Resolve the promise with the query result
                }
            });
        });
    }

    function serialize(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM users WHERE id = $1`;
            const values = [id];
    
            client.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err); // Reject the promise with the error
                } else {
                    resolve(result.rows); // Resolve the promise with the query result
                }
            });
        });
    }

    function register(username, hashedPassword) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
            const values = [username, hashedPassword];
    
            client.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err); // Reject the promise with the error
                } else {
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

function createLeaderboard(userId){ 
return new Promise((resolve, reject) => {
    const query =`INSERT INTO leaderboard (userid) VALUES ($1) RETURNING id;`
    const values = [userId];
    client.query(query, values
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

function addCharactersToLeaderboard(leaderboardid, characters) { 
    return new Promise((resolve, reject) => {
        if (characters.size === 0) {
            resolve([]);
            return;
        }

        const values = [];
        const params = [leaderboardid];
        let paramIndex = 2;

        characters.forEach((main, characterid) => {
            values.push(`($1, $${paramIndex}, $${paramIndex + 1})`);
            params.push(main, characterid);
            paramIndex += 2;
        });

        const query = `INSERT INTO leaderboard_character (leaderboardid, main, characterid) VALUES ${values.join(", ")}`;

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

function addToRecord(id, dps, support, boss, difficulty, cleardate){
    return new Promise((resolve, reject) => {
    client.query(`INSERT INTO record (characterid, bossname, difficulty, dps, support, cleardate)
     VALUES('${id}', '${boss}', '${difficulty}', '${dps}', '${support}', '${cleardate}');`
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

function updateRecordById(dps, name, boss, difficulty, support, cleardate) {
    return new Promise((resolve, reject) => {
        const query = `
        UPDATE record
        SET dps = $1,
        support = $5,
        cleardate = $6
        WHERE characterid = (
            SELECT id
            FROM character
            WHERE name = $2
        )
        AND bossname = $3
        AND difficulty = $4
        AND dps < $1;
        `;
        const values = [dps, name, boss, difficulty, support, cleardate];

        client.query(query, values, (err, result) => {
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
                resolve(result);
            }
        });
});
}

function addCharacterToUser(userId, characterId){
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO user_characters (user_id, character_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, character_id) DO NOTHING;
        `;
        const values = [userId, characterId];

        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                reject(err); // Reject the promise with the error
            } else {
                resolve(result.rows); // Resolve the promise with the query result
            }
        });
    });
}

function deleteCharacterFromUser(userId, characterId){
    return new Promise((resolve, reject) => {
        const query = `
        DELETE FROM user_characters 
        WHERE user_id = $1
        AND character_id = $2;
        `;
        const values = [userId, characterId];

        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                reject(err); // Reject the promise with the error
            } else {
                resolve(result.rows); // Resolve the promise with the query result
            }
        });
    });
}

function getCharactersOfUser(userId){
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
    c.name AS name,
    c.class AS class,
    c.region AS region
FROM
    user_characters uc
JOIN
    character c ON uc.character_id = c.id
WHERE
    uc.user_id = $1;
        `;
        const values = [userId];

        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                reject(err); // Reject the promise with the error
            } else {
                resolve(result.rows); // Resolve the promise with the query result
            }
        });
    });
}

function getLeaderboardsThatContainUser(userId){
    return new Promise((resolve, reject) => {
        const query = `
        SELECT DISTINCT
    lc.leaderboardid
FROM
    user_characters uc
JOIN
    leaderboard_character lc ON uc.character_id = lc.characterid
WHERE
    uc.user_id = $1;
        `;
        const values = [userId];

        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                reject(err); // Reject the promise with the error
            } else {
                resolve(result.rows); // Resolve the promise with the query result
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

function getTop3PerformersByDPS(leaderboardid, main) {
            return new Promise((resolve, reject) => {
                const query = `
                WITH ranked_records AS (
                    SELECT
                        c.name AS charactername,
                        rc.dps,
                        rc.support,
                        rc.bossname,
                        rc.difficulty,
                        rc.date,
                        ROW_NUMBER() OVER (PARTITION BY rc.bossname, rc.difficulty ORDER BY rc.dps DESC) AS rank
                    FROM
                        leaderboard_character lc
                    JOIN
                        record rc ON lc.characterid = rc.characterid
                    JOIN
                        character c ON rc.characterid = c.id
                    WHERE
                        lc.leaderboardid = $1
                        AND lc.main = $2
                )
                SELECT
                    rr.charactername,
                    rr.dps,
                    rr.support,
                    rr.bossname,
                    rr.difficulty,
                    rr.date
                FROM
                    ranked_records rr
                WHERE
                    rr.rank <= 3
                ORDER BY
                    rr.bossname,
                    rr.difficulty,
                    rr.rank;
                
                `;
                const values = [leaderboardid, main];
        
                client.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error executing query', err);
                        reject(err); // Reject the promise with the error
                    } else {
                        resolve(result.rows); // Resolve the promise with the query result
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

    function getCharacterListOfLeaderboard(leaderboardid) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT
            c.name AS charactername,
            r.bossname,
            r.difficulty,
            r.dps
        FROM
            leaderboard_character lc
        JOIN
            character c ON lc.characterid = c.id
        LEFT JOIN
            record r ON r.characterid = c.id
        WHERE
            lc.leaderboardid = $1
            AND c.class NOT IN ('Bard', 'Artist', 'Paladin')
        GROUP BY
            c.name, r.bossname, r.difficulty, r.dps
        ORDER BY
            r.bossname, r.difficulty, r.dps DESC;
            `;
            const values = [leaderboardid];
    
            client.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    reject(err); // Reject the promise with the error
                } else {
                    resolve(result.rows); // Resolve the promise with the query result
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
exports.createLeaderboard = createLeaderboard;
exports.updateRecordById = updateRecordById;
exports.getTop3PerformersByDPS = getTop3PerformersByDPS;
exports.getCharacterListOfLeaderboardMainOrAlt = getCharacterListOfLeaderboardMainOrAlt;
exports.getCharacterListOfLeaderboard = getCharacterListOfLeaderboard;
exports.characterExists = characterExists;
exports.addCharactersToLeaderboard = addCharactersToLeaderboard;
exports.login = login;
exports.serialize = serialize;
exports.register = register;
exports.addCharacterToUser = addCharacterToUser;
exports.getCharactersOfUser = getCharactersOfUser;
exports.deleteCharacterFromUser = deleteCharacterFromUser;
exports.getLeaderboardsThatContainUser = getLeaderboardsThatContainUser;