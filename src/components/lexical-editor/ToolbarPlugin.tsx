import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import React, { useCallback, useEffect, useState } from 'react';
import {
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiBold,
  RiCodeLine,
  RiH1,
  RiH2,
  RiImageAddLine,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
  RiParagraph,
  RiStrikethrough,
} from 'react-icons/ri';

const Divider = () => (
  <div className="w-[1px] bg-zinc-200 dark:bg-zinc-700 mx-1 my-1" />
);

interface IToolbarButton {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  icon: React.ElementType;
  title: string;
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  icon: Icon,
  title,
}: IToolbarButton) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-md transition-colors cursor-pointer disabled:opacity-30
      ${
        active
          ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
      }`}
  >
    <Icon size={18} />
  </button>
);

export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      1,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      1,
    );
  }, [editor]);

  const formatHeading = (level: 'h1' | 'h2') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(level));
      }
    });
  };

  // Mock para inclusão de imagem (URL)
  const insertImage = useCallback(() => {
    const url = prompt('Cole a URL da imagem:');
    if (url) {
      editor.update(() => {
        // Aqui você usaria o ImageNode customizado
        // Por enquanto vamos simular inserindo um parágrafo com o link
        // mas o ideal é implementar o plugin de imagem do Lexical
      });
    }
  }, [editor]);

  return (
    <div className="flex flex-wrap gap-0.5 p-1 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 sticky top-0 z-10">
      <ToolbarButton
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        disabled={!canUndo}
        icon={RiArrowGoBackLine}
        title="Desfazer"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        disabled={!canRedo}
        icon={RiArrowGoForwardLine}
        title="Refazer"
      />

      <Divider />

      <ToolbarButton
        onClick={() => formatHeading('h1')}
        icon={RiH1}
        title="Título 1"
      />
      <ToolbarButton
        onClick={() => formatHeading('h2')}
        icon={RiH2}
        title="Título 2"
      />
      <ToolbarButton
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection))
              $setBlocksType(selection, () => $createHeadingNode('h3'));
          })
        }
        icon={RiParagraph}
        title="Parágrafo"
      />

      <Divider />

      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        icon={RiBold}
        title="Negrito"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        icon={RiItalic}
        title="Itálico"
      />
      <ToolbarButton
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }
        icon={RiStrikethrough}
        title="Riscado"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        icon={RiCodeLine}
        title="Código embutido"
      />

      <Divider />

      <ToolbarButton
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        icon={RiListUnordered}
        title="Lista de marcadores"
      />
      <ToolbarButton
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        icon={RiListOrdered}
        title="Lista numerada"
      />

      <Divider />

      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        icon={RiAlignLeft}
        title="Alinhar à esquerda"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        icon={RiAlignCenter}
        title="Centralizar"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        icon={RiAlignRight}
        title="Alinhar à direita"
      />
      <ToolbarButton
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
        }
        icon={RiAlignJustify}
        title="Justificar"
      />

      <Divider />

      <ToolbarButton
        onClick={insertImage}
        icon={RiImageAddLine}
        title="Adicionar Imagem"
      />
    </div>
  );
};
