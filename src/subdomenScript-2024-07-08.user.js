// ==UserScript==
// @name         subdomen script
// @namespace    http://tampermonkey.net/
// @version      2024-07-08
// @description  try to take over the world!
// @author       You
// @match        *://iframe.coomeet.com/*
// @match        *://woman.coomeet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coomeet.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let winUsername = localStorage.getItem('winUsername');
    let vmIP = localStorage.getItem('vmIP');

    let hideOverlayAttempted = false;

    const sendVisibilityRequest = () => {
        if (!vmIP || !winUsername) return;
    
        fetch(`https://ua.astrostar.chat/users/visibility/vm/${vmIP}/username/${winUsername}?flag=show`, {
            method: "PATCH"
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            hideOverlayAttempted = true;
        })
        .catch(err => {
            console.error(err);
            hideOverlayAttempted = false;
        });
        // setTimeout(() => {        
        // }, 5000);
    };

    // Функция для периодической проверки localStorage и отправки запроса
    const checkLocalStorageAndSendRequest = () => {
        if (hideOverlayAttempted) return;

        winUsername = localStorage.getItem('winUsername');
        vmIP = localStorage.getItem('vmIP');

        if (vmIP && winUsername) {
            // Останавливаем проверку, если данные найдены
            clearInterval(checkInterval);
            sendVisibilityRequest();
        }
    };

    const checkInterval = setInterval(checkLocalStorageAndSendRequest, 500); // Проверка каждые 500мс

    // let hideOverlayObserver = new MutationObserver(() => {
    //     checkLocalStorageAndSendRequest();
    // });
    
    // hideOverlayObserver.observe(document.body, { childList: true, subtree: true });
    
    
    // let hideOverlayAttempted = false;
    // const hideOverlay = () => {
    //     if (hideOverlayAttempted) return;
    //     if (vmIP && winUsername) {
    //         setTimeout(() => {
    //             fetch(`https://ua.astrostar.chat/users/visibility/vm/${vmIP}/username/${winUsername}?flag=show`,
    //                 {
    //                     method: "PATCH"
    //                 }
    //             ).then(res => res.json())
    //             .then(data => {
    //                 console.log(data);
    //                 hideOverlayAttempted = true;
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 hideOverlayAttempted = false;
    //             });
    //         }, 3000);
    //     }
    // }
    // let hideOverlayObserver = new MutationObserver(hideOverlay);
    // hideOverlayObserver.observe(document.body, { childList: true, subtree: true });



    const hideLogo = () => {
        let logo = document.querySelector('div[class="intro__logo"]');
        if (logo) {
            logo.remove();
        }
    }

    let hideLogoObserver = new MutationObserver(hideLogo);
    hideLogoObserver.observe(document.body, { childList: true, subtree: true });

    let startLoginAttempted = false;
    const startLogin = () => {
        if (startLoginAttempted) return;
        let btn = document.querySelector('div[class="signed-in-user__avatar--login-button"]');
        if (btn) {
            btn.click();
            startLoginAttempted = true;
        }
    }
    let startLoginObserver = new MutationObserver(startLogin);
    startLoginObserver.observe(document.body, { childList: true, subtree: true });


    let loginAttempted = false;
    const login = () => {
        if (loginAttempted) return;

        let loginInput = document.querySelectorAll('input[type="email"]')[1];
        let pswInput = document.querySelectorAll('input[type="password"]')[1];
        let submitBtn = document.querySelectorAll("button[class='ui-simple-button color-blue size-46']")[1];

        let username = localStorage.getItem('username');
        let password = localStorage.getItem('password');

        if (loginInput && pswInput && submitBtn) {
            loginInput.value = username;
            pswInput.value = password;
            const inputEvent = new Event('input', { bubbles: true });
            loginInput.dispatchEvent(inputEvent);
            pswInput.dispatchEvent(inputEvent);

            submitBtn.click();
            loginAttempted = true;
        }
    }
    let loginObserver = new MutationObserver(login);
    loginObserver.observe(document.body, { childList: true, subtree: true });


    const hideElements = () => {

        let headerTop = document.querySelector('div[data-name="header-top"]');
        let headerSettings = document.querySelector('div[data-name="header-settings"]');
        let separators = document.querySelectorAll('div[class="chat-header-menu__separator"]');
        let communicationHistory = document.querySelector('div[class="communication-history"]');
        let headerUser = document.querySelector('div[class="signed-in-user"]');
        let supportDialog = document.querySelector('div[class="support-dialog"]');
        

        if (headerTop) {
            headerTop.innerHTML = "";
            headerTop.style.display = 'none';
        }
        if (headerSettings) {
            headerSettings.innerHTML = "";
            headerSettings.style.display = 'none';
        }
        for (let s of separators) s.style.display = 'none';
        if (headerUser) {
            //headerUser.innerHTML = "";
            headerUser.style.display = 'none';
        }
        if (communicationHistory) {
            communicationHistory.innerHTML = "";
        }
        if (supportDialog) {
            supportDialog.innerHTML = "";
            supportDialog.style.display = 'none';
        }
    }

    let hideElementsObserver = new MutationObserver(hideElements);
    hideElementsObserver.observe(document.body, { childList: true, subtree: true });
    
    
    let balanceSendAttempted = false;
    // let balanceInterval;
    const sendBalance = () => {
        if (balanceSendAttempted) return;

        let balance = document.querySelector('div[class="info-panel__balance--moneys__usd"]');

        if (balance) {
            balanceSendAttempted = true;
            const apiUrl = `https://ua.astrostar.chat/users/vm/${vmIP}/username/${winUsername}/balance/`;
            fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    balance: balance.textContent
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('User balance updated successfully:', data);
            })
            .catch((error) => {
                console.error('Error updating user balance:', error);
                balanceSendAttempted = false;
                // clearInterval(balanceInterval);
            });
            // balanceInterval = setInterval(() => {
            //     const apiUrl = `https://ua.astrostar.chat/users/vm/${vmIP}/username/${winUsername}/balance/`;
            //     fetch(apiUrl, {
            //         method: 'PATCH',
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             balance: balance.textContent
            //         })
            //     })
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log('User balance updated successfully:', data);
            //     })
            //     .catch((error) => {
            //         console.error('Error updating user balance:', error);
            //         balanceSendAttempted = false;
            //         clearInterval(balanceInterval);
            //     });
            // }, 60000);
        }

    }
    let sendBalanceObserver = new MutationObserver(() => {
        if (!balanceSendAttempted) {
            sendBalance();
        }
    });
    sendBalanceObserver.observe(document.body, { childList: true, subtree: true });


    let tariff = null;

    let sendTariffAttempted = false;
    const sendTariff = () => {
        if (sendTariffAttempted) return;

        let el = document.querySelector('div[class="info-panel__balance--calculations"]');
        if (el) {
            sendTariffAttempted = true;
            const apiUrl = `https://ua.astrostar.chat/users/vm/${vmIP}/username/${winUsername}/tariff/`;
            fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tariff: el.textContent
                })
            })
            .then(response => response.json())
            .then(data => {
                tariff = el.textContent
                console.log('User tariff updated successfully:', data);
            })
            .catch((error) => {
                console.error('Error sending tariff:', error);
                sendTariffAttempted = false;
                clearInterval(balanceInterval);
            });
        }
    }

    let sendTariffObserver = new MutationObserver(sendTariff);
    sendTariffObserver.observe(document.body, { childList: true, subtree: true });



    let clickAgreeAttempted = false;
    let allowSendingMinutes = false;

    const clickAgree = () => {
        if (clickAgreeAttempted) return;

        let el = document.querySelector(".terms-actions > .ui-simple-button.terms-actions__button.color-blue.size-46");
        if (el) {
            el.addEventListener('click', () => {
                allowSendingMinutes = true;
                clickAgreeAttempted = true;
            });
        }
    }

    let clickAgreeObserver = new MutationObserver(clickAgree);
    clickAgreeObserver.observe(document.body, { childList: true, subtree: true });

    
    let clickTariffAttempted = false;

    const clickTariff = () => {
        if (clickTariffAttempted) return;

        let el = document.querySelector('div[class="info-panel__balance--calculations"]');
        if (el && allowSendingMinutes) {
            el.click();
            clickTariffAttempted = true;
        }
    }

    let clickTariffObserver = new MutationObserver(clickTariff);
    clickTariffObserver.observe(document.body, { childList: true, subtree: true });

    
    let hidePopupAttempted = false;
    const hidePopup = () => {
        if (hidePopupAttempted) return;

        const popup = document.querySelector('.popup-item');
        if (popup && allowSendingMinutes) {
            popup.style.opacity = 0;
        }
    }

    let hidePopupObserver = new MutationObserver(hidePopup);
    hidePopupObserver.observe(document.body, { childList: true, subtree: true });



    function findMinutesForTariff(tariff) {
        const rateCells = document.querySelectorAll('.tariffs__table--column__row--label.static');

        let returned = null;
        rateCells.forEach(function(rateCell) {
            if (rateCell.textContent.trim() === "5/12") {
                const column = rateCell.closest('.tariffs__table--column');
                const nextColumn = column.nextElementSibling;
                const minutesCell = nextColumn.querySelector('.centered').nextElementSibling.querySelector('.tariffs__table--column__row--label');

                const minutesValue = minutesCell ? minutesCell.textContent.trim() : null;
                returned = minutesValue;
            }
        });
        return returned;
    }

    let sendCommAttempted = false;
    const sendComm = () => {
        if (sendCommAttempted) return;

        let communicateMinutes = null;
        let communicateMinutesGoal = findMinutesForTariff(tariff);
        
        const lastColumn = document.querySelector('.tariffs__table--column:last-child');
        if (lastColumn) {
            const userValue = lastColumn.querySelectorAll('.tariffs__table--column__row.centered .tariffs__table--column__row--label')[1];
            communicateMinutes = userValue.textContent.trim();

        }

        if (communicateMinutes && communicateMinutesGoal) {
            sendCommAttempted = true;
            const apiUrl = `https://ua.astrostar.chat/users/vm/${vmIP}/username/${winUsername}/communication/`;
            fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    communicateMinutes,
                    communicateMinutesGoal
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('User communication minutes updated successfully:', data);
                const closeEl = document.querySelector('.close-button');
                closeEl.click();
            })
            .catch((error) => {
                console.error('Error updating user communication minutes:', error);
                sendCommAttempted = true;
            });
        }
    }

    let sendCommObserver = new MutationObserver(sendComm);
    sendCommObserver.observe(document.body, { childList: true, subtree: true });




    function hideSupportDialog() {
        const dialogs = document.querySelectorAll('.dialog-item');
        dialogs.forEach(dialog => {
            const nameElement = dialog.querySelector('.user-info__name .name');
            if (nameElement && (nameElement.textContent === 'Support' || nameElement.textContent === 'Moderation' || nameElement.textContent === 'Financial Support')) {
                dialog.innerHTML = "";
                dialog.style.display = 'none';
            }
        });
    }
    const hideSupportDialogObserver = new MutationObserver(() => {
        hideSupportDialog();
    });
    hideSupportDialogObserver.observe(document.body, { childList: true, subtree: true });


    const checkAreaAndInsertData = () => {
        let container = document.querySelector('.video-chat-area');

        if (container) {
            clearInterval(checkAreaInterval);
            showData();
        }
    };

    const checkAreaInterval = setInterval(checkAreaAndInsertData, 500);


    function showData() {
        let isMinutesGoalCompleted = false;
        let balanceToday = 0;
        let balanceWeek = 0;

        let minutes = 0;
        
        
        let earningsGoalDay = 5000;
        let earningsGoalWeek = 20000;
        let minutesGoal = 0;

        let container = document.querySelector('.video-chat-area');
        let myContainer = document.createElement('div');
        myContainer.id = "myContainer";
        myContainer.style.display = "flex";
        myContainer.style.flexDirection = "row";
        myContainer.style.justifyContent = "space-between";
        myContainer.style.gap = "20px";
        myContainer.style.marginTop = "20px";
        container.appendChild(myContainer);
        if (container) {
            // Создаем новый div для информации
            const infoDiv = document.createElement('div');
            infoDiv.id = "earningInfoContainer";
            infoDiv.classList.add('custom-info-block');
            infoDiv.style.padding = "25px 15px";
            infoDiv.style.borderRadius = "5px";
            infoDiv.style.width = "300px";
            infoDiv.style.height = "150px";
            infoDiv.style.backgroundColor = "#f7f9fb";

            // Добавляем текст в div
            infoDiv.innerHTML = `
                <h1 style="font-size: 34px; margin-top: 0px;">Заработано</h1>
                <p style="margin-top: 10px;">за сегодня: ${balanceToday}</p>
                <p style="margin-top: 10px;">за неделю: ${balanceWeek}</p>
            `;

            // Добавляем новый блок в целевой элемент
            myContainer.appendChild(infoDiv);

            if (!isMinutesGoalCompleted) {
                const minutesProgressDiv = document.createElement('div');
                minutesProgressDiv.style.display = "flex";
                minutesProgressDiv.style.width = "300px";
                minutesProgressDiv.style.justifyContent = "space-between";
                minutesProgressDiv.id = "minutesProgressContainer";
                minutesProgressDiv.style.margin = "20px 0";
                minutesProgressDiv.innerHTML = `
                <div style="width: 100%;">
                    <h3 style="color: black;">Цель по минутам общения</h3>
                    <div style="width:100%; background-color: #e0e0e0; border-radius: 5px; height: 30px; margin: 20px 0;">
                        <div id="minutesProgressFillDay" style="width: 0%; max-width: 100%; height: 100%; background-color: #4caf50; border-radius: 5px;"></div>
                    </div>
                    <p id="minutesProgressTextDay" style="color: black;">Проведено в общении: 0 / ${minutesGoal}</p>
                </div>
                `;
                myContainer.appendChild(minutesProgressDiv);
            }
            
            const progressDiv = document.createElement('div');
            progressDiv.style.display = "flex";
            progressDiv.style.width = "500px";
            progressDiv.style.gap = "20px";
            progressDiv.style.justifyContent = "space-between";
            progressDiv.id = "progressContainer";
            progressDiv.style.margin = "20px 0";
            progressDiv.innerHTML = `
            <div style="width: 100%;">
                <h3 style="color: black;">Цель на день</h3>
                <div style="width:100%; background-color: #e0e0e0; border-radius: 5px; height: 30px; margin: 20px 0;">
                    <div id="progressFillDay" style="width: 0%; max-width: 100%; height: 100%; background-color: #4caf50; border-radius: 5px;"></div>
                </div>
                <p id="progressTextDay" style="color: black;">Заработано: 0 / ${earningsGoalDay}</p>
            </div>
            <div style="width: 100%;">
                <h3 style="color: black;">Цель на неделю</h3>
                <div style="width:100%; background-color: #e0e0e0; border-radius: 5px; height: 30px; margin: 20px 0;">
                    <div id="progressFillWeek" style="width: 0%; max-width: 100%; height: 100%; background-color: #4caf50; border-radius: 5px;"></div>
                </div>
                <p id="progressTextWeek" style="color: black;">Заработано: 0 / ${earningsGoalWeek}</p>
            </div>
            `;
            myContainer.appendChild(progressDiv);
        } else {
            console.log("Элемент с классом .section-item --app --app-show не найден.");
        }

        const earningsContainer = document.getElementById("earningInfoContainer");
        const apiUrl = `https://ua.astrostar.chat/users/vm/${vmIP}/username/${winUsername}/balance/`;

        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('User balance updated successfully:', data.earningsToday, data.earningsWeek);
            balanceToday = data.earningsToday.toFixed(2);
            balanceWeek = data.earningsWeek.toFixed(2);
            earningsGoalDay = data.dailyEarningsGoal.toFixed(2);
            earningsGoalWeek = data.weeklyEarningsGoal.toFixed(2);

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
        
        const apiUrl2 = `https://ua.astrostar.chat/users/vm/${vmIP}/username/${winUsername}/minutes/`;

        fetch(apiUrl2)
        .then(response => {
            if (response.status === 300) {
                isMinutesGoalCompleted = true;
                let minutesContainer = document.getElementById("minutesProgressContainer");
                minutesContainer.style.display = "none";
            }
            return response.json();
        })
        .then(data => {
            if (!isMinutesGoalCompleted) {
                console.log('User minuntes updated successfully:', data.communicateMinutes, data.communicateMinutesGoal);
                minutes = data.communicateMinutes;
                minutesGoal = data.communicateMinutesGoal;

                const userMinutes = minutes || 0;
                const userMinutesPercentage = (userMinutes / minutesGoal) * 100;

                document.getElementById('minutesProgressFillDay').style.width = `${userMinutesPercentage}%`;
                document.getElementById('minutesProgressTextDay').textContent = `Проведено в общении: ${userMinutes} / ${minutesGoal}`;
            }
        })
        .catch((error) => {
            console.error('Error updating user minuntes:', error);
        });
    }

    let isActive = false;
    function trackActivity() {
        const cameraWindow = document.querySelector('div[class="dialog-user-camera__video"]')

        console.log("Camera Window", cameraWindow);
        if (cameraWindow && !isActive) {
            isActive = true;
            const apiUrl = `https://ua.astrostar.chat/activity/vm/${vmIP}/username/${winUsername}`;
            fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isOnline: true
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Activity data sent successfully:', data);
            })
            .catch((error) => {
                console.error('Error sending activity data:', error);
            });
        }
        else if (!cameraWindow && isActive) {
            isActive = false;
            const apiUrl = `https://ua.astrostar.chat/activity/vm/${vmIP}/username/${winUsername}`;
            fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isOnline: false
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Activity data sent successfully:', data);
            })
            .catch((error) => {
                console.error('Error sending activity data:', error);
            });
        }
    }
    const trackActivityObserver = new MutationObserver(() => {
        trackActivity();
    });
    trackActivityObserver.observe(document.body, { childList: true, subtree: true });


    

    window.addEventListener('beforeunload', () => {
        const apiUrl = `https://ua.astrostar.chat/activity/vm/${vmIP}/username/${winUsername}`;
        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isOnline: false
            }),
            keepalive: true
        })
        .then(response => response.json())
        .then(data => {
            console.log('Activity data sent successfully:', data);
        })
        .catch((error) => {
            console.error('Error sending activity data:', error);
        });
    });
})();