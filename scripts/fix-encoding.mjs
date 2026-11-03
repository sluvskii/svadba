import fs from 'node:fs';

const decoder1251 = new TextDecoder('windows-1251');
const charToCp1251 = new Map();
for (let byte = 0; byte < 256; byte++) {
	const char = decoder1251.decode(Uint8Array.of(byte));
	if (!charToCp1251.has(char)) charToCp1251.set(char, byte);
}

function decodeMojibake(text) {
	const hasBom = text.startsWith('\uFEFF');
	const body = hasBom ? text.slice(1) : text;
	const bytes = [];
	for (const char of body) {
		const byte = charToCp1251.get(char);
		if (byte === undefined) throw new Error(`Unmappable character: ${char.codePointAt(0).toString(16)}`);
		bytes.push(byte);
	}
	return new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(bytes));
}

const files = process.argv.slice(2);
for (const file of files) {
	const original = fs.readFileSync(file, 'utf8');
	const fixed = decodeMojibake(original).replace(/^\uFEFF/, '');
	fs.writeFileSync(file, fixed, 'utf8');
	console.log(`fixed ${file}`);
}
