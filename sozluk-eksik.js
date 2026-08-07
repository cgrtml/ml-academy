/* ML Academy · viz-sozluk.js'te karşılığı olmayan tuval etiketlerini listeler.
   Envanteri .tuval-envanter.json'dan okur (üretmek için: node tuval-metin.js).
   Kullanım: node sozluk-eksik.js [kaç tane] [atla]   */
const fs = require('fs');
const env = JSON.parse(fs.readFileSync('./.tuval-envanter.json','utf8'));
const SOZ = eval(fs.readFileSync('./viz-sozluk.js','utf8') + ';TUVAL_EN');

const tumu = [...env.sabit.map(([s,n]) => ({ s, n })),
              ...env.sablon.map(s => ({ s, n:0 }))];
const eksik = tumu.filter(x => SOZ[x.s] === undefined);
const N   = parseInt(process.argv[2] || '120', 10);
const atla = parseInt(process.argv[3] || '0', 10);

eksik.sort((a,b) => b.n - a.n || a.s.localeCompare(b.s,'tr'));
eksik.slice(atla, atla+N).forEach(x => console.log('  ' + JSON.stringify(x.s) + ': ,'));
console.log('\n// eksik: ' + eksik.length + ' / ' + tumu.length +
            '   (sözlükte ' + Object.keys(SOZ).length + ' kayıt)');
