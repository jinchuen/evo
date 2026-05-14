import { useRef } from 'react'
import { EvoRichTextArea, EvoButton, EvoStack, EvoDivider } from '@justin_evo/evo-ui'
import type { EvoRichTextHandle } from '@justin_evo/evo-ui'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'
import { SubPageBack } from '../components/SubPageBack'

export default function RichTextAreaApiPage() {
  const ref = useRef<EvoRichTextHandle | null>(null)

  return (
    <div>
      <SubPageBack to="/components/rich-text-area" label="Rich Text Area" />
      <div className="docs-page-header">
        <div className="docs-page-tag">Component · Rich Text Area</div>
        <h1 className="docs-page-title">API reference</h1>
        <p className="docs-page-desc">
          Props, the imperative ref handle, and the editor's keyboard shortcuts.
        </p>
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Props</div>
        <PropsTable props={[
          { prop: 'value', type: 'string', description: 'Controlled HTML content. Pair with `onChange` to drive the editor from React state.' },
          { prop: 'defaultValue', type: 'string', description: 'Initial HTML for uncontrolled use. Ignored if `value` is set.' },
          { prop: 'onChange', type: '(html: string) => void', description: 'Fires on every edit. Receives the editor\'s current HTML.' },
          { prop: 'tools', type: 'EvoRichTextTool[]', default: 'sensible default', description: 'Toolbar contents. See the Tools page for the built-in keys and custom-tool shape.' },
          { prop: 'placeholder', type: 'string', default: "'Start writing…'", description: 'Shown when the editor is empty.' },
          { prop: 'minHeight', type: 'number | string', default: '160', description: 'Minimum editor height. Numbers are treated as pixels.' },
          { prop: 'maxHeight', type: 'number | string', description: 'Maximum height before the editor scrolls. Toolbar stays sticky.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Greys out the editor and blocks all interaction.' },
          { prop: 'readOnly', type: 'boolean', default: 'false', description: 'Same look as editable, but no editing.' },
          { prop: 'label', type: 'string', description: 'Optional label rendered above the editor.' },
          { prop: 'helperText', type: 'string', description: 'Helper text below the editor. Hidden when `error` is set.' },
          { prop: 'error', type: 'string', description: 'Error message; also marks the field invalid for assistive tech.' },
          { prop: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the editor to fill its container.' },
          { prop: 'onImageUpload', type: '(file: File) => Promise<string>', description: 'Upload handler. Resolve with the final URL to embed. Without this, images embed as base64.' },
          { prop: 'acceptedImageTypes', type: 'string[]', default: 'png/jpeg/gif/webp/svg', description: 'Allowed MIME types for image upload.' },
          { prop: 'maxImageSize', type: 'number', description: 'Maximum image size in bytes. Larger images trigger `onImageError`.' },
          { prop: 'onImageError', type: '(err) => void', description: '`err.code` is `\'too-large\' | \'wrong-type\' | \'upload-failed\'`.' },
          { prop: 'className', type: 'string', description: 'Additional class on the root wrapper.' },
          { prop: 'id', type: 'string', description: 'Forwarded to the editable surface for label association.' },
        ]} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Imperative ref handle</div>
        <p className="docs-section-desc">
          Pass a <code>ref</code> to drive the editor from outside — handy for
          custom toolbars, slash-command menus, or programmatic insertion.
        </p>
        <div className="docs-preview col">
          <EvoRichTextArea
            ref={ref}
            tools={['bold', 'italic', 'divider', 'image']}
            placeholder="Use the buttons below to drive me."
            fullWidth
          />
          <EvoStack direction="row" gap="0.5rem" wrap>
            <EvoButton
              size="sm"
              label="Insert HTML"
              onClick={() => ref.current?.insertHTML('<strong>Hello!</strong> ')}
            />
            <EvoButton
              size="sm"
              label="Insert image"
              onClick={() => ref.current?.insertImage('https://placehold.co/400x200/0891b2/ffffff?text=Inserted')}
            />
            <EvoButton
              size="sm"
              variant="outline"
              label="Get plain text"
              onClick={() => alert(ref.current?.getText())}
            />
            <EvoButton
              size="sm"
              variant="ghost"
              label="Clear"
              onClick={() => ref.current?.clear()}
            />
          </EvoStack>
        </div>
        <CodeBlock code={`const editorRef = useRef<EvoRichTextHandle | null>(null)

<EvoRichTextArea ref={editorRef} />

editorRef.current?.insertHTML('<strong>Hello!</strong>')
editorRef.current?.insertImage('https://example.com/cat.png', 'A cat')
editorRef.current?.getHTML()
editorRef.current?.getText()
editorRef.current?.setHTML('<p>Replaced.</p>')
editorRef.current?.focus()
editorRef.current?.clear()`} />
      </div>

      <div className="docs-section">
        <div className="docs-section-title">Handle methods</div>
        <PropsTable props={[
          { prop: 'getHTML()', type: '() => string', description: 'Returns the editor\'s current HTML.' },
          { prop: 'setHTML(html)', type: '(html: string) => void', description: 'Replaces the editor\'s content.' },
          { prop: 'getText()', type: '() => string', description: 'Returns the editor\'s text content (no markup).' },
          { prop: 'focus()', type: '() => void', description: 'Focuses the editor.' },
          { prop: 'insertImage(src, alt?)', type: '(src: string, alt?: string) => void', description: 'Inserts an image at the caret.' },
          { prop: 'insertHTML(html)', type: '(html: string) => void', description: 'Inserts arbitrary HTML at the caret.' },
          { prop: 'clear()', type: '() => void', description: 'Empties the editor.' },
        ]} />
      </div>

      <EvoDivider />

      <div className="docs-section">
        <div className="docs-section-title">Keyboard shortcuts</div>
        <PropsTable props={[
          { prop: '⌘B / Ctrl+B', type: 'shortcut', description: 'Bold the selection.' },
          { prop: '⌘I / Ctrl+I', type: 'shortcut', description: 'Italicize the selection.' },
          { prop: '⌘U / Ctrl+U', type: 'shortcut', description: 'Underline the selection.' },
          { prop: '⌘Z / Ctrl+Z', type: 'shortcut', description: 'Undo (browser-native).' },
          { prop: '⇧⌘Z / Ctrl+Y', type: 'shortcut', description: 'Redo (browser-native).' },
          { prop: 'Paste image', type: 'shortcut', description: 'Pasting an image from the clipboard inserts it inline.' },
          { prop: 'Drop file', type: 'shortcut', description: 'Dropping an image file onto the editor inserts it inline.' },
        ]} />
      </div>
    </div>
  )
}
