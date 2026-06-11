import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./pos_database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      namaBarang TEXT NOT NULL,
      jumlah INTEGER NOT NULL,
      hargaBeli REAL NOT NULL,
      hargaJual REAL NOT NULL,
      diskon REAL DEFAULT 0,
      pajak REAL DEFAULT 0,
      kasir TEXT NOT NULL,
      metodePembayaran TEXT NOT NULL,
      namaPelanggan TEXT NOT NULL,
      emailPelanggan TEXT,
      catatan TEXT,
      total REAL,
      createdAt TIMESTAMP DEFAULT (datetime('now','localtime')),
      updatedAt TIMESTAMP DEFAULT (datetime('now','localtime'))
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL UNIQUE,
      kategori TEXT NOT NULL,
      hargaBeli REAL NOT NULL,
      hargaJual REAL NOT NULL,
      stok INTEGER NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'tersedia',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      email TEXT,
      telepon TEXT,
      totalTransaksi INTEGER DEFAULT 0,
      totalBelanja REAL DEFAULT 0,
      tier TEXT DEFAULT 'regular',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables initialized');
}

// ===== TRANSACTION ENDPOINTS =====

// Get all transactions
app.get('/api/transactions', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single transaction
app.get('/api/transactions/:id', (req, res) => {
  db.get('SELECT * FROM transactions WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json(row);
  });
});

// Add transaction
app.post('/api/transactions', (req, res) => {
  const {
    namaBarang, jumlah, hargaBeli, hargaJual,
    diskon = 0, pajak = 0, kasir, metodePembayaran,
    namaPelanggan, emailPelanggan = '', catatan = '',
  } = req.body;

  if (!namaBarang || !jumlah || !hargaBeli || !hargaJual || !kasir || !metodePembayaran || !namaPelanggan) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const subtotal = jumlah * hargaJual;
  const totalDiskon = (subtotal * diskon) / 100;
  const totalPajak = ((subtotal - totalDiskon) * pajak) / 100;
  const total = subtotal - totalDiskon + totalPajak;

  // Cek apakah produk ada dan stok cukup
  db.get(`SELECT id, stok FROM products WHERE nama = ?`, [namaBarang], (err, product) => {
    if (err) { res.status(500).json({ error: err.message }); return; }

    if (product) {
      if (product.stok < jumlah) {
        res.status(400).json({ error: `Stok tidak cukup. Stok tersedia: ${product.stok}` });
        return;
      }
      // Kurangi stok
      const newStok = product.stok - jumlah;
      const newStatus = newStok === 0 ? 'habis' : 'tersedia';
      db.run(
        `UPDATE products SET stok = ?, status = ?, updatedAt = datetime('now','localtime') WHERE id = ?`,
        [newStok, newStatus, product.id]
      );
    }

    // Insert transaksi
    db.run(
      `INSERT INTO transactions (namaBarang, jumlah, hargaBeli, hargaJual, diskon, pajak, kasir, metodePembayaran, namaPelanggan, emailPelanggan, catatan, total, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now','localtime'), datetime('now','localtime'))`,
      [namaBarang, jumlah, hargaBeli, hargaJual, diskon, pajak, kasir, metodePembayaran, namaPelanggan, emailPelanggan, catatan, total],
      function(err) {
        if (err) { res.status(500).json({ error: err.message }); return; }
        res.status(201).json({ id: this.lastID, message: 'Transaction added successfully' });
      }
    );
  });
});

// Update transaction
app.put('/api/transactions/:id', (req, res) => {
  const { namaBarang, jumlah, hargaBeli, hargaJual, diskon = 0, pajak = 0, kasir, metodePembayaran, namaPelanggan, emailPelanggan = '', catatan = '' } = req.body;

  const subtotal = jumlah * hargaJual;
  const totalDiskon = (subtotal * diskon) / 100;
  const totalPajak = ((subtotal - totalDiskon) * pajak) / 100;
  const total = subtotal - totalDiskon + totalPajak;

  db.run(
    `UPDATE transactions SET namaBarang = ?, jumlah = ?, hargaBeli = ?, hargaJual = ?, diskon = ?, pajak = ?, kasir = ?, metodePembayaran = ?, namaPelanggan = ?, emailPelanggan = ?, catatan = ?, total = ?, updatedAt = datetime('now','localtime')
     WHERE id = ?`,
    [namaBarang, jumlah, hargaBeli, hargaJual, diskon, pajak, kasir, metodePembayaran, namaPelanggan, emailPelanggan, catatan, total, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }
      res.json({ message: 'Transaction updated successfully' });
    }
  );
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
  db.run('DELETE FROM transactions WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});

// ===== PRODUCT ENDPOINTS =====

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT rowid as id, * FROM products ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/products/low-stock', (req, res) => {
  db.all(
    `SELECT id, nama, kategori, stok FROM products WHERE stok <= 5 ORDER BY stok ASC`,
    (err, rows) => {
      if (err) { res.status(500).json({ error: err.message }); return; }
      res.json(rows);
    }
  );
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT rowid as id, * FROM products WHERE rowid = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
});


// Add product
app.post('/api/products', (req, res) => {
  const { nama, kategori, hargaBeli, hargaJual, stok = 0 } = req.body;

  if (!nama || !kategori || !hargaBeli || !hargaJual) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const status = stok > 0 ? 'tersedia' : 'habis';

  db.run(
    `INSERT INTO products (nama, kategori, hargaBeli, hargaJual, stok, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nama, kategori, hargaBeli, hargaJual, stok, status],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        message: 'Product added successfully',
      });
    }
  );
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const { nama, kategori, hargaBeli, hargaJual, stok } = req.body;
  const status = stok > 0 ? 'tersedia' : 'habis';

  db.run(
    `UPDATE products SET nama = ?, kategori = ?, hargaBeli = ?, hargaJual = ?, stok = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
     WHERE rowid = ?`,
    [nama, kategori, hargaBeli, hargaJual, stok, status, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE rowid = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// ===== CUSTOMER ENDPOINTS =====

// Get all customers
app.get('/api/customers', (req, res) => {
  db.all('SELECT rowid as id, * FROM customers ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single customer
app.get('/api/customers/:id', (req, res) => {
  db.get('SELECT rowid as id, * FROM customers WHERE rowid = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(row);
  });
});

// Add customer
app.post('/api/customers', (req, res) => {
  const { nama, email = '', telepon = '', tier = 'regular' } = req.body;

  if (!nama) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  db.run(
    `INSERT INTO customers (nama, email, telepon, tier)
     VALUES (?, ?, ?, ?)`,
    [nama, email, telepon, tier],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        message: 'Customer added successfully',
      });
    }
  );
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
  const { nama, email = '', telepon = '', tier = 'regular' } = req.body;

  db.run(
    `UPDATE customers SET nama = ?, email = ?, telepon = ?, tier = ?, updatedAt = CURRENT_TIMESTAMP
     WHERE rowid = ?`,
    [nama, email, telepon, tier, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json({ message: 'Customer updated successfully' });
    }
  );
});

// Delete customer
app.delete('/api/customers/:id', (req, res) => {
  db.run('DELETE FROM customers WHERE rowid = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});
