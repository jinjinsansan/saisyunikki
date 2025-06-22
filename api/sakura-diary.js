const express = require('express');
const cors = require('cors');
const { pool, initDatabase } = require('./sakura-database');

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// データベース初期化
initDatabase();

// ユーザー作成または取得
app.post('/api/users', async (req, res) => {
  try {
    const { line_username } = req.body;
    
    // 既存ユーザーチェック
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE line_username = ?',
      [line_username]
    );

    if (existingUsers.length > 0) {
      return res.json(existingUsers[0]);
    }

    // 新規ユーザー作成
    const [result] = await pool.execute(
      'INSERT INTO users (line_username) VALUES (?)',
      [line_username]
    );

    const [newUser] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    res.json(newUser[0]);
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    res.status(500).json({ error: 'ユーザー作成に失敗しました' });
  }
});

// 日記エントリー保存
app.post('/api/diary', async (req, res) => {
  try {
    const {
      line_username,
      date,
      emotion,
      event,
      realization,
      self_esteem_score,
      worthlessness_score
    } = req.body;

    // ユーザーID取得
    const [userResult] = await pool.execute(
      'SELECT id FROM users WHERE line_username = ?',
      [line_username]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    const userId = userResult[0].id;

    // 日記エントリー保存
    const [result] = await pool.execute(
      `INSERT INTO diary_entries 
       (user_id, date, emotion, event, realization, self_esteem_score, worthlessness_score)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, date, emotion, event, realization, self_esteem_score, worthlessness_score]
    );

    const [newEntry] = await pool.execute(
      'SELECT * FROM diary_entries WHERE id = ?',
      [result.insertId]
    );

    res.json(newEntry[0]);
  } catch (error) {
    console.error('日記保存エラー:', error);
    res.status(500).json({ error: '日記の保存に失敗しました' });
  }
});

// 日記エントリー取得
app.get('/api/diary/:line_username', async (req, res) => {
  try {
    const { line_username } = req.params;

    const [result] = await pool.execute(
      `SELECT de.*, u.line_username 
       FROM diary_entries de
       JOIN users u ON de.user_id = u.id
       WHERE u.line_username = ?
       ORDER BY de.date DESC`,
      [line_username]
    );

    res.json(result);
  } catch (error) {
    console.error('日記取得エラー:', error);
    res.status(500).json({ error: '日記の取得に失敗しました' });
  }
});

// カウンセラー用: 全ユーザーの日記取得
app.get('/api/admin/diary', async (req, res) => {
  try {
    const [result] = await pool.execute(
      `SELECT de.*, u.line_username 
       FROM diary_entries de
       JOIN users u ON de.user_id = u.id
       ORDER BY de.created_at DESC`
    );

    res.json(result);
  } catch (error) {
    console.error('管理者日記取得エラー:', error);
    res.status(500).json({ error: '日記の取得に失敗しました' });
  }
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sakura Server API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('さくらのサーバーで動作中');
});