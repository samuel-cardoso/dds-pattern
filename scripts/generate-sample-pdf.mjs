import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const pages = [
  "Documento de demonstracao DDS",
  "Pagina 2 de 4 - continue rolando",
  "Pagina 3 de 4 - quase la",
  "Pagina 4 de 4 - fim do documento",
];

const objects = [];
const pageObjIds = [];
const contentObjIds = [];

const pageCount = pages.length;
const pagesObjId = 2;
const fontObjId = 3 + pageCount * 2;

for (let i = 0; i < pageCount; i += 1) {
  pageObjIds.push(3 + i * 2);
  contentObjIds.push(4 + i * 2);
}

objects.push({ id: 1, body: `<< /Type /Catalog /Pages ${pagesObjId} 0 R >>` });
objects.push({
  id: pagesObjId,
  body: `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`,
});

pages.forEach((text, i) => {
  const pageId = pageObjIds[i];
  const contentId = contentObjIds[i];
  objects.push({
    id: pageId,
    body: `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjId} 0 R >> >> /Contents ${contentId} 0 R >>`,
  });
  const stream = `BT /F1 24 Tf 72 700 Td (${text}) Tj ET`;
  objects.push({
    id: contentId,
    body: `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  });
});

objects.push({ id: fontObjId, body: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>` });

objects.sort((a, b) => a.id - b.id);

let pdf = "%PDF-1.4\n";
const offsets = [0];

for (const obj of objects) {
  offsets[obj.id] = Buffer.byteLength(pdf, "latin1");
  pdf += `${obj.id} 0 obj\n${obj.body}\nendobj\n`;
}

const xrefOffset = Buffer.byteLength(pdf, "latin1");
const totalObjects = objects.length + 1;

pdf += `xref\n0 ${totalObjects}\n`;
pdf += "0000000000 65535 f \n";
for (let id = 1; id < totalObjects; id += 1) {
  pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
}

pdf += `trailer\n<< /Size ${totalObjects} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sample-dds.pdf");
writeFileSync(outPath, pdf, "latin1");
console.log(`Written ${outPath}`);
