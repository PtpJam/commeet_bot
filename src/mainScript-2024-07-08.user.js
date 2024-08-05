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
    const clickButton = () => {
        let startAppBtn = document.querySelector("button#open-app");
        if (startAppBtn) {
            startAppBtn.click();
        }
    }
    let clickButtonObserver = new MutationObserver(clickButton);
    clickButtonObserver.observe(document.body, { childList: true, subtree: true });
    let header = document.querySelector('header[class="header"]');
    header.innerHTML = "";
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
})();