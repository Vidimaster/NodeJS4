const express = require('express');
const app = express();
const Joi = require('joi');
const userSchema = Joi.object({
    first_name: Joi.string().min(2).required(),
    second_name: Joi.string().min(3).required(),
    age: Joi.number().integer().required(),
    city: Joi.string().min(2)
})
const fs = require('fs');
const path = require('path');
let uniqueID = 1;
const usersListpath = path.join(__dirname, 'users.json');

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<h1>Main</h1> <p>Количество посещений:  </p> <br> <a href="/about">Go to About</a>`)

})

app.get('/users', (req, res) => {
    const usersJson = fs.readFileSync(usersListpath, 'utf-8');
    const usersData = JSON.parse(usersJson);
    res.send({ users: usersData })
})

app.get('/users/:id', (req, res) => {
    const usersJson = fs.readFileSync(usersListpath, 'utf-8');
    const usersData = JSON.parse(usersJson);
    const user = usersData.find((user) => user.id === Number(req.params.id));
    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({
            user: null,
            message: "No such User"
        });
    }

})

app.post('/users', (req, res) => {
    const validate = userSchema.validate(req.body);
    if (validate.error) {
        return res.status(404).send({ error: validate.error });
    }
    const usersJson = fs.readFileSync(usersListpath, 'utf-8');
    const usersData = JSON.parse(usersJson);
    uniqueID += 1;
    usersData.push({
        id: uniqueID,
        ...req.body
    });
    fs.writeFileSync(usersListpath, JSON.stringify(usersData));
    res.send({
        id: uniqueID
    });

})

app.put('/users/:id', (req, res) => {
    const validate = userSchema.validate(req.body);
    if (validate.error) {
        return res.status(404).send({ error: validate.error });
    }
    const usersJson = fs.readFileSync(usersListpath, 'utf-8');
    const usersData = JSON.parse(usersJson);
    const user = usersData.find((user) => user.id === Number(req.params.id));
    if (user) {
        user.first_name = req.body.first_name;
        user.second_name = req.body.second_name;
        user.age = req.body.age;
        user.city = req.body.city;
        fs.writeFileSync(usersListpath, JSON.stringify(usersData));
        res.send({ user });
    } else {
        res.status(404);
        res.send({
            user: null,
            message: "No such User"
        });
    }
})

app.delete('/users/:id', (req, res) => {
    const usersJson = fs.readFileSync(usersListpath, 'utf-8');
    const usersData = JSON.parse(usersJson);
    const userIndex = usersData.findIndex((user) => user.id === Number(req.params.id));
    if (userIndex > -1) {
        usersData.splice(userIndex, 1);
        fs.writeFileSync(usersListpath, JSON.stringify(usersData));
        res.send({ message: 'User is deleted' });
    } else {
        res.status(404);
        res.send({
            user: null,
            message: "No such User"
        });
    }
})

const port = 3000;

app.use((req, res) => {
    res.status(404).send({
        message: 'URL not found'
    })
})



app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
})