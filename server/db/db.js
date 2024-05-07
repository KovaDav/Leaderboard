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

//createRosterTable()
//createCharacterTable()
//addRoster()
addCharacter()