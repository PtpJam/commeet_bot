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

    let balanceSendAttempted = false;
    let balanceInterval;
    const sendBalance = () => {
        if (balanceSendAttempted) return;

        let balance = document.querySelector('div[class="info-panel__balance--moneys__usd"]');
        console.log(balance);

        if (balance) {
            balanceSendAttempted = true;
            const apiUrl = `http://localhost:3000/users/vm/${vmIP}/username/${winUsername}/balance/`;
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
                const apiUrl = `http://localhost:3000/users/vm/${vmIP}/username/${winUsername}/balance/`;
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

    let isOnline = true;
    let lastActivityTime = Date.now();
    let lastActivityDuration = 0;

    let activityData = {
        lastActivityTime,
        lastActivityDuration,
        isOnline
    };

    function calculateActiveDuration() {
        if (isOnline) {
            const currentTime = Date.now();
            const timeDiff = (currentTime - lastActivityTime) / 1000;
            lastActivityDuration += timeDiff;
            lastActivityTime = currentTime;
        }
    }

    function updateLastActiveTime() {
        lastActivityTime = Date.now();
    }
    function handleVisibilityChange() {
        if (document.hidden) {
            calculateActiveDuration();
            activityData.lastActivityDuration = lastActivityDuration;
            activityData.isOnline = false;
            activityData.lastActivityTime = lastActivityTime;
            const apiUrl = `http://localhost:3000/activity/${winUsername}`;
            fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activityData),
                keepalive: true
            })
            .then(response => response.json())
            .then(data => {
                console.log('Activity data sent successfully:', data);
            })
            .catch((error) => {
                console.error('Error sending activity data:', error);
            });
        } else {
            lastActivityTime = Date.now();
            isOnline = true;
        }
    }

    function sendActivityData() {
        calculateActiveDuration();
        activityData.lastActivityDuration = lastActivityDuration;
        activityData.isOnline = isOnline;
        activityData.lastActivityTime = lastActivityTime;

        console.log(activityData);

        const apiUrl = `http://localhost:3000/activity/vm/${vmIP}/username/${winUsername}`;
        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Activity data sent successfully:', data);
        })
        .catch((error) => {
            console.error('Error sending activity data:', error);
        });
    }
    function handleWindowBlur() {
        calculateActiveDuration();
        activityData.lastActivityDuration = lastActivityDuration;
        activityData.isOnline = false;
        activityData.lastActivityTime = lastActivityTime;
        const apiUrl = `http://localhost:3000/activity/vm/${vmIP}/username/${winUsername}`;
        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData),
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

    function handleWindowFocus() {
        lastActivityTime = Date.now();
        isOnline = true;
    }


    window.addEventListener('mousemove', calculateActiveDuration);
    window.addEventListener('keydown', calculateActiveDuration);
    window.addEventListener('scroll', calculateActiveDuration);
    window.addEventListener('click', calculateActiveDuration);


    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    let interval = setInterval(sendActivityData, 20000);

    window.addEventListener('beforeunload', () => {
        calculateActiveDuration();
        activityData.lastActivityDuration = lastActivityDuration;
        activityData.isOnline = false;
        activityData.lastActivityTime = lastActivityTime;
        const apiUrl = `http://localhost:3000/activity/vm/${vmIP}/username/${winUsername}`;
        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData),
            keepalive: true
        })
        .then(response => response.json())
        .then(data => {
            console.log('Activity data sent successfully:', data);
        })
        .catch((error) => {
            console.error('Error sending activity data:', error);
        });
        clearInterval(interval);
    });
})();