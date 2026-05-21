import { EvoRichTextArea, EvoDivider } from '@justin_evo/evo-ui'
import type { EvoRichTextHandle } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'
import { SubPageBack } from '../components/SubPageBack'

export default function RichTextAreaToolsPage() {
  return (
    <div>
      <SubPageBack to="/components/rich-text-area" label="Rich Text Area" />
      <div className="docs-page-header">
        <div className="docs-page-tag">Component · Rich Text Area</div>
        <h1 className="docs-page-title">Tools &amp; customization</h1>
        <p className="docs-page-desc">
          The toolbar is built from a single <code>tools</code> array. Each entry
          is either a built-in key or a custom tool object. Order, grouping, and
          visibility are entirely up to you.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">The default toolbar</div>
        <p className="docs-section-desc">
          With no <code>tools</code> prop, you get a sensible default: text marks,
          headings, lists, link, and image — separated by dividers.
        </p>
        <div className="docs-preview col">
          <EvoRichTextArea fullWidth />
        </div>
        <CodeBlock code={`<EvoRichTextArea fullWidth />
// Equivalent to:
// tools={['bold','italic','underline','divider','h1','h2','divider','ul','ol','divider','link','image']}`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Image-only</div>
        <p className="docs-section-desc">
          Need <em>just</em> image upload? Pass exactly that.
        </p>
        <div className="docs-preview col">
          <EvoRichTextArea
            tools={['image']}
            placeholder="Click the image icon, or paste / drop one here."
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea tools={['image']} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Minimal text formatting</div>
        <div className="docs-preview col">
          <EvoRichTextArea
            tools={['bold', 'italic', 'divider', 'link']}
            placeholder="Just bold, italic, and links."
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea
  tools={['bold', 'italic', 'divider', 'link']}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Full kitchen sink</div>
        <div className="docs-preview col">
          <EvoRichTextArea
            tools={[
              'undo', 'redo', 'divider',
              'paragraph', 'h1', 'h2', 'h3', 'divider',
              'bold', 'italic', 'underline', 'strike', 'divider',
              'ul', 'ol', 'quote', 'code', 'divider',
              'align-left', 'align-center', 'align-right', 'divider',
              'link', 'image', 'divider',
              'clear',
            ]}
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea
  tools={[
    'undo', 'redo', 'divider',
    'paragraph', 'h1', 'h2', 'h3', 'divider',
    'bold', 'italic', 'underline', 'strike', 'divider',
    'ul', 'ol', 'quote', 'code', 'divider',
    'align-left', 'align-center', 'align-right', 'divider',
    'link', 'image', 'divider',
    'clear',
  ]}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">No toolbar</div>
        <p className="docs-section-desc">
          Pass an empty array to render only the editing surface — useful for
          comment boxes where the user already knows the keyboard shortcuts.
        </p>
        <div className="docs-preview col">
          <EvoRichTextArea
            tools={[]}
            placeholder="No toolbar. ⌘B, ⌘I, ⌘U still work."
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea tools={[]} />`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Toggling block formats off</div>
        <p className="docs-section-desc">
          The block tools — <code>h1</code>, <code>h2</code>, <code>h3</code>,{' '}
          <code>quote</code>, and <code>code</code> — are toggles. Click one
          while the caret is already inside that block and it reverts to a plain
          paragraph. Inside a code block or blockquote, pressing <code>Enter</code>{' '}
          also drops you straight onto a new plain line below — use{' '}
          <code>Shift+Enter</code> to add a line within the block instead.
        </p>
        <div className="docs-preview col">
          <EvoRichTextArea
            tools={['paragraph', 'h2', 'divider', 'quote', 'code']}
            placeholder="Apply Blockquote or Inline code, then click the same tool again to toggle back to a paragraph."
            fullWidth
          />
        </div>
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Custom tools</div>
        <p className="docs-section-desc">
          Drop in your own buttons by passing an object instead of a string. The
          callback receives the editor handle so you can read or insert content.
        </p>
        <div className="docs-preview col">
          <EvoRichTextArea
            tools={[
              'bold',
              'italic',
              'divider',
              {
                key: 'timestamp',
                label: 'Insert timestamp',
                icon: <span style={{ fontSize: 11, fontWeight: 700 }}>⏱</span>,
                onAction: (api: EvoRichTextHandle) => {
                  api.insertHTML(`<span>${new Date().toLocaleString()}</span>&nbsp;`)
                },
              },
              {
                key: 'shrug',
                label: 'Insert shrug',
                icon: <span style={{ fontSize: 11, fontWeight: 700 }}>¯\\_</span>,
                onAction: (api: EvoRichTextHandle) => api.insertHTML('¯\\_(ツ)_/¯'),
              },
            ]}
            placeholder="Click ⏱ or ¯\\_ to insert custom content."
            fullWidth
          />
        </div>
        <CodeBlock code={`<EvoRichTextArea
  tools={[
    'bold', 'italic', 'divider',
    {
      key: 'timestamp',
      label: 'Insert timestamp',
      icon: <ClockIcon />,
      onAction: (api) => api.insertHTML(
        \`<span>\${new Date().toLocaleString()}</span>&nbsp;\`
      ),
    },
  ]}
/>`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Built-in tool keys</div>
        <PropsTable props={[
          { prop: "'bold'", type: 'mark', description: 'Bold text. Shortcut: ⌘B / Ctrl+B.' },
          { prop: "'italic'", type: 'mark', description: 'Italic text. Shortcut: ⌘I / Ctrl+I.' },
          { prop: "'underline'", type: 'mark', description: 'Underlined text. Shortcut: ⌘U / Ctrl+U.' },
          { prop: "'strike'", type: 'mark', description: 'Strikethrough text.' },
          { prop: "'h1' | 'h2' | 'h3'", type: 'block', description: 'Convert the current block to a heading. Click again to toggle back to a paragraph.' },
          { prop: "'paragraph'", type: 'block', description: 'Convert the current block to a paragraph — also clears a blockquote, code block, or heading.' },
          { prop: "'ul'", type: 'block', description: 'Bulleted list. Click again to toggle off.' },
          { prop: "'ol'", type: 'block', description: 'Numbered list. Click again to toggle off.' },
          { prop: "'quote'", type: 'block', description: 'Blockquote. Enter exits to a plain paragraph (Shift+Enter for a line within); click again to toggle the current line back to a paragraph.' },
          { prop: "'code'", type: 'block', description: 'Code block. Enter exits to a plain paragraph (Shift+Enter for a line break inside); click again to toggle the current line back to a paragraph.' },
          { prop: "'align-left' | 'align-center' | 'align-right'", type: 'block', description: 'Text alignment.' },
          { prop: "'link'", type: 'inline', description: 'Opens an inline URL prompt and wraps the selection in <a>.' },
          { prop: "'image'", type: 'inline', description: 'Opens the file picker. Paste & drop are always enabled.' },
          { prop: "'undo' | 'redo'", type: 'history', description: 'Browser-native undo / redo.' },
          { prop: "'clear'", type: 'utility', description: 'Removes all formatting from the selection.' },
          { prop: "'divider'", type: 'visual', description: 'A vertical separator in the toolbar (no action).' },
        ]} />
      </div>
    </div>
  )
}
