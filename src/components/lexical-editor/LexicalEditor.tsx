import { CodeNode } from '@lexical/code';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import React, { useEffect, useState } from 'react';
import { EditorTheme } from './EditorTheme';
import { ToolbarPlugin } from './ToolbarPlugin';

interface ILexicalEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Plugin interno para sincronizar o HTML
const HtmlPlugin = ({
  initialHtml,
  onHtmlChange,
}: {
  initialHtml: string;
  onHtmlChange: (html: string) => void;
}) => {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsFirstRender] = useState(false);

  useEffect(() => {
    if (!isInitialized && initialHtml && editor) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = editor.getEditorState()._nodeMap.get('root') as any;
        if (root) {
          root.clear();
          nodes.forEach((node) => root.append(node));
        }
      });
      editor.getEditorState().read(() => setIsFirstRender(true));
    }
  }, [editor, initialHtml, isInitialized]);

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onHtmlChange(html);
        });
      }}
    />
  );
};

export const LexicalEditor: React.FC<ILexicalEditorProps> = ({
  value,
  onChange,
  placeholder = 'Comece a escrever...',
}) => {
  const initialConfig = {
    namespace: 'PortfolioEditor',
    theme: EditorTheme,
    onError: (error: Error) => console.error(error),
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode],
  };

  return (
    <div className="relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm min-h-[500px] flex flex-col">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative flex-1">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="focus:outline-none min-h-[450px] p-8 text-zinc-900 dark:text-zinc-100 h-full prose dark:prose-invert max-w-none" />
            }
            placeholder={
              <div className="absolute top-8 left-8 text-zinc-400 dark:text-zinc-500 pointer-events-none italic">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <HtmlPlugin initialHtml={value} onHtmlChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
};
