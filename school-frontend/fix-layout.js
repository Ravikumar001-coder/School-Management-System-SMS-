const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const allFiles = walk(pagesDir);
let replaced = 0;

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if it imports Layout
    if (content.includes('import Layout from')) {
        // Remove import Layout...
        content = content.replace(/import Layout from ['"].+Layout['"];?\r?\n?/g, '');
        
        // Replace <Layout> with <>
        content = content.replace(/<Layout>/g, '<>');
        
        // Replace </Layout> with </>
        content = content.replace(/<\/Layout>/g, '</>');
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed ${file}`);
        replaced++;
    }
});

console.log(`Total files fixed: ${replaced}`);
