import type { Editor } from 'prosekit/core';
import type { FC } from 'react';

import { createContext, useContext, useEffect, useState } from 'react';

import type { EditorExtension } from './extension';

import { setMarkdownContent } from './markdownContent';

/**
 * Some methods for operating the editor from outside the editor component.
 */
export interface EditorHandle {
  /**
   * Insert text at the current text cursor position.
   */
  insertText: (text: string) => void;

  /**
   * Replace the current document with the given markdown.
   */
  setMarkdown: (markdown: string) => void;
}

const HandleContext = createContext<EditorHandle | null>(null);
const SetHandleContext = createContext<((handle: EditorHandle) => void) | null>(
  null
);

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [handle, setHandle] = useState<EditorHandle | null>(null);

  return (
    <HandleContext.Provider value={handle}>
      <SetHandleContext.Provider value={setHandle}>
        {children}
      </SetHandleContext.Provider>
    </HandleContext.Provider>
  );
};

/**
 * A hook for accessing the text editor handle.
 */
export const useEditorContext = (): EditorHandle | null => {
  return useContext(HandleContext);
};

/**
 * A hook to register the text editor handle.
 */
export const useEditorHandle = (editor: Editor<EditorExtension>) => {
  const setHandle = useContext(SetHandleContext);

  useEffect(() => {
    const handle: EditorHandle = {
      insertText: (text: string): void => {
        if (!editor.mounted) {
          return;
        }

        editor.commands.insertText({ text });
      },
      setMarkdown: (markdown: string): void => {
        setMarkdownContent(editor, markdown);
      }
    };

    setHandle?.(handle);
  }, [setHandle, editor]);
};

/**
 * A higher-order component for providing the text editor handle.
 */
export const withEditorContext = <Props extends object>(
  Component: FC<Props>
): FC<Props> => {
  const WithEditorContext: FC<Props> = (props: Props) => {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  };

  return WithEditorContext;
};
