const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'e-karigar-frontend', 'src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir(targetDir);

let changedFilesCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace all cyan colors to indigo
    content = content.replace(/cyan-50\b/g, 'indigo-50');
    content = content.replace(/cyan-100\b/g, 'indigo-100');
    content = content.replace(/cyan-200\b/g, 'indigo-200');
    content = content.replace(/cyan-300\b/g, 'indigo-300');
    content = content.replace(/cyan-400\b/g, 'indigo-400');
    content = content.replace(/cyan-500\b/g, 'indigo-500');
    content = content.replace(/cyan-600\b/g, 'indigo-600');
    content = content.replace(/cyan-700\b/g, 'indigo-700');
    content = content.replace(/cyan-800\b/g, 'indigo-800');
    content = content.replace(/cyan-900\b/g, 'indigo-900');
    content = content.replace(/cyan-950\b/g, 'indigo-950');

    // Remove poppins font overrides
    content = content.replace(/font-\['poppins'\]\s?/g, '');
    content = content.replace(/font-\['Poppins'\]\s?/g, '');
    content = content.replace(/font-poppins\s?/g, '');

    // Sometimes they are the only class strings so it might leave empty class names like className=""
    content = content.replace(/className="\s+"/g, 'className=""');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFilesCount++;
        console.log(`Updated: ${file.replace(__dirname, '')}`);
    }
});

console.log(`\nMigration complete. ${changedFilesCount} files updated.`);
