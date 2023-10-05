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
/*
app.get("/listele", (req, res) => {
    const sql = "select * from urunler";
    const toplam = sum();
    let params = [];
    db.all(sql, params, (err, rows) => {
        if (err) res.send("error var");
        res.json({
            message: "islem basarili",
            data: [...rows],
            toplam
        })
    })
})

const sum = () => {
    const sql = "select sum(tutar) as tutar from urunler";
    let params = [];
    db.all(sql, params, (err, rows) => {
        if (err) res.send("error var");
        return rows[0].tutar
    })
}*/

app.get("/listele", async (req, res) => {
    try {
        const sql = "SELECT * FROM urunler";
        const toplam = await sum();
        let params = [];
        const rows = await getQueryResult(sql, params);
        res.json({
            message: "İşlem başarılı",
            data: [...rows],
            toplam
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Bir hata oluştu" });
    }
});

const sum = async () => {
    try {
        const sql = "SELECT SUM(tutar) AS tutar FROM urunler";
        let params = [];
        const rows = await getQueryResult(sql, params);
        return rows[0].tutar;
    } catch (err) {
        throw err;
    }
};

const getQueryResult = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

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