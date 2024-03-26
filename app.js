const puppeteer = require('puppeteer');

async function starFarm() {
    const id = '/*YOUR ID*/';
    const pass = '/*YOUR PASSWORD*/';
    const Process = true;//set false if want to see browser window
    let farming = true;
    let countRound = 0;

    const browser = await puppeteer.launch({ headless: Process });
    const page = await browser.newPage();
    await console.log('::Program is starting::');
    await page.goto('https://www.showroom-live.com',{
        waitLoad: true, 
        waitNetworkIdle: true
    });
    await page.setViewport({ width: 1500, height: 700 });
    await page.click('#js-side-box > div > div > ul > li:nth-child(2) > a');
    try {
        page.evaluate((a, b) => {
            document.querySelector('#js-login-form > div:nth-child(2) > div:nth-child(1) > input').value = a;
            document.querySelector('#js-login-form > div:nth-child(2) > div:nth-child(2) > input').value = b;
            document.querySelector('#js-login-submit').click();
        }, id, pass);
        await page.waitForNavigation();
        await console.log('Login complete');
    } catch (error) {
        console.log('cant login');
    }
    
    try {
        while (farming) {
            if (countRound > 0) {
                await page.waitForSelector(
                    '#js-content-live-menu > li:nth-child(2)',
                    true,
                );
            }
            page.click('#js-content-live-menu > li:nth-child(2)');
           
            let room = '#js-content-live > div:nth-child(3) > ul > li:nth-child(' + (countRound + 1) + ') > div > div > div.listcard-image > div.listcard-overview > div > a:nth-child(1) > span';
            await page.waitForSelector(
                room,
                true,
            );
            page.click(room);

            await page.waitForSelector(
                '#room-gift-item-list > li:nth-child(1) > div',
                true,
            );

            try {
                const roomName = await page.$eval('#room-header > div > div.room-header-user-info > h1', (name) => {
                    return name.innerHTML;
                });
                await console.log('\n get in: '+ roomName + 'room');
            
                const star = await page.$eval('#room-gift-item-list > li:nth-child(5) > div', (element) => {
                    count = element.innerHTML.split(' ');
                    return count[1];
                });
                await console.log('current star: ' + star);
                if (star == 99) {
                    console.log('farm complete');
                    farming = false;
                    break;
                }
            } catch (error) {
                continue;
            }

            await page.click('#icon-room-twitter-post > span');
            await page.click('#twitter-post-button');
            await console.log('Tweet :' + (countRound + 1));

            var twirlTimer = (function () {
                var P = ["\\", "|", "/", "-"];
                var x = 0;
                return setInterval(function () {
                    process.stdout.write("\r waiting " + P[x++]);
                    x &= 3;
                }, 250);
            })();

            await page.waitFor(35000).then(
                () => {
                    clearInterval(twirlTimer);
                }
            );

            await page.click('#icon-room-menu');
            await page.waitFor(2000);
            await page.hover('#js-side-box');
            await page.waitFor(2000);
            await page.click('#js-side-box > ul > li:nth-child(1) > a > span.text');
            countRound++;
        }
    } catch (error) {
        console.log('something went wrong, Run program again');
    }
    await browser.close();
}

starFarm();
