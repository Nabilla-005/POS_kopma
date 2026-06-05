const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/produk", (req, res) => {
  const {
    nama_produk,
    kategori_id,
    harga_beli,
    harga_jual,
    stok,
    status
  } = req.body;

  const sql = `
    INSERT INTO produk
    (nama_produk, kategori_id, harga_beli, harga_jual, stok, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nama_produk,
      kategori_id,
      harga_beli,
      harga_jual,
      stok,
      status,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Produk berhasil ditambahkan",
      });
    }
  );
});

app.get("/dashboard", (req, res) => {
  res.json({
    totalPenjualan: 1000000,
    totalKeuntungan: 300000,
    totalTransaksi: 25,
    totalPelanggan: 10,
  });
});

app.get("/laporan", (req, res) => {
  res.json({
    penjualanBulanIni: 142500000,
    keuntunganBulanIni: 45200000,
    totalTransaksi: 1234,
    produkTerjual: 2847,
  });
});

app.get("/transaksi/stats", async (req, res) => {
  try {
    res.json({
      transaksiHariIni: 127,
      penjualanHariIni: 12500000,
      rataRataTransaksi: 98425,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.get("/produk", (req, res) => {
  const sql = `
    SELECT
      produk.kode_produk as id,
      produk.nama_produk as nama,
      kategori.nama_kategori as kategori,
      produk.harga_beli as hargaBeli,
      produk.harga_jual as hargaJual,
      produk.stok,
      produk.status
    FROM produk
    LEFT JOIN kategori
    ON produk.kategori_id = kategori.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});
app.listen(5000, () => {
  console.log("Server Running");
});