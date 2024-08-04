import path from 'path';
import { By, Builder, until, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import axios from 'axios';
import os from 'os'
import simpleGit from 'simple-git';

const localUsername = os.userInfo().username;
console.log(`Local username: ${localUsername}`);

const git = simpleGit();

async function updateScript() {
    try {
        // Выполняем git pull для получения последних изменений
        const update = await git.pull();
        if (update && update.summary.changes) {
            console.log('Скрипт обновлен, перезапуск...');
            process.exit(1); // Перезапуск процесса для применения изменений
        } else {
            console.log('Нет обновлений.');
        }
    } catch (err) {
        console.error('Ошибка при обновлении скрипта:', err);
    }
}

async function runSelenium(username, password) {
    try {
        let options = new chrome.Options();
        options.addArguments('--kiosk');
        options.addExtensions('./src/5.2.1_0.crx');
    
        let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

    
        await driver.get("chrome://extensions/");
    
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
    
        await driver.executeScript(`document.body.style.opacity = '0';`);
    
        let subdomenScriptPath = path.resolve('./src/subdomenScript-2024-07-08.user.js');
        let mainScriptPath = path.resolve('./src/mainScript-2024-07-08.user.js');
    
        let importBtn = await driver.wait(until.elementLocated(By.id("input_ZmlsZV91dGlscw_file")), 10000);
        await importBtn.sendKeys(mainScriptPath);
    
        handles = await driver.getAllWindowHandles();
        while (!handles[1]) {
            await driver.sleep(100);
            handles = await driver.getAllWindowHandles();
        }
        
        handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
    
        
        let installBtn = await driver.wait(until.elementLocated(By.className("button install")), 10000);
        await installBtn.click();
    
        handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[0]);
    
        await importBtn.sendKeys(subdomenScriptPath);

        
    
        await driver.sleep(2000);

        handles = await driver.getAllWindowHandles();
        while (!handles[1]) {
            await driver.sleep(100);
            handles = await driver.getAllWindowHandles();
        }
    
        handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
    
        
    
        let installBtn2 = await driver.wait(until.elementLocated(By.className("button install")), 10000);
        await installBtn2.click();
    
        handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[0]);
    
        await driver.sleep(2000);
        await driver.get("https://woman.coomeet.com/");
        await driver.executeScript(`
            localStorage.setItem('username', '${username}');
            localStorage.setItem('password', '${password}');
            localStorage.setItem('winUsername', '${localUsername}');
        `);
        await driver.get("https://coomeet.com/");
    } catch (error) {
        console.log(error);
    }
}

async function checkUsername(localUsername) {
    try {
        const result = await axios.get(`https://commeet-admin-panel-2720a2a2defe.herokuapp.com/users/${localUsername}`);

        await runSelenium(result.data.username, result.data.password);
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404)
                console.log("ERROR, username is not allowed");
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
await checkUsername(localUsername);