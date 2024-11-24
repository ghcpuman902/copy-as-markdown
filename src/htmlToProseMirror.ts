import { DOMParser, Schema, Node as ProseMirrorNode, type Node } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { MarkdownSerializer, defaultMarkdownSerializer, MarkdownSerializerState } from "prosemirror-markdown";
import { tableNodes } from "prosemirror-tables";

// TODOS
// - for links try to convert relative links to absolute links 
// e.g. 
// ## [Useful Links](#useful-links) -> https://nextjs.org/docs/messages/version-staleness#useful-links
// * [Upgrade guide](/docs/pages/building-your-application/upgrading) https://nextjs.org/docs/pages/building-your-application/upgrading
// - 


// Define the custom schema
const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block")
        .append(tableNodes({
            tableGroup: "block", cellContent: "block+",
            cellAttributes: {
                background: {
                    default: null,
                    getFromDOM(dom: HTMLElement) {
                        return dom.style.backgroundColor || null;
                    },
                    setDOMAttr(value: unknown, attrs: { style?: string }) {
                        const backgroundColor = value as string | null;
                        if (backgroundColor)
                            attrs.style = (attrs.style || '') + `background-color: ${backgroundColor};`;
                    },
                },
            }
        })),
    marks: schema.spec.marks
});

// Custom Markdown serialization logic for tables
const customMarkdownSerializer = new MarkdownSerializer(
    {
        ...defaultMarkdownSerializer.nodes,
        table(state: MarkdownSerializerState, node: ProseMirrorNode) {
            state.write('\n');
            node.forEach((row, rowIndex) => {
                state.render(row, node, rowIndex);
                if (rowIndex === 0) {
                    // Add a separator line after the header row
                    state.write('|');
                    row.forEach(() => {
                        state.write('---|');
                    });
                    state.write('\n');
                }
            });
            state.write('\n');
        },
        table_row(state: MarkdownSerializerState, node: ProseMirrorNode) {
            state.write('|');
            node.forEach((cell, _, i) => {
                if (i > 0) state.write('|');
                state.write(' ');
                state.render(cell, node, i);
                state.write(' ');
            });
            state.write('|\n');
        },
        table_cell(state: MarkdownSerializerState, node: ProseMirrorNode) {
            node.forEach(paragraph => {
                paragraph.forEach((text, _, i) => {
                    state.render(text, paragraph, i);
                });
            });
        },
        table_header(state: MarkdownSerializerState, node: ProseMirrorNode) {
            state.write('**');
            node.forEach(paragraph => {
                paragraph.forEach((text, _, i) => {
                    state.render(text, paragraph, i);
                });
            });
            state.write('**');
        }
    },
    defaultMarkdownSerializer.marks
);

/**
 * Convert HTML content to Markdown.
 * @param {string} htmlDOM - The HTML content to be converted.
 * @returns {Promise<string | null>} - The converted Markdown content.
 */
export async function convertHTMLToMarkdown(htmlDOM: Node): Promise<string | null> {
    try {

        // Parse DOM to ProseMirror Node using the custom schema
        const domParser = DOMParser.fromSchema(mySchema);
        const prosemirrorDoc = domParser.parse(htmlDOM as unknown as HTMLElement);

        // Convert ProseMirror Node to Markdown using the custom serializer
        const markdownOutput = customMarkdownSerializer.serialize(prosemirrorDoc);

        return markdownOutput;
    } catch (error) {
        console.error("Error converting HTML to Markdown:", error);
        return null;
    }
}
