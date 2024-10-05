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
            console.log(err);
            hideOverlayAttempted = false;
        });
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

    let hideOverlayObserver = new MutationObserver(() => {
        checkLocalStorageAndSendRequest();
    });
    
    hideOverlayObserver.observe(document.body, { childList: true, subtree: true });
    
    
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
    let balanceInterval;
    const sendBalance = () => {
        if (balanceSendAttempted) return;

        let balance = document.querySelector('div[class="info-panel__balance--moneys__usd"]');
        console.log("Balance", balance);

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
                }),
                keepalive: true
            })
            .then(response => response.json())
            .then(data => {
                console.log('User balance updated successfully:', data);
            })
            .catch((error) => {
                console.error('Error updating user balance:', error);
                balanceSendAttempted = false;
                clearInterval(balanceInterval);
            });
            balanceInterval = setInterval(() => {
                const apiUrl = `https://ua.astrostar.chat/users/vm/${vmIP}/username/${winUsername}/balance/`;
                fetch(apiUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        balance: balance.textContent
                    }),
                    keepalive: true
                })
                .then(response => response.json())
                .then(data => {
                    console.log('User balance updated successfully:', data);
                })
                .catch((error) => {
                    console.error('Error updating user balance:', error);
                    balanceSendAttempted = false;
                    clearInterval(balanceInterval);
                });
            }, 60000);
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
                }),
                keepalive: true
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
        console.log("AGREEEEEEEEEEee", el);
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
            console.log("-------------------------", popup);
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
                console.log('Количество минут для тарифа', tariff, ": ", minutesValue);
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
        console.log(communicateMinutesGoal);
        
        const lastColumn = document.querySelector('.tariffs__table--column:last-child');
        if (lastColumn) {
            const userValue = lastColumn.querySelectorAll('.tariffs__table--column__row.centered .tariffs__table--column__row--label')[1];
            communicateMinutes = userValue.textContent.trim();
            console.log(communicateMinutes);

        }

        console.log("!!!!!!!!!!!!!!!!!!!!!!")
        console.log(communicateMinutes);
        console.log(communicateMinutesGoal);
        console.log("!!!!!!!!!!!!!!!!!!!!!!")
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
                }),
                keepalive: true
            })
            .then(response => response.json())
            .then(data => {
                console.log('User communication minutes updated successfully:', data);
                const closeEl = document.querySelector('.close-button');
                console.log(closeEl);
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

    let isActive = false;
    function trackActivity() {
        const cameraWindow = document.querySelector('div[class="dialog-user-camera__video"]')

        console.log("Camera Window", cameraWindow);
        if (cameraWindow && !isActive) {
            console.log("ACCTIIIIIIVE ++++++++++++++++++++++++++++");
            isActive = true;
            const apiUrl = `https://ua.astrostar.chat/activity/vm/${vmIP}/username/${winUsername}`;
            fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isOnline: true
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
        }
        else if (!cameraWindow && isActive) {
            console.log("UNACTiIIIIVE ---------------------");
            isActive = false;
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