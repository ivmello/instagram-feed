require('dotenv').config()

const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const router = express.Router();
const PORT = 3000;

router.get('/', function(req, res) {
    res.json({
        data: 'API Instagram Scrapper'
    });
});

router.get('/user/:username', async function(req, res) {
    const username = req.params.username;

    const dateString = new Date();
    const dateToday = `${dateString.getFullYear()}-${dateString.getMonth() + 1}-${dateString.getDate()}-${dateString.getHours()}-${dateString.getMinutes()}`;

    try {
        if (fs.existsSync(`files/${dateToday}-${username}.json`)) {
            let rawdata = fs.readFileSync(`files/${dateToday}-${username}.json`);
            let result = JSON.parse(rawdata);
            return res.json(result)
        }
    } catch (err) {
        return res.json(err)
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: [
                '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
                '--user-data-dir=/tmp/user_data/',
                '--window-size=1200,800',
            ],
        });
        const page = await browser.newPage();

        /**
         * Login
         */
        await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: "networkidle0" });

        // verifica se existe a tela de login, se nao ele passa para o redirect
        try {
            const passwordInput = await page.waitForSelector('input[type="password"]', {
                timeout: 2000,
            });
            await page.click(`input[type="text"]`);
            await page.keyboard.type(process.env.INSTAGRAM_USER);
            await passwordInput.click('input[type="password"]');
            await page.keyboard.type(process.env.INSTAGRAM_PASS);
            await page.click(".L3NKy"); // clica para fazer login
            await page.click("button.sqdOP"); // fecha janela que pede para salvar login
            await page.waitForNavigation();
         } catch(error) {
            console.log('nao esta na tela de login');
         }

         /**
          * Navega ate o perfil
          */
        await page.goto(`https://www.instagram.com/${username}/`);
        const imgList = await page.evaluate(() => {
            const nodeList = document.querySelectorAll(".KL4Bh img");
            const imgArray = [...nodeList];
            const imgList = imgArray.map(({src}) => ({
                src
            }));
            return imgList;
        });

        fs.writeFile(`files/${dateToday}-${username}.json`, JSON.stringify(imgList, null, 2), err => {
            if (err) throw new Error('erro ao gerar o JSON');
            console.log('ok');
        });

        res.json(imgList);

        await browser.close();
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});

app.use(router);

app.listen(PORT, function(err) {
    console.log(`running on PORT ${PORT}`);
});