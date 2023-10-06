const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DB,
    password: process.env.DB_PWD
});

connection.connect((err) => {
    if (err) throw err;
    console.log("db bağlantısı başarılı")
})


const app = express();

console.log(process.env.DB_HOST)

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("hi bro");
})

app.post("/ekle", (req, res) => {
    const { tarih, miktar, birim_fiyat } = req.body;
    connection.query("INSERT INTO islem_takip (tarih,miktar,birim_fiyat,tutar) values (?,?,?,?)", [tarih, miktar, birim_fiyat, miktar * birim_fiyat], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("kayit basarili")
        }
    })
})

app.get("/listele", async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM islem_takip', (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const toplam = await new Promise((resolve, reject) => {
            connection.query('SELECT sum(tutar) as toplam FROM islem_takip', (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        })

        // Burada veriler alındığında devam ediyoruz
        let liste = results;
        let toplamlar = toplam

        res.send({
            liste,
            toplam: toplamlar[0].toplam
        });
    } catch (err) {
        // Hata işleme kodu
        console.error(err);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
});


app.delete("/sil/:id", (req, res) => {
    const sql = "DELETE FROM islem_takip WHERE id = ?";
    let params = [req.params.id];
    connection.query(sql, params, (err, res) => {
        console.log("silme işlemi başarılı")
    })
})


app.put("/guncelle/:id", (req, res) => {
    const sql = "update islem_takip set tamamlandi = 'evet' where id = ?"
    let params = [req.params.id];
    connection.query(sql, params, (err, res) => {
        console.log("güncelleme işlemi başarılı işlemi başarılı")
    })
})

const PORT = 3001;

app.listen(PORT, () => console.log("http://localhost:" + PORT))