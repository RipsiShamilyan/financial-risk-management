require("dotenv").config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// app.use(cors({ origin: "http://localhost:3000" }));


// MySQL Connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database🍀');
});
// ----------------------------------------------------------------------------------------------------
// Գրանցում
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  // Վալիդացիա
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Բոլոր դաշտերը պարտադիր են' });
  }

  // Ստուգեք, արդյոք էլ-փոստը գոյություն ունի
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Տվյալների բազայի հարցման սխալ' });
    }
    if (result.length) {
      return res.status(400).json({ message: 'Այս էլ-փոստը արդեն գրանցված է' });
    }

    // Գաղտնաբառի մոդերացում
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Ավելացրեք նոր օգտվող
      db.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Database insertion error:', err); // Սխալը կոնսոլում
          return res.status(500).json({ message: 'Տվյալների բազայի մեջ մտցնելու սխալ' });
        }
        return res.status(201).json({ message: 'Գրանցումը հաջողվեց' });
      });
    } catch (error) {
      console.error('Password hashing error:', error);
      return res.status(500).json({ message: 'Գաղտնաբառի մոդերացման սխալ' });
    }
  });
});

// ------------------------------------------------------------------------------------------
// Օգտատիրոջ մուտք
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
          return res.status(401).json({ message: 'Սխալ email կամ գաղտնաբառ' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
          return res.status(401).json({ message: 'Սխալ email կամ գաղտնաբառ' });
      }
      res.status(200).json({ message: 'Մուտք հաջողվեց!', user_id: user.id }); // user_id -ի վերադարձման համար
  });
});


// ----------------------------------------------------------------------------------------------------

// Ստացեք օգտատիրոջ տվյալները (GET)
app.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query('SELECT username, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Տվյալների բազայի հարցման սխալ' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Օգտատեր չի գտնվել' });
    }
    return res.status(200).json(results[0]);
  });
});

app.put('/profile/:userId', async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.params.userId;

  // Check if email already exists
  db.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'The email is already in use' });
    }

    // Proceed with the update
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.query(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [username, email, hashedPassword, userId],
      (err, result) => {
        if (err) {
          console.error('Database update error:', err);
          return res.status(500).json({ message: 'Error updating user profile' });
        }
        return res.status(200).json({ message: 'Profile updated successfully' });
      }
    );
  });
});

// ----------------------------------------------------------------------------------------------------
// Ստեղծել նոր բյուջե (POST)
app.post('/budgeting', (req, res) => {
  const { user_id, income, expenses, budget } = req.body;

  // Ստուգեք տվյալները
  if (!user_id || !income || !expenses || budget === undefined) {
    return res.status(400).json({ message: 'Բոլոր դաշտերը պարտադիր են' });
  }

  // Տվյալների ավելացում MySQL-ում
  const query = 'INSERT INTO budgeting (user_id, income, expenses, budget) VALUES (?, ?, ?, ?)';
  db.query(query, [user_id, income, expenses, budget], (err, result) => {
    if (err) {
      console.error('Database insertion error:', err);
      return res.status(500).json({ message: 'Տվյալների բազայի սխալ' });
    }
    return res.status(201).json({ message: 'Տվյալները հաջողությամբ ավելացվեցին', id: result.insertId });
  });
});


// Ստացեք բյուջեի պատմությունը (GET)
app.get('/budgeting/:userId', (req, res) => {
  const userId = req.params.userId;

  db.query('SELECT * FROM budgeting WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Տվյալների բազայի հարցման սխալ' });
    }
    return res.status(200).json(results);
  });
});


// Update budget (PUT)
app.put('/budgeting/:id', (req, res) => {
  const { income, expenses, budget } = req.body;
  const id = req.params.id;

  db.query(
    'UPDATE budgeting SET income = ?, expenses = ?, budget = ? WHERE id = ?',
    [income, expenses, budget, id],
    (err, result) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ message: 'Error updating budget' });
      }
      return res.status(200).json({ message: 'Budget updated successfully' });
    }
  );
});

// Delete budget (DELETE)
app.delete('/budgeting/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM budgeting WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database deletion error:', err);
      return res.status(500).json({ message: 'Error deleting budget' });
    }
    return res.status(200).json({ message: 'Budget deleted successfully' });
  });
});


