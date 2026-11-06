import {defineConfig} from '@playwright/test';
const mode=process.env.BUG_MODE==='1'?'bug':'normal';
export default defineConfig({testDir:'./e2e',testMatch:['ui.spec.js','lab.spec.js'],fullyParallel:true,workers:3,retries:0,timeout:30000,
 outputDir:`e2e/report-${mode}/artifacts`,
 reporter:[['list'],['html',{open:'never',outputFolder:`e2e/report-${mode}/playwright`}],['json',{outputFile:`e2e/report-${mode}/results.json`}]],
 use:{trace:'retain-on-failure',video:'on',screenshot:'only-on-failure'}});
