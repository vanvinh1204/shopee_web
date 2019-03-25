const puppeteer = require('puppeteer');
const fsex=require('fs-extra');
const fs = require('fs');
const request = require('request');
const express = require('express');

var app = express();
app.set('view engine', 'ejs');

app.listen(3000);
console.log('port 3000 is open');
var num=0;
var result = [];
(async function main() {
    try {
        const browser = await puppeteer.launch({ headless: false});
        const page = await browser.newPage();

        //sign in
        await page.goto(`https://banhang.shopee.vn/portal/product/list/unpublished?subtype=add_attribute`);
        await page.waitForSelector('input[type=text]');

        // await page.focus('input[type=text]')
        // await page.keyboard.type('China')

        // await page.focus('input[type=password]')
        // await page.keyboard.type('China')

        await page.evaluate(() => {
            document.querySelector('input[type=text]').value = '0901463561';
            document.querySelector('input[type=password]').value = 'Dinhtung89';
            
          });    

        // await page.evaluate(() => {
        

        // document.querySelector('.shopee-button--primary').click();
        
        // }); 

    }catch(e) {
        console.log('OUR ERRO:',e);
    }
})();

app.get('/result', function(req, res) {
    res.render('pages/shopee',{html:result});
});

app.get('/',function(req,res){
    res.render('pages/index');
    console.log(req);
});
