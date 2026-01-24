import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import matter from 'gray-matter';
import { toString } from 'mdast-util-to-string';
import { createHash } from 'node:crypto';
import type { Root, List } from 'mdast';

export interface QuizOption {
    text: string;
    rawText: string;
    isCorrect: boolean;
    originalIndex?: number;
}

export type QuestionType = 'choice' | 'text';

export interface QuizQuestion {
    id: string;
    text: string;
    type: QuestionType;
    options: QuizOption[];
    explanation?: string;
}

export interface Quiz {
    title: string;
    slug: string;
    authors?: string[];
    tags: string[];
    questions: QuizQuestion[];
}

function generateId(text: string): string {
    return createHash('sha256')
        .update(text.trim().toLowerCase())
        .digest('hex')
        .slice(0, 12);
}

const htmlProcessor = unified()
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify);

async function renderNodesToHtml(nodes: any[]): Promise<string> {
    const root = { type: 'root' as const, children: nodes };
    const file = await unified()
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .run(root);
    const html = unified().use(rehypeStringify).stringify(file as any);
    
    // If it's just one paragraph, unwrap it
    if (nodes.length === 1 && nodes[0].type === 'paragraph' && html.startsWith('<p>') && html.endsWith('</p>')) {
        return html.slice(3, -4).trim();
    }
    return html.trim();
}

export async function parseQuiz(markdown: string, strict: boolean = true): Promise<Quiz> {
    const { data, content } = matter(markdown);

    // In strict mode, slug is required. In non-strict mode, generate it if missing.
    let slug = data.slug;
    if (!slug) {
        if (strict) {
            throw new Error('Quiz must have a slug in frontmatter');
        }
        
        // Generate slug from title or use a default
        if (data.title) {
            slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        } else {
            slug = 'suggested-quiz-' + Date.now();
        }
    }

    const processor = remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath);
    
    const tree = processor.parse(content) as Root;
    const questions: QuizQuestion[] = [];
    let pendingNodes: any[] = [];

    for (let i = 0; i < tree.children.length; i++) {
        const node = tree.children[i];

        if (node.type === 'list') {
            const list = node as List;
            // Check if every item is a task list item
            const isTaskList = list.children.every(item => item.type === 'listItem' && typeof item.checked === 'boolean');
            const isPlainList = list.children.every(item => item.type === 'listItem' && typeof item.checked !== 'boolean');

            if (isTaskList || isPlainList) {
                // The question consists of all nodes since the last list
                let rawQuestionText = pendingNodes.map(n => toString(n)).join(' ').trim();
                let questionHtml = 'Untitled Question';
                
                if (pendingNodes.length > 0) {
                    questionHtml = await renderNodesToHtml(pendingNodes);
                }

                const options: QuizOption[] = await Promise.all(list.children.map(async (item: any) => ({
                    text: await renderNodesToHtml(item.children),
                    rawText: toString(item).trim(),
                    isCorrect: isPlainList ? true : !!item.checked
                })));

                // Check if the next node is a blockquote (explanation)
                let explanation: string | undefined = undefined;
                if (i + 1 < tree.children.length && tree.children[i + 1].type === 'blockquote') {
                    const blockquoteNode = tree.children[i + 1] as any;
                    const explanationHtml = await renderNodesToHtml(blockquoteNode.children);
                    explanation = explanationHtml;
                    // Skip the blockquote node in the next iteration
                    i++;
                }

                questions.push({
                    id: generateId(rawQuestionText || questionHtml),
                    text: questionHtml,
                    type: isTaskList ? 'choice' : 'text',
                    options,
                    ...(explanation && { explanation })
                });
                
                pendingNodes = [];
                continue;
            }
        }
        
        // Skip headings if they are at the very beginning (usually the quiz title)
        if (node.type === 'heading' && questions.length === 0 && pendingNodes.length === 0) {
            continue;
        }

        pendingNodes.push(node);
    }

    let authors: string[] | undefined = undefined;
    if (data.authors) {
        authors = Array.isArray(data.authors) ? data.authors : [data.authors];
    }

    let tags: string[] = [];
    if (data.tags) {
        tags = Array.isArray(data.tags) ? data.tags : [data.tags];
    }

    return {
        title: data.title || (strict ? 'Untitled Quiz' : 'Suggested Quiz'),
        slug,
        authors,
        tags,
        questions
    };
}

export async function renderMarkdown(text: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(text);
    
    let html = String(file).trim();
    // Unwrap single paragraph
    if (html.startsWith('<p>') && html.endsWith('</p>') && (html.match(/<p>/g) || []).length === 1) {
        html = html.slice(3, -4).trim();
    }
    return html;
}
