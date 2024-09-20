const express = require('express');
const app = express();
const axios = require('axios');
const { Pool } = require("pg");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const { api } = require('./api')
app.use(api);

const port = 3000


const pg = new Pool({
    host: "localhost",
    user: 'postgres',
    password: "1234",
    database: "154499",
    port: 5432
});
app.use(express.json());


app.use('/', express.static('www'))

app.get("/api/", (req, res) => {
    res.send("OK")
})


// const fc = require("./api")
// const { api, a, b, c } = require("./api")
// app.use(api)
app.get("/api/database/", (req, res) => {
    let sql = `SELECT id, station, date, time, image_name, aod::float FROM db_data ORDER BY date, time`;
    pg.query(sql)
        .then(r => {
            console.log(r.rows);
            res.status(200).json(r.rows)
        })
})


app.get("/api/aod/lastupdate/:station", (req, res) => {
    const { station } = req.params;
    const sql = `SELECT id, station, date, time, image_name, aod::float FROM db_data WHERE station = $1 ORDER BY date DESC, time DESC LIMIT 1`;

    pg.query(sql, [station])
        .then(r => {
            if (r.rows.length > 0) {
                res.status(200).json(r.rows[0]);
            } else {
                res.status(404).json({ error: 'No data found.' });

            }
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        });
});

app.get("/api/aod/difference/:station", (req, res) => {
    const { station } = req.params;
    const sql = `
    WITH LastTwo AS (
    SELECT id, station, date, time, image_name, aod::float
    FROM db_data
    WHERE station = $1
    ORDER BY date DESC, time DESC
    LIMIT 2
)
SELECT
    L1.station,
    (L1.aod - L2.aod) AS difference,
    (ABS((L1.aod - L2.aod) / L2.aod * 100)) AS percentage_difference
FROM
    (SELECT station, aod FROM LastTwo LIMIT 1 OFFSET 0) AS L1,
    (SELECT aod FROM LastTwo LIMIT 1 OFFSET 1) AS L2;
    `;

    pg.query(sql, [station])
        .then(r => {
            if (r.rows.length > 0) {
                res.status(200).json(r.rows[0]);
            } else {
                res.status(404).json({ error: 'No data found.' });

            }
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        });
});



app.get("/api/aod/:station/daily", (req, res) => {
    const { station } = req.params;
    const validStations = [6, 20, 106, 2004, 4439];

    if (!validStations.includes(parseInt(station))) {
        res.status(400).json({ error: 'Invalid station' });
        return;
    }

    const formatDate = (date) => {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    let date = new Date();
    let dateToday = formatDate(date);

    const sql = 'SELECT station, date, time, image_name, aod::float FROM db_data WHERE station = $1 AND date = $2 ORDER BY date, time';
    pg.query(sql, [station, dateToday])
        .then(r => {
            if (r.rows.length > 0) {
                res.status(200).json(r.rows);
            } else {
                res.status(404).json({ error: 'No data found.' });
            }
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        });
});




app.get("/api/aod/:station/avg/daily", (req, res) => {
    const { station } = req.params;
    const validStations = [6, 20, 106, 2004, 4439];

    if (!validStations.includes(parseInt(station))) {
        res.status(400).json({ error: 'Invalid station' });
        return;
    }


    const sql = `SELECT station, date, ROUND(AVG(aod), 2) AS avg_aod FROM db_data WHERE station = $1 AND (CAST(date AS date) BETWEEN CURRENT_DATE - INTERVAL '6 day' AND CURRENT_DATE) GROUP BY date, station ORDER BY date ASC;`


    pg.query(sql, [station])
        .then(r => {
            if (r.rows.length > 0) {
                res.status(200).json(r.rows);
            } else {
                res.status(404).json({ error: 'No data found.' });
            }
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        });
});




app.get("/api/select/:date/:station", (req, res) => {
    const { station, date } = req.params;
    const validStations = [6, 20, 106, 2004, 4439];

    if (!validStations.includes(parseInt(station))) {
        res.status(400).json({ error: 'Invalid station' });
        return;
    }

    const sql = `SELECT station, date, time, image_name, aod::float FROM db_data WHERE station = $1 AND date = $2 ORDER BY date DESC, time DESC;`;

    pg.query(sql, [station, date])
        .then(r => {
            if (r.rows.length > 0) {
                res.status(200).json(r.rows);
            } else {
                res.status(404).json({ error: 'No data found.' });
            }
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        });
});






app.get("/api/aod/avg/:station/:datestart/:dateend", (req, res) => {
    const { station, datestart, dateend } = req.params;
    const validStations = [6, 20, 106, 2004, 4439];

    if (!validStations.includes(parseInt(station))) {
        res.status(400).json({ error: 'Invalid station' });
        return;
    }

    const sql = `
        SELECT station, date, ROUND(AVG(aod), 2) AS avg_aod
        FROM db_data
        WHERE station = $1 AND date BETWEEN $2 AND $3
        GROUP BY station, date
        ORDER BY date ASC;
    `;



    pg.query(sql, [parseInt(station), datestart, dateend])
        .then(r => {
            if (r.rows.length > 0) {
                res.status(200).json(r.rows);
            } else {
                res.status(404).json({ error: 'No data found.' });
            }
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        });
});






// dashboard
// app.get("/api/aod/hour/allstation/:datestart/:dateend", (req, res) => {
//     const { datestart, dateend } = req.params;

//     // const sql = `
//     //     SELECT station, date, time, image_name, ROUND(aod, 2) AS aod
//     //     FROM db_data
//     //     WHERE date::date BETWEEN $1 AND $2
//     //     ORDER BY date ASC;
//     // `;

//     const sql = `
//         SELECT station, date, time, image_name, ROUND(aod, 2) AS aod FROM db_data WHERE date BETWEEN $1 AND $2 ORDER BY date, time;
//     `;

//     pg.query(sql, [datestart, dateend])
//         .then(r => {
//             if (r.rows.length > 0) {
//                 res.status(200).json(r.rows);
//             } else {
//                 res.status(404).json({ error: 'No data found.' });
//             }
//         })
//         .catch(error => {
//             console.error('Error executing query', error.stack);
//             res.status(500).json({ error: 'An error occurred while fetching data.' });
//         });
// });



app.get("/api/aod/hour/allstation/:datestart", (req, res) => {
    const { datestart } = req.params;

    // const sql = `
    //     SELECT station, date, time, image_name, ROUND(aod, 2) AS aod
    //     FROM db_data
    //     WHERE date::date BETWEEN $1 AND $2
    //     ORDER BY date ASC;
    // `;

    const sql = `
        SELECT station, date, time, image_name, ROUND(aod, 2) AS aod FROM db_data WHERE date = $1 ORDER BY date, time;
    `;

    pg.query(sql, [datestart])
        .then(r => {
            if (r.rows.length > 0) {
                res.status(200).json(r.rows);
            } else {
                res.status(404).json({ error: 'No data found.' });
            }
        })
        .catch(error => {
            console.error('Error executing query', error.stack);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        });
});




app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})


