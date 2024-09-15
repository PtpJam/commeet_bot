// ==UserScript==
// @name         mainScript
// @namespace    http://tampermonkey.net/
// @version      2024-07-08
// @description  try to take over the world!
// @author       You
// @match        https://coomeet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coomeet.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // let winUsername = localStorage.getItem('winUsername');
    // let vmIP = localStorage.getItem('vmIP');

    // console.log("SKDfjqi(((99999999999999999999999999999999999----------------------")
    // console.log(winUsername);
    // console.log(vmIP);
    let balanceToday = 0;
    let balanceWeek = 0;

    const hideIntro = () => {
        let intro = document.querySelector('div[class="introduction has-trust-score show"]');
        if (intro) {
            intro.style.opacity = 0;
            console.log("INtro is hidden")
        }
    }
    let hideIntroObserver = new MutationObserver(hideIntro);
    hideIntroObserver.observe(document.body, { childList: true, subtree: true });
    const clickButton = () => {
        let startAppBtn = document.querySelector("button#open-app");
        if (startAppBtn) {
            startAppBtn.click();
        }
    }
    let clickButtonObserver = new MutationObserver(clickButton);
    clickButtonObserver.observe(document.body, { childList: true, subtree: true });
    let header2 = document.querySelector('header[class="header"]');
    header2.innerHTML = "";
    let section = document.querySelector('section[class="section-item --about"]');
    section.remove();
    let section2 = document.querySelector('section[class="section-item --features"]');
    section2.remove();
    let section3 = document.querySelector('section[class="section-item"]');
    section3.remove();
    let section4 = document.querySelector('section[class="section-item --join"]');
    section4.remove();
    let section5 = document.querySelector('section[class="section-item --faq"]');
    section5.remove();
    let section6 = document.querySelector('section[class="section-item --download"]');
    section6.remove();
    let section7 = document.querySelector('footer[class="footer"]');
    section7.remove();


    const checkLocalStorageAndInit = () => {
        let winUsername = localStorage.getItem('winUsername');
        let vmIP = localStorage.getItem('vmIP');
        
        console.log("Checking local storage", winUsername, vmIP);
        if (winUsername && vmIP) {
            console.log("user data for fetch", winUsername, vmIP);

            // Если данные найдены, запускаем основной функционал
            initEarningsDisplay(winUsername, vmIP);
        } else {
            // Если данные еще не установлены, проверяем снова через 1 секунду
            setTimeout(checkLocalStorageAndInit, 1000);
        }
    };

    const initEarningsDisplay = (winUsername, vmIP) => {
        const earningsGoalDay = 5000;
        const earningsGoalWeek = 20000;
        console.log("Found local storage values");
        let container = document.querySelector('.section-item.--app.--app-show');
        if (container) {
            // Создаем новый div для информации
            const infoDiv = document.createElement('div');
            infoDiv.id = "earningInfoContainer";
            infoDiv.classList.add('custom-info-block');
            infoDiv.style.padding = "25px 15px";
            infoDiv.style.borderRadius = "5px";
            infoDiv.style.width = "600px";
            infoDiv.style.margin = "40px 0";
            infoDiv.style.backgroundColor = "#f7f9fb";

            // Добавляем текст в div
            infoDiv.innerHTML = `
                <h1 style="font-size: 34px;">Заработано</h1>
                <p style="margin-top: 10px;">за сегодня: ${balanceToday}</p>
                <p style="margin-top: 10px;">за неделю: ${balanceWeek}</p>
            `;

            // Добавляем новый блок в целевой элемент
            container.appendChild(infoDiv);

            const progressDiv = document.createElement('div');
            progressDiv.style.display = "flex";
            progressDiv.style.width = "500px";
            progressDiv.style.justifyContent = "space-between";
            progressDiv.id = "progressContainer";
            progressDiv.style.margin = "20px 0";
            progressDiv.innerHTML = `
            <div style="width: 45%;">
                <h3 style="color: white;">Цель на день</h3>
                <div style="width:100%; background-color: #e0e0e0; border-radius: 5px; height: 30px; margin: 20px 0;">
                    <div id="progressFillDay" style="width: 0%; height: 100%; background-color: #4caf50; border-radius: 5px;"></div>
                </div>
                <p id="progressTextDay" style="color: white;">Заработано: 0 / $${earningsGoalDay}</p>
            </div>
            <div style="width: 45%;">
                <h3 style="color: white;">Цель на неделю</h3>
                <div style="width:100%; background-color: #e0e0e0; border-radius: 5px; height: 30px; margin: 20px 0;">
                    <div id="progressFillWeek" style="width: 0%; height: 100%; background-color: #4caf50; border-radius: 5px;"></div>
                </div>
                <p id="progressTextWeek" style="color: white;">Заработано: 0 / $${earningsGoalWeek}</p>
            </div>
            `;
            container.appendChild(progressDiv);
        } else {
            console.log("Элемент с классом .section-item --app --app-show не найден.");
        }

        const earningsContainer = document.getElementById("earningInfoContainer");
        const apiUrl = `http://localhost:3000/users/vm/${vmIP}/username/${winUsername}/balance/`;

        fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('User balance updated successfully:', data.earningsToday, data.earningsWeek);
                    balanceToday = data.earningsToday;
                    balanceWeek = data.earningsWeek;

                    // Обновляем данные в DOM
                    earningsContainer.innerHTML = `
                        <h1 style="font-size: 34px;">Заработано</h1>
                        <p style="margin-top: 10px;">за сегодня: ${balanceToday}</p>
                        <p style="margin-top: 10px;">за неделю: ${balanceWeek}</p>
                    `;
                    const userEarningsDay = balanceToday || 0;
                    const earningsPercentageDay = (userEarningsDay / earningsGoalDay) * 100;
                    const userEarningsWeek = balanceWeek || 0;
                    const earningsPercentageWeek = (userEarningsWeek / earningsGoalWeek) * 100;

                    // Update the progress bar and text
                    document.getElementById('progressFillDay').style.width = `${earningsPercentageDay}%`;
                    document.getElementById('progressTextDay').textContent = `Заработано: ${userEarningsDay} / ${earningsGoalDay}`;
                    document.getElementById('progressFillWeek').style.width = `${earningsPercentageWeek}%`;
                    document.getElementById('progressTextWeek').textContent = `Заработано: ${userEarningsWeek} / ${earningsGoalWeek}`;
                })
                .catch((error) => {
                    console.error('Error updating user balance:', error);
                });
        
        setInterval(() => {
            console.log("Обновление баланса пользователя");
            const earningsContainer = document.getElementById("earningInfoContainer");
            const apiUrl = `http://localhost:3000/users/vm/${vmIP}/username/${winUsername}/balance/`;
            
            fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('User balance updated successfully:', data.earningsToday, data.earningsWeek);
                balanceToday = data.earningsToday;
                balanceWeek = data.earningsWeek;

                // Обновляем данные в DOM
                earningsContainer.innerHTML = `
                    <h1 style="font-size: 34px;">Заработано</h1>
                    <p style="margin-top: 10px;">за сегодня: ${balanceToday}</p>
                    <p style="margin-top: 10px;">за неделю: ${balanceWeek}</p>
                `;
                const userEarningsDay = balanceToday || 0;
                const earningsPercentageDay = (userEarningsDay / earningsGoalDay) * 100;
                const userEarningsWeek = balanceWeek || 0;
                const earningsPercentageWeek = (userEarningsWeek / earningsGoalWeek) * 100;

                
                document.getElementById('progressFillDay').style.width = `${earningsPercentageDay}%`;
                document.getElementById('progressTextDay').textContent = `Заработано: ${userEarningsDay} / ${earningsGoalDay}`;
                document.getElementById('progressFillWeek').style.width = `${earningsPercentageWeek}%`;
                document.getElementById('progressTextWeek').textContent = `Заработано: ${userEarningsWeek} / ${earningsGoalWeek}`;
            })
            .catch((error) => {
                console.error('Error updating user balance:', error);
            });
        }, 60000);
    };

    window.onload = checkLocalStorageAndInit;
})();