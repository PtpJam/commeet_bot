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

        let header = document.querySelector('div[class="chat-header visible"]');
        let communicationHistory = document.querySelector('div[class="communication-history"]');

        if (header) {
            header.innerHTML = "";
        }
        if (communicationHistory) {
            communicationHistory.innerHTML = "";
        }
    }

    let hideElementsObserver = new MutationObserver(hideElements);
    hideElementsObserver.observe(document.body, { childList: true, subtree: true });
})();