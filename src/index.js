const puppeteer = require('puppeteer');
const url = 'https://www.drogueriascafam.com.co/69-ofertas-destacadas-del-mes?resultsPerPage=48';
const fs = require('fs');

(async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setViewport({
        width: 1200,
        height: 1200,
        deviceScaleFactor: 1,
      });

    await page.goto(url);
    new Promise(r => setTimeout(r, 7000));
    //await page.waitForTimeout(3000);

    /*
    const productos = await page.evaluate(() =>{
        const elements = document.querySelectorAll('.product-desc-wrap');
        const dataProducts = [];


        for (let index = 0; index < elements.length; index++) {
            var element = elements[index];
            var name = element.querySelector('.product-desc-wrap .name-product-list a').textContent;
            var price = element.querySelector('.product-price-and-shipping .price').firstChild.textContent.replace(/\s+/g, ''); 

             var tmp = {};
            tmp.name  = name;
            tmp.price = price;

            dataProducts.push(tmp);
        }

        return dataProducts;

    });
    */

    const productos = await page.$$eval('.product-desc-wrap', elements => {
        return elements.map(element => {
          const name = element.querySelector('.name-product-list a').textContent;
          const price = element.querySelector('.product-price-and-shipping .price').firstChild.textContent.replace(/\s+/g, '');
      
          return { name, price };
        });
      });
      
      console.log(productos);

      const csvData = productos.map(producto => `${producto.name},${producto.price}`).join('\n');
      fs.writeFileSync('productos.csv', 'Nombre,Precio\n' + csvData);
      
    await browser.close();
})();

