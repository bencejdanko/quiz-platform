import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { unified } from 'unified';
import rehypeKatex from 'rehype-katex';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export interface StudyGuideData {
    title?: string;
    authors?: string[];
    tags?: string[];
}

export interface Block {
    questionNodes: any[];
    solutionNode: any;
}

export async function processStudyGuide(filePath: string, outDir: string, cssFile: string, templatePath: string) {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const { data, markdownContent } = parseFrontmatter(content);
    
    // Parse the markdown into questions and solutions
    const blocks = await groupBlocks(markdownContent);
    
    // Generate the intermediate markdown for Pandoc
    const intermediateMd = await generateIntermediateMarkdown(data, blocks);
    
    const tempMdPath = path.join(path.dirname(filePath), `.${fileName}.tmp.md`);
    await fs.writeFile(tempMdPath, intermediateMd);
    
    const pdfName = fileName.replace('.md', '.pdf');
    const pdfPath = path.join(outDir, pdfName);
    
    try {
        const title = data.title || fileName.replace('.md', '');
        
        // Find KaTeX CSS in node_modules
        const katexCss = path.join(process.cwd(), 'node_modules/katex/dist/katex.min.css');
        
        // We now provide pre-converted HTML in the input. 
        // We include both the user's CSS and the official KaTeX CSS.
        const command = `pandoc "${tempMdPath}" --standalone --template="${templatePath}" --pdf-engine=weasyprint --css="${katexCss}" --css="${cssFile}" --metadata title="${title}" -o "${pdfPath}"`;
        execSync(command, { stdio: 'inherit' });
        return pdfPath;
    } finally {
        await fs.unlink(tempMdPath).catch(() => {});
    }
}

export function parseFrontmatter(markdown: string) {
    const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { data: {} as StudyGuideData, markdownContent: markdown };

    const yaml = match[1];
    const markdownContent = markdown.slice(match[0].length).trim();
    const data: any = {};

    yaml.split(/\r?\n/).forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();
            if (value.startsWith('[') && value.endsWith(']')) {
                data[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
            } else {
                data[key] = value.replace(/^['"]|['"]$/g, '');
            }
        }
    });

    return { data: data as StudyGuideData, markdownContent };
}

export async function groupBlocks(markdown: string) {
    const processor = remark().use(remarkParse).use(remarkGfm).use(remarkMath);
    const tree = processor.parse(markdown);
    
    const blocks: Block[] = [];
    let currentQuestionNodes: any[] = [];
    
    for (const node of (tree as any).children) {
        if (node.type === 'blockquote') {
            // Found a solution block
            blocks.push({
                questionNodes: currentQuestionNodes,
                solutionNode: node
            });
            currentQuestionNodes = [];
        } else {
            currentQuestionNodes.push(node);
        }
    }
    
    // If there's a trailing question without a solution
    if (currentQuestionNodes.length > 0) {
        blocks.push({
            questionNodes: currentQuestionNodes,
            solutionNode: null
        });
    }
    
    return blocks;
}

export async function generateIntermediateMarkdown(data: StudyGuideData, blocks: Block[]) {
    let md = '';
    
    // Worksheet Section
    for (const [i, block] of blocks.entries()) {
        md += `<div class="question-block">\n\n`;
        md += `${i + 1}. ${await nodesToMarkdown(block.questionNodes)}`;
        md += `\n\n<div class="writing-space"></div>\n\n`;
        md += `</div>\n\n`;
    }
    
    // Solutions Section
    md += `<h2 id="solutions">Solutions</h2>\n\n`;
    for (const [i, block] of blocks.entries()) {
        if (block.solutionNode) {
            md += `<h3>${i + 1}.</h3>\n\n`;
            md += `<div class="solution-block">\n\n`;
            md += await nodesToMarkdown([block.solutionNode]);
            md += `\n\n</div>\n\n`;
        }
    }
    
    return md;
}


export async function nodesToMarkdown(nodes: any[]) {
    if (!nodes || nodes.length === 0) return '';
    
    const processor = unified()
        .use(remarkRehype)
        .use(rehypeKatex, {
            output: 'html'
        })
        .use(rehypeStringify);
    
    const tree = { type: 'root', children: nodes };
    const html = processor.stringify(processor.runSync(tree as any));
    
    // We don't want to inject the CSS for every block, but for the sake of simplicity
    // and ensuring each block is self-contained during generating intermediate Markdown,
    // we return the HTML. The template should ideally handle the CSS.
    return html;
}


