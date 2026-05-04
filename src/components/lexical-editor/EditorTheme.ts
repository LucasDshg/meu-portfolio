export const EditorTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder:
    'text-zinc-400 dark:text-zinc-500 absolute top-8 left-8 pointer-events-none italic',
  paragraph: 'mb-4',
  quote:
    'border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-500',
  heading: {
    h1: 'text-3xl font-bold mb-4 mt-6 text-zinc-900 dark:text-zinc-100',
    h2: 'text-2xl font-semibold mb-3 mt-5 text-zinc-900 dark:text-zinc-100',
    h3: 'text-xl font-medium mb-2 mt-4 text-zinc-900 dark:text-zinc-100',
  },
  list: {
    nested: { listitem: 'list-none' },
    ol: 'list-decimal ml-6 mb-4',
    ul: 'list-disc ml-6 mb-4',
    listitem: 'mb-1',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    strikethrough: 'line-through',
    underline: 'underline',
    code: 'bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 font-mono text-sm text-teal-600 dark:text-teal-400',
  },
  code: 'bg-zinc-900 text-zinc-100 font-mono text-sm p-4 rounded-lg block overflow-x-auto my-4 border border-zinc-800',
  codeHighlight: {
    atrule: 'text-purple-400',
    attrName: 'text-green-400',
    attrValue: 'text-yellow-200',
    comment: 'text-zinc-500 italic',
    function: 'text-blue-400',
  },
};
