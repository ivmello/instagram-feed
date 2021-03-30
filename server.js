const express = require('express');
const instagram = require('instagram-scraping');

const app = express();
const router = express.Router();
const PORT = 3000;

router.get('/', function(req, res) {
    res.json({
        data: 'bem-vindo'
    });
});

router.get('/user/:user', function(req, res) {
    const user = req.params.user;
    instagram.scrapeUserPage(user).then(result => {
        res.json(result);
    });
});

app.use(router);

app.listen(PORT, function(err) {
    console.log(`running on PORT ${PORT}`);
});