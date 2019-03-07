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

        for (let i=0; i < 0 ; i++) {
            
            await page.goto(`https://shopee.vn/shop/14440764/search?page=${i}&sortBy=sales`);
            await page.waitForSelector('.shop-search-result-view__item');    
            const sections = await page.$$('.shop-search-result-view__item');
            console.log(sections.length);
            
            for (let j=0; j < sections.length ; j++) {
                num++ ;
                await page.goto(`https://shopee.vn/shop/14440764/search?page=${i}&sortBy=sales`);
                await page.waitForSelector('.shop-search-result-view__item');
                const sections = await page.$$('.shop-search-result-view__item');
                const section =sections[j]
                
                await section.click();
                await sleep(800);

                await page.waitForSelector('.qaNIZv');     
                const name = await page.$eval('.qaNIZv', name => name.innerText);
                console.log(name);

                await page.waitForSelector('._3n5NQx');
                const price = await page.$eval('._3n5NQx', price => price.innerText);
                console.log(price.substr(1));

                await page.waitForSelector('._2u0jt9');
                const info = await page.$$('._2u0jt9');
                const _info = await info[0].$eval('span:first-child', span => span.innerText);
                console.log("info: "+_info);

                await page.waitForSelector('._1z1CEl');
                const cat = await page.$$('._1z1CEl');
                const category = await cat[1].$eval('a:last-child', a => a.href);          
                const category_id = category.slice(1+category.lastIndexOf('.'));
                 
                result.push({category_id:category_id,name:num+'. '+name,info:_info,price:price.substr(1)});
                                
                await page.waitForSelector('._2Fw7Qu');
                const hrefs = await page.evaluate(() => {
                    const anchors = document.querySelectorAll('._2Fw7Qu');
                    return [].map.call(anchors, function(e){
                        return e.getAttribute('style');
                    });
                  });

                var index=0;  
                for (const url of hrefs){
                    index=index+1;
                    if (url === null) continue;
                    
                    console.log(url.slice(1+url.indexOf('"'),url.lastIndexOf('"')));
                    console.log(name.indexOf("/"));
                    var spcKey = 20;
                    //special character
                    if (name.indexOf("/") != -1) spcKey = name.indexOf("/") ;
                    if ((name.indexOf('"') != -1)&(name.indexOf('"')<spcKey)) spcKey = name.indexOf('"') ;
                    if ((name.indexOf('-') != -1)&(name.indexOf('-')<spcKey)) spcKey = name.indexOf('-') ;
                    

                    download(url.slice(1+url.indexOf('"'),url.lastIndexOf('"')), `image/${num+'. '+name.substring(0,spcKey-1)+index}.png`, function(){
                    console.log(`saved image of ${name+index}`);
                    });
                }           
            }    
        }
        console.log('done');
        
        //await browser.close();
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

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
function download(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};