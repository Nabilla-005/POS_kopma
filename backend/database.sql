CREATE DATABASE IF NOT EXISTS pos_kopma;
USE pos_kopma;

CREATE TABLE kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL
);

INSERT INTO kategori (nama_kategori)
VALUES
('Elektronik'),
('Aksesoris'),
('Fashion'),
('Makanan');

CREATE TABLE produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_produk VARCHAR(20) UNIQUE,
    nama_produk VARCHAR(150) NOT NULL,
    kategori_id INT,
    harga_beli DECIMAL(12,2),
    harga_jual DECIMAL(12,2),
    stok INT DEFAULT 0,
    status ENUM('tersedia','habis','preorder'),

    FOREIGN KEY (kategori_id)
    REFERENCES kategori(id)
);

INSERT INTO produk
(kode_produk,nama_produk,kategori_id,harga_beli,harga_jual,stok,status)
VALUES
('PRD001','Laptop Asus ROG',1,15000000,18000000,5,'tersedia'),
('PRD002','Mouse Logitech MX Master',2,800000,1000000,15,'tersedia'),
('PRD003','Keyboard Mechanical',2,1200000,1500000,0,'habis'),
('PRD004','Mie',4,5000,70000,500,'tersedia');

CREATE TABLE pelanggan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_pelanggan VARCHAR(20) UNIQUE,
    nama VARCHAR(100),
    email VARCHAR(100),
    telepon VARCHAR(20)
);

INSERT INTO pelanggan
(kode_pelanggan,nama,email,telepon)
VALUES
('CST001','Budi Santoso','budi@email.com','08123456789'),
('CST002','Rina Wijaya','rina@email.com','08198765432');

CREATE TABLE transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_transaksi VARCHAR(30) UNIQUE,
    pelanggan_id INT,
    total DECIMAL(12,2),
    metode_pembayaran VARCHAR(50),
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (pelanggan_id)
    REFERENCES pelanggan(id)
);

CREATE TABLE detail_transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaksi_id INT,
    produk_id INT,
    qty INT,
    harga DECIMAL(12,2),
    subtotal DECIMAL(12,2),

    FOREIGN KEY (transaksi_id)
    REFERENCES transaksi(id),

    FOREIGN KEY (produk_id)
    REFERENCES produk(id)
);

CREATE TABLE toko (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_toko VARCHAR(150),
    alamat TEXT,
    telepon VARCHAR(20)
);

INSERT INTO toko
(nama_toko,alamat,telepon)
VALUES
(
'Kopma Itenas',
'Jl. KPH Hasan Mustopa No.23 Bandung',
'02112345678'
);