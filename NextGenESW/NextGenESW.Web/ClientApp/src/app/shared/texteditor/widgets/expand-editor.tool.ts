
import { TexteditorHelper } from '@app/shared/texteditor/texteditor.helper';

declare var $;

export const ExpandEditorTool = (parentEditor, input) => {
  let editor;
  let container;

  function expandEditor() {
    container = this;
    editor = $(container).data('kendoEditor');
    let componentInstance;
    const windowHeight = '90vh';
    const popupWindowEl = TexteditorHelper.openStaticWindow({
      title: 'Edit Detail',
      width: '90vw',
      height: windowHeight,
      position: {
        top: '5vh'
      },
      onSave: () => {
        const editorValue = componentInstance.getEditorValue();
        parentEditor.setEditorValue(editorValue);
      },
      content: `<div id="content"></div>`
    });
    componentInstance = TexteditorHelper.renderEditor(parentEditor.componentFactoryResolver, parentEditor.viewContainerRef, popupWindowEl[0].querySelector('#content'), editor.value(), `calc(${ windowHeight } - 157px)`, input);
  }

  return {
    name: 'full-screen',
    icon: 'expand',
    tooltip: 'Expand',
    exec: expandEditor
  };
};
