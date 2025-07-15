const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'appointments.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Read appointments
function readAppointments() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Write appointments
function writeAppointments(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Home page - list all
app.get('/', (req, res) => {
    const appointments = readAppointments();
    res.render('index', { appointments });
});

// Form to add new
app.get('/add', (req, res) => {
    res.render('form', { appointment: null });
});

// Save new appointment
app.post('/add', (req, res) => {
    const appointments = readAppointments();
    const newAppointment = {
        id: Date.now(),
        name: req.body.name,
        doctor: req.body.doctor,
        date: req.body.date,
        time: req.body.time,
    };
    appointments.push(newAppointment);
    writeAppointments(appointments);
    res.redirect('/');
});

// Edit form
app.get('/edit/:id', (req, res) => {
    const appointments = readAppointments();
    const appointment = appointments.find(a => a.id == req.params.id);
    res.render('form', { appointment });
});

// Update edited appointment
app.post('/edit/:id', (req, res) => {
    const appointments = readAppointments();
    const index = appointments.findIndex(a => a.id == req.params.id);
    if (index !== -1) {
        appointments[index] = {
            id: appointments[index].id,
            name: req.body.name,
            doctor: req.body.doctor,
            date: req.body.date,
            time: req.body.time,
        };
        writeAppointments(appointments);
    }
    res.redirect('/');
});

// Delete appointment
app.get('/delete/:id', (req, res) => {
    let appointments = readAppointments();
    appointments = appointments.filter(a => a.id != req.params.id);
    writeAppointments(appointments);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
