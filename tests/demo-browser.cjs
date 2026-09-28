const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      const errors=[]; const api=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.route('**/*', async route=>{
        const url=new URL(route.request().url());
        if(url.pathname.startsWith('/api/')) { api.push(url.pathname); return route.fulfill({status:503,body:'offline'}); }
        const name=path.basename(url.pathname);
        if(!['ai-interview.html','ai-interview.js','ai-interview-demo.js','ai-interview.css'].includes(name)) return route.abort();
        await route.fulfill({body:fs.readFileSync(path.join(__dirname,'..',name)),contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript'});
      });
      await page.goto('https://demo.github.io/personal-portfolio/ai-interview.html');
      assert.equal(await page.locator('#resumeText').getAttribute('readonly'),'');
      await page.locator('#analyzeButton').click();
      await page.locator('#startInterview').click();
      for(let i=0;i<5;i++) {
        assert.equal(await page.locator('#submitAnswer').isDisabled(),true);
        await page.locator('#sampleAnswer').click();
        await page.locator('#submitAnswer').click();
        assert.equal(await page.locator('.gap-alert').isVisible(),true);
        await page.locator('#sampleAnswer').click();
        await page.locator('#submitAnswer').click();
        assert.match(await page.locator('.question-result h1').innerText(),/预设评分/);
        await page.locator('#nextQuestion').click();
      }
      await page.locator('[data-report-mode=deep]').click();
      assert.equal(await page.locator('.question-review').count(),5);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.screenshot({path:`site-preview-demo-report-${width}.png`,fullPage:true});
      await page.locator('#restartInterview').click();
      await page.locator('#loadSample').click();
      await page.locator('#demoReport').click();
      assert.equal(await page.locator('#reportTitle').isVisible(),true);
      await page.locator('#liveMode').click();
      assert.match(await page.locator('#formError').innerText(),/本地/);
      await page.screenshot({path:`site-preview-demo-setup-${width}.png`,fullPage:true});
      assert.deepEqual(api,[]);
      assert.deepEqual(errors,[]);
      await page.goto('http://localhost:4180/ai-interview.html');
      await page.locator('#liveMode').click();
      await page.waitForFunction(()=>document.querySelector('#apiStatus').textContent.includes('服务未启动'));
      assert.equal(await page.locator('#analyzeButton').isDisabled(),true);
      await page.locator('#liveMode').click();
      assert.equal(await page.locator('#analyzeButton').isDisabled(),false);
      console.log(`PASS ${width}px: five questions, follow-ups, report, shortcut, reset, offline recovery; zero demo API calls`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
