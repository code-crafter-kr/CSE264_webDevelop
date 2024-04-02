// Sehyoun Jang
// sej324@lehigh.edu

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.static('public'));

// Get the list of artists API
app.get('/artists', (req, res) => {
    const db = new sqlite3.Database('top40.db');
    db.all('SELECT DISTINCT artist FROM songlist ORDER BY artist', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            const artists = rows.map(row => row.artist);
            res.json(artists);
        }
        db.close();
    });
});

// Get the list of songs API
app.get('/songs', (req, res) => {
    const artist = req.query.artist;
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;

    const db = new sqlite3.Database('top40.db');
    let sql = 'SELECT * FROM songlist';
    const params = [];

    if (artist) {
        sql += ' WHERE artist = ?';
        params.push(artist);
    }

    if (keyword) {
      sql += artist ? ' AND' : ' WHERE';
      sql += ' (title LIKE ? OR artist LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
  }

    db.all(`${sql} LIMIT ? OFFSET ?`, [...params, perPage, (page - 1) * perPage], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            db.get(`SELECT COUNT(*) AS total FROM (${sql})`, params, (err, row) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.json({
                        songs: rows,
                        total: row.total
                    });
                }
                db.close();
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});