import React, { useState } from 'react';
const initSqlJs = require('sql.js');

const LeaderboardGrid = ({ title, mains }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [SQL, setSQL] = useState(null);

    // Initialize SQL.js when the component mounts
    useState(() => {
        initSqlJs({
            // Required to load the wasm binary asynchronously.
            locateFile: file => `https://sql.js.org/dist/${file}`
        }).then(sql => {
            setSQL(sql);
        }).catch(err => {
            setError(err);
        });
    }, []);

    const changeHandler = (e) => {
        if (!SQL) {
            setError("SQL.js is not initialized");
            return;
        }

        const file = e.target.files[0];
        if (!file) {
            setError("No file selected");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const buffer = reader.result;
            const db = new SQL.Database(new Uint8Array(buffer));
            query(db);
        };
        reader.onerror = (err) => {
            setError(err);
        };
        reader.readAsArrayBuffer(file);
    };

    const query = (db) => {
        if (!db) {
            setError("Database is not initialized");
            return;
        }

        console.log(db.exec(`SELECT name, dps FROM entity where name = 'Lyndoniel' and encounter_id IN (
            SELECT id FROM encounter WHERE json_extract(misc, '$.partyInfo') like '%"Lyndoniel"%' AND current_boss = 'Veskal' AND json_extract(misc, '$.raidClear') = true)
            order by dps desc limit 1`));
    };

    return (
        <>
            <input className='description' type="file" name="file" onChange={changeHandler} />
            {error && <div>Error: {error}</div>}
        </>
    );
};

export default LeaderboardGrid;
