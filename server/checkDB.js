const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const users = await User.find({}, '-password');
    const students = await Student.find({});

    console.log('\n--- USERS ---');
    console.log(users.length === 0 ? 'No users found.' : JSON.stringify(users, null, 2));

    console.log('\n--- STUDENTS ---');
    console.log(students.length === 0 ? 'No students found.' : JSON.stringify(students, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDB();