//----------------------------------------------------------------------------------

// Աշխատավարձի հաշվարկ API
app.post('/calculate-salary', async (req, res) => {
  const { grossSalary, currency, userId } = req.body;

  if (!grossSalary || isNaN(grossSalary) || grossSalary <= 0) {
    return res.status(400).json({ error: 'Սխալ աշխատավարձի տվյալ' });
  }

  let exchangeRate = 1;

  // Հարկերի հաշվարկ
  const incomeTax = grossSalary * 0.2;
  const socialTax = grossSalary * 0.05;
  const stampTax = 5500;
  let netSalary = grossSalary - (incomeTax + socialTax + stampTax);

  
  // Աշխատավարձի պահպանում MySQL-ում
  const sql = `INSERT INTO salaries (user_id, gross_salary, net_salary, income_tax, social_tax, stamp_tax, currency) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [userId, grossSalary, netSalary, incomeTax, socialTax, stampTax, currency], (err, result) => {
    if (err) {
      console.log("MySQL Error:", err);
      return res.status(500).json({ error: 'Տվյալների պահպանման սխալ' });
    }
    res.json({ netSalary, incomeTax,socialTax, stampTax   });
  });
});

app.get('/salary-history/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM salaries WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      
      return res.status(500).json({ error: 'Տվյալների բեռման սխալ' });
    }
    res.json(results);
  });
});

// ----------------------------------------------------------------------------------

app.post('/calculate-loan', (req, res) => {
  const { user_id, loan_amount, loan_term, interest_rate } = req.body;

  // Վարկի ամսական տոկոսադրույք (տոկոսը բաժանում ենք 12-ի, քանի որ տարեկան տոկոսադրույք է)
  const monthlyRate = interest_rate / 100 / 12;
  
  // Ամսական վճարման հաշվարկ
  const monthlyPayment = (loan_amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loan_term));

  // Ընդհանուր վճարված գումար
  const totalPayment = monthlyPayment * loan_term;

  // Տվյալները բազայում պահելու համար
  const sql = "INSERT INTO loans (user_id, loan_amount, loan_term, interest_rate, monthly_payment, total_payment) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [user_id, loan_amount, loan_term, interest_rate, monthlyPayment, totalPayment], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ monthlyPayment, totalPayment });
  });
});

//---------------------------------------------------------------------------------------------------

// Ռիսկի գնահատման հարցաշարի պահպանում
app.post("/risk-assessment/submit", async (req, res) => {
  const { user_id, total_score } = req.body;

  let risk_level = "low";
  if (total_score <= 6) risk_level = "high";
  else if (total_score <= 11) risk_level = "medium";

  try {
      const sql = "INSERT INTO risk_assessment (user_id, total_score, risk_level) VALUES (?, ?, ?)";
      db.query(sql, [user_id, total_score, risk_level], (error, result) => {
          if (error) {
              console.error("Error saving risk assessment:", error);
              return res.status(500).json({ success: false, message: "Database error" });
          }
          res.json({ success: true, risk_level });
      });
  } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

// Օգտատիրոջ վերջին գնահատման արդյունքը
app.get("/risk-assessment/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
      const sql = "SELECT * FROM risk_assessment WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
      db.query(sql, [user_id], (error, results) => {
          if (error) {
              console.error("Error fetching risk assessment:", error);
              return res.status(500).json({ message: "Database error" });
          }
          if (results.length > 0) {
              res.json(results[0]);
          } else {
              res.json({ message: "No risk assessment found" });
          }
      });
  } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Server error" });
  }
});


// Ռիսկի գնահատման հարցաշարի պահպանում
app.post("/risk-assessment/submit", async (req, res) => {
  const { user_id, total_score } = req.body;

  // Գոյություն ունեցող ռիսկի մակարդակի դասակարգում
  let risk_level = "low";
  if (total_score <= 6) risk_level = "բարձր";
  else if (total_score <= 11) risk_level = "medium";
  
  try {
    const sql = "INSERT INTO risk_assessment (user_id, total_score, risk_level) VALUES (?, ?, ?)";
    db.query(sql, [user_id, total_score, risk_level], (error, result) => {
      if (error) {
        console.error("Error saving risk assessment:", error);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, risk_level });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//-----------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
