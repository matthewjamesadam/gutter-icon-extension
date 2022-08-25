import {
  DecorationOptions,
  ExtensionContext,
  MarkdownString,
  Range,
  TextEditor,
  ThemableDecorationAttachmentRenderOptions,
  ThemeColor,
  Uri,
  window,
} from "vscode";

const renderOptions: ThemableDecorationAttachmentRenderOptions = {
  backgroundColor: new ThemeColor("editor.background"),
  color: new ThemeColor("editor.foreground"),
  width: "2em",
  contentText: " ",
};

const decorationType = window.createTextEditorDecorationType({
  isWholeLine: true,
});

const hoverMessage = new MarkdownString(
  `**[Click here for More Information!](https://earnesticecream.com)**
  
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`
);
// markdown.isTrusted = true;

function DecorateEditor(textEditor: TextEditor, context: ExtensionContext) {
  const decorations: DecorationOptions[] = Array.from(
    Array(textEditor.document.lineCount).keys()
  ).map((line, idx) => {
    const range = new Range(idx, 0, idx, 9999);

    if (idx === 10) {
      return {
        range,
        hoverMessage,
        renderOptions: {
          before: {
            ...renderOptions,
            contentText: undefined,
            contentIconPath: Uri.joinPath(
              context.extensionUri,
              "/gutter-icon.svg"
            ),
          },
        },
      };
    }
    return {
      range,
      renderOptions: { before: renderOptions },
    };
  });
  textEditor.setDecorations(decorationType, decorations);
}

export function activate(context: ExtensionContext) {
  window.onDidChangeVisibleTextEditors((textEditors) => {
    for (const textEditor of textEditors) {
      DecorateEditor(textEditor, context);
    }
  });

  for (const textEditor of window.visibleTextEditors) {
    DecorateEditor(textEditor, context);
  }
}
