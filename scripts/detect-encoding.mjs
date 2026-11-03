import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ?? 'src';
const decoder = new TextDecoder('windows-1251');
const cp1251ToChar = new Map();
for (let byte = 0; byte < 256; byte++) {
	cp1251ToChar.set(decoder.decode(Uint8Array.of(byte)), byte);
}
const charToCp1251 = new Map();
for (const [char, byte] of cp1251ToChar) {
	if (!charToCp1251.has(char)) charToCp1251.set(char, byte);
}

function encodeCp1251(text) {
	const bytes = [];
	for (const char of text) {
		const byte = charToCp1251.get(char);
		if (byte === undefined) return null;
		bytes.push(byte);
	}
	return Buffer.from(bytes);
}

function inverse(text) {
	const bom = text.startsWith('\uFEFF') ? '\uFEFF' : '';
	const body = bom ? text.slice(1) : text;
	const bytes = encodeCp1251(body);
	if (!bytes) return null;
	return bom + new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

const patterns = [
	'Р°','Рµ','Рё','Рѕ','РЅ','Р»','РІ','СЂ','С‚','СЊ','С‹','СЏ','Рђ','Р‘','Р’','Р“','Р”','Р•','Р–','Р—','Р','Р™','Рљ','Р›','Рњ','Рћ','Рџ','Р ','РЎ','Рў','РЈ','Р¤','РҐ','Р¦','Р§','РЁ','Р©','РЄ','Р«','Р¬','Р­','Р®','РЇ','Р°','Р±','РІ','Рі','Рґ','Рµ','Р¶','Р·','Рё','Р№','Рє','Р»','Рј','РЅ','Рѕ','Рї','СЂ','СЃ','С‚','Сѓ','С„','С…','С†','С‡','С€','С‰','СЉ','С‹','СЊ','СЌ','СЋ','СЏ','вЂ','вЂ”','вЂ¦'
];

function score(text) {
	let total = 0;
	for (const p of patterns) {
		let index = 0;
		while ((index = text.indexOf(p, index)) !== -1) {
			total++;
			index += p.length;
		}
	}
	return total;
}

function walk(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.name === 'node_modules' || entry.name === '.svelte-kit') continue;
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(file);
		else if (/\.(svelte|ts|js|css|html|json|md)$/i.test(entry.name)) {
			const text = fs.readFileSync(file, 'utf8');
			const s = score(text);
			if (s > 0) {
				const candidate = inverse(text);
				const candidateScore = candidate ? score(candidate) : null;
				console.log(`${file}: score=${s} candidateScore=${candidateScore} replacement=${candidate?.includes('\uFFFD')}`);
				console.log('  current:  ', text.replace(/\n/g, '\\n').slice(0, 180));
				if (candidate) console.log('  candidate:', candidate.replace(/\n/g, '\\n').slice(0, 180));
			}
		}
	}
}
walk(root);
