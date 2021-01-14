// ==UserScript==
// @name         lagou
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://easy.lagou.com/talent/*
// ==/UserScript==

(function () {
  'use strict';
  window.addEventListener('load', () => {
    let count = 0;
    const MAX_COUNT = 15; // 只能打 15 个招呼

    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    const log = (...msg) => console.log(...msg);
    log('---------------------- 我们的脚本执行啦 ----------------------');
    sleep(2000);

    const getElement = (className) => document.getElementsByClassName(className);

    async function greeting() {
      const buttons = getElement('chat operation');
      if (!buttons.length) {
        await sleep(2000);
        greeting();
        return;
      }
      const validButtons = [].slice.call(buttons).filter((btn) => btn.innerText === '打招呼');
      log('所有用户', buttons);
      log('有效用户', validButtons);

      for (let i = 0, len = validButtons.length; i < len; i++) {
        validButtons[i].click();
        await sleep(1000);
        const backBtn = getElement('lg-button lg-button-primary lg-button-large confirm-offset')[0];
        if (!backBtn) {
          // 沟通次数用完直接停止执行
          const content = getElement('online-buy-goods-content');
          if (content.length) return;

          // 火爆人才 打不了招呼，直接关掉
          const closeButtons = getElement('lg-modal-close');
          (closeButtons[1] && closeButtons[1].click()) ||
          (closeButtons[0] && closeButtons[0].click());
        } else {
          log('打招呼成功！');
          backBtn.click();
          count++;
          await sleep(500);
        }
      }

      if (count < MAX_COUNT) {
        getElement('lg-pagination-next')[0].click();
        await sleep(2000);
        await greeting();
      }
    }
    greeting();
  });
})();
