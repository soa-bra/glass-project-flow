// قياس أولي لأداء توليد 5k عنصر
const N = Number(process.env.N || 5000);
const widgets = Array.from({length:N}, (_,i)=>({ id:`w${i}`, x:Math.random()*5000, y:Math.random()*5000, w:80, h:48, style:{}, data:{} }));
console.time("serialize");
const json = JSON.stringify({ widgets });
console.timeEnd("serialize");
console.log("Size:", (json.length/1024/1024).toFixed(2), "MB");
