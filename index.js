const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db')
const cors = require("cors");

// db.serialize(() => {
//     db.run('CREATE TABLE lorem (info TEXT)')
//     const stmt = db.prepare('INSERT INTO lorem VALUES (?)')

//     for (let i = 0; i < 10; i++) {
//         stmt.run(`Ipsum ${i}`)
//     }

//     stmt.finalize()

//     db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
//         console.log(`${row.id}: ${row.info}`)
//     })
// })

// db.close()

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    /* db.run(`CREATE TABLE "urunler" (
         "id"	INTEGER UNIQUE,
         "tarih"	TEXT,
         "miktar"	INTEGER,
         "birim_fiyat"	REAL,
         "tutar"	REAL,
         PRIMARY KEY("id" AUTOINCREMENT)
     )`)*/
    res.send("db create");
})

app.post("/ekle", (req, res) => {
    const { tarih, miktar, birim_fiyat } = req.body;
    const stmt = db.prepare("INSERT INTO urunler (tarih,miktar,birim_fiyat,tutar) values (?,?,?,?)");
    stmt.run(tarih, miktar, birim_fiyat, miktar * birim_fiyat, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.send("kayıt başarılı")
        }
    })
})

app.get("/listele", (req, res) => {
    const sql = "select * from urunler";
    let params = [];
    db.all(sql, params, (err, rows) => {
        if (err) res.send("error var");
        res.json({
            message: "islem basarili",
            data: rows
        })
    })
})


app.delete("/sil/:id", (req, res) => {
    const sql = "DELETE FROM urunler WHERE id = ?";
    let params = [req.params.id];
    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ "error": res.message })
            return;
        } else {
            res.json({ "message": "deleted", changes: this.changes })
        }
    })
})

const PORT = 3001;

app.listen(PORT, () => console.log("http://localhost:" + PORT))