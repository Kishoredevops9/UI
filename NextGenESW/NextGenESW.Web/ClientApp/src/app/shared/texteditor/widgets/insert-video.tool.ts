
import { TexteditorHelper } from '@app/shared/texteditor/texteditor.helper';

declare var $;

export const InsertVideoTool = () => {
  let editor;
  let container;

  function insertVideo() {
    container = this;
    editor = $(container).data('kendoEditor');
    const storedRange = editor.getRange();

    TexteditorHelper.openStaticWindow({
      title: 'Insert Video',
      content: `<p><textarea cols="60" rows="10" style="width:100%"></textarea></p>
             <p><input type="text" id="width" class="k-textbox" placeholder="Width px" >
             <input type="text" id="height" class="k-textbox" placeholder="Height px" >`,
      onSave: (windowElement) => {
        let customHtml = windowElement.find('textarea').val();
        const width = windowElement.find('#width').val();
        const height = windowElement.find('#height').val();
        if ( width && height ) {
          const iframeEl = TexteditorHelper.createElement(customHtml);
          iframeEl.setAttribute('width', width);
          iframeEl.setAttribute('height', height);
          customHtml = iframeEl.outerHTML;
        }

        editor.selectRange(storedRange);
        editor.exec('inserthtml', { value: customHtml });
      }
    });
  }

  return  {
    name: 'video-external',
    icon: 'play',
    tooltip: 'Insert Video',
    exec: insertVideo
  };
};
