import path from 'path';
import { By, Builder, until, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import axios from 'axios';
import os from 'os'
import simpleGit from 'simple-git';

const git = simpleGit();

async function updateScript() {
    try {
        // Выполняем git pull для получения последних изменений
        const update = await git.pull();
        if (update && update.summary.changes) {
            console.log('Script is updated');
            process.exit(0); // Перезапуск процесса для применения изменений
        } else {
            console.log('No updates');
        }
    } catch (err) {
        console.error('Error while updating script', err);
    }
}

async function runSelenium(username, password, localUsername, vmIP) {
    try {
        await axios.patch(`https://ua.astrostar.chat/users/visibility/vm/${vmIP}/username/${localUsername}?flag=hide`);
        let options = new chrome.Options();
        options.addArguments('--kiosk');
        options.addArguments('--remote-debugging-port=9222');
        options.addArguments("--disable-features=SameSiteByDefaultCookies")
        options.addArguments("--disable-features=CookiesWithoutSameSiteMustBeSecure")
        options.addExtensions('./src/5.2.1_0.crx');
    
        let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

        await driver.get("chrome://extensions/");
        // await driver.executeScript(`
        //     let overlay = document.createElement('div');
        //     overlay.id = 'loading-overlay';
        //     overlay.style.position = 'fixed';
        //     overlay.style.top = '0';
        //     overlay.style.left = '0';
        //     overlay.style.width = '100vw';
        //     overlay.style.height = '100vh';
        //     overlay.style.backgroundColor = 'black';
        //     overlay.style.zIndex = '9999';
        //     overlay.style.display = 'flex';
        //     overlay.style.justifyContent = 'center';
        //     overlay.style.alignItems = 'center';
        
        //     let img = document.createElement('img');
        //     img.src = 'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif';  // Замените на URL вашего изображения
        //     img.style.width = '100px'; // Измените размер изображения загрузки по необходимости
        //     overlay.appendChild(img);
        
        //     document.body.appendChild(overlay);
        // `);
    
        await driver.executeScript(`
            let switchElement = document.querySelector('extensions-manager').shadowRoot
            .querySelector('extensions-toolbar').shadowRoot
            .querySelector('#devMode');
            if (switchElement) {
                switchElement.click();
            }
        `);
    
        let handles = await driver.getAllWindowHandles();
        while (!handles[1]) {
            await driver.sleep(1000);
            handles = await driver.getAllWindowHandles();
        }
    
        handles = await driver.getAllWindowHandles();
        for (let i = 1; i < handles.length; i++) {
            await driver.switchTo().window(handles[i]);
            await driver.close();
        }
        await driver.switchTo().window(handles[0]);
    
        await driver.get('chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=utils');
        // await driver.executeScript(`
        //     let overlay = document.createElement('div');
        //     overlay.id = 'loading-overlay';
        //     overlay.style.position = 'fixed';
        //     overlay.style.top = '0';
        //     overlay.style.left = '0';
        //     overlay.style.width = '100vw';
        //     overlay.style.height = '100vh';
        //     overlay.style.backgroundColor = 'black';
        //     overlay.style.zIndex = '9999';
        //     overlay.style.display = 'flex';
        //     overlay.style.justifyContent = 'center';
        //     overlay.style.alignItems = 'center';
        
        //     let img = document.createElement('img');
        //     img.src = 'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif';  // Замените на URL вашего изображения
        //     img.style.width = '100px'; // Измените размер изображения загрузки по необходимости
        //     overlay.appendChild(img);
        
        //     document.body.appendChild(overlay);
        // `);
    
        //await driver.executeScript(`document.body.style.opacity = '0';`);
    
        let subdomenScriptPath = path.resolve('./src/subdomenScript-2024-07-08.user.js');
        // let mainScriptPath = path.resolve('./src/mainScript-2024-07-08.user.js');
    
        let importBtn = await driver.wait(until.elementLocated(By.id("input_ZmlsZV91dGlscw_file")), 10000);
        // await importBtn.sendKeys(mainScriptPath);
    
        // handles = await driver.getAllWindowHandles();
        // while (!handles[1]) {
        //     await driver.sleep(100);
        //     handles = await driver.getAllWindowHandles();
        // }
        
        // handles = await driver.getAllWindowHandles();
        // await driver.switchTo().window(handles[1]);
    
    
        

        
        // await driver.executeScript(`
        //     let overlay = document.createElement('div');
        //     overlay.id = 'loading-overlay';
        //     overlay.style.position = 'fixed';
        //     overlay.style.top = '0';
        //     overlay.style.left = '0';
        //     overlay.style.width = '100vw';
        //     overlay.style.height = '100vh';
        //     overlay.style.backgroundColor = 'black';
        //     overlay.style.zIndex = '9999';
        //     overlay.style.display = 'flex';
        //     overlay.style.justifyContent = 'center';
        //     overlay.style.alignItems = 'center';
        
        //     let img = document.createElement('img');
        //     img.src = 'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif';  // Замените на URL вашего изображения
        //     img.style.width = '100px'; // Измените размер изображения загрузки по необходимости
        //     overlay.appendChild(img);
        
        //     document.body.appendChild(overlay);
        // `);
    
        
        // await driver.executeScript(`
        //     let code = document.querySelector('.tv_content .tv_content_alt');
        //     code.style.opacity = 0;
        //     let elems = document.querySelectorAll('tr.includesdesc');
        //     for (let el of elems) {
        //         el.style.opacity = 0;
        //     }
        // `);
        
        // let installBtn = await driver.wait(until.elementLocated(By.className("button install")), 10000);
        // await driver.executeScript(`
        //     let btn = document.querySelector('.button.install');
        //     btn.click(); 
        // `)
        // //await installBtn.click();
    
        // handles = await driver.getAllWindowHandles();
        // await driver.switchTo().window(handles[0]);

        await driver.sleep(1000);
    
        await importBtn.sendKeys(subdomenScriptPath);

        
    


        handles = await driver.getAllWindowHandles();
        while (!handles[1]) {
            await driver.sleep(100);
            handles = await driver.getAllWindowHandles();
        }
    
       
        handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);

        // await driver.executeScript(`
        //     let overlay = document.createElement('div');
        //     overlay.id = 'loading-overlay';
        //     overlay.style.position = 'fixed';
        //     overlay.style.top = '0';
        //     overlay.style.left = '0';
        //     overlay.style.width = '100vw';
        //     overlay.style.height = '100vh';
        //     overlay.style.backgroundColor = 'black';
        //     overlay.style.zIndex = '9999';
        //     overlay.style.display = 'flex';
        //     overlay.style.justifyContent = 'center';
        //     overlay.style.alignItems = 'center';
        
        //     let img = document.createElement('img');
        //     img.src = 'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif';  // Замените на URL вашего изображения
        //     img.style.width = '100px'; // Измените размер изображения загрузки по необходимости
        //     overlay.appendChild(img);
        
        //     document.body.appendChild(overlay);
        // `);
    
        // await driver.executeScript(`
        //     let code = document.querySelector('.tv_content .tv_content_alt');
        //     code.style.opacity = 0;
        //     let elems = document.querySelectorAll('tr.includesdesc');
        //     for (let el of elems) {
        //         el.style.opacity = 0;
        //     }
        // `);
        
    
        let installBtn2 = await driver.wait(until.elementLocated(By.className("button install")), 10000);
        await driver.executeScript(`
            let btn = document.querySelector('.button.install');
            btn.click(); 
        `)
        // await installBtn2.click();
    
        handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[0]);
    
        await driver.sleep(2000);
        await driver.get("https://iframe.coomeet.com");
        await driver.executeScript(`
            localStorage.setItem('winUsername', '${localUsername}');
            localStorage.setItem('vmIP', '${vmIP}');
        `);
        await driver.get("https://woman.coomeet.com/");
        await driver.executeScript(`
            localStorage.setItem('username', '${username}');
            localStorage.setItem('password', '${password}');
            localStorage.setItem('winUsername', '${localUsername}');
            localStorage.setItem('vmIP', '${vmIP}');
        `);
        // await driver.get("https://coomeet.com/");
        // await driver.executeScript(`
        //     localStorage.setItem('winUsername', '${localUsername}');
        //     localStorage.setItem('vmIP', '${vmIP}');
        // `);
    } catch (error) {
        console.log(error);
    }
}

async function checkUsername(ip, localUsername) {
    try {
        const result = await axios.get(`https://ua.astrostar.chat/users/vmIP/${ip}/username/${localUsername}`);

        await runSelenium(result.data.username, result.data.password, localUsername, ip);
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404)
                console.log("ERROR, user is not allowed");
            else 
                console.log("Error data", error.response.data);
        }
        else if (error.request) {
            console.log('No response received:', error.request);
        }
        else {
            console.log('Error setting up request:', error.message);
        }
    }
}

await updateScript();

const response = await axios.get('https://api.ipify.org?format=json');
const ipAddress = response.data.ip;

console.log(ipAddress);

const localUsername = os.userInfo().username;
console.log(`one more update check... Local username: ${localUsername}`);
await checkUsername(ipAddress, localUsername);
