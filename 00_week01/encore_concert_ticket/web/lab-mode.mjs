// Training switch is deliberately unavailable to the normal user runtime.
export const labMode=process.env.TEST_MODE==='1'&&process.env.BUG_MODE==='1';
export const labValue=(normal,training)=>labMode?training:normal;
