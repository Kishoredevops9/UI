import { TexteditorComponent } from '@app/shared/texteditor/texteditor.component';

declare var $;

export class TexteditorHelper {
  static openStaticWindow({ title, content, onSave, width = '600', height = '400', position = null }) {
    const popupHtml =
      `<div class="k-editor-dialog k-popup-edit-form k-edit-form-container" style="width:auto;">
           <div style="padding: 0 1em;">
            ${ content }
           </div>
           <div class="k-edit-buttons k-state-default">
             <button class="k-dialog-insert k-button k-primary">Save</button>
             <button class="k-dialog-close k-button">Cancel</button>
           </div>
         </div>`;
    const kendoWindowOptions = {
      modal: true,
      width,
      height,
      resizable: false,
      title,
      // Ensure the opening animation.
      visible: false,
      // Remove the Window from the DOM after closing animation is finished.
      deactivate: function (e) {
        e.sender.destroy();
      },
      open: function (e) {
        $('html, body').css('overflow', 'hidden');
      },
      close: function (e) {
        $('html, body').css('overflow', '');
      }
    } as any;
    if ( position ) {
      kendoWindowOptions.position = position;
    }
    const popupWindow = $(popupHtml)
      .appendTo(document.body)
      .kendoWindow(kendoWindowOptions).data('kendoWindow')
      .center().open();

    // Insert the new content in the Editor when the Insert button is clicked.
    popupWindow.element.find('.k-dialog-insert').click(() => {
      onSave(popupWindow.element);
    });

    // Close the Window when any button is clicked.
    popupWindow.element.find('.k-edit-buttons button').click(function () {
      // Detach custom event handlers to prevent memory leaks.
      popupWindow.element.find('.k-edit-buttons button').off();
      popupWindow.close();
    });

    return popupWindow.element;
  }

  static createElement(innerHtml): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = innerHtml.trim();
    return div.firstChild as HTMLElement;
  }

  static renderEditor(componentFactoryResolver, viewContainerRef, loaderComponentElement, content, height, input?) {
    const componentFactory = componentFactoryResolver.resolveComponentFactory(TexteditorComponent);
    const componentInstance = viewContainerRef.createComponent(componentFactory);
    const componentElement = componentInstance.location.nativeElement;
    loaderComponentElement.appendChild(componentElement);
    componentInstance.instance.height = height;
    componentInstance.instance.canAttachEKSLink = true;
    if ( input?.allowMedia !== undefined ) {
      componentInstance.instance.allowMedia = input?.allowMedia;
    }
    componentInstance.changeDetectorRef.detectChanges();
    setTimeout(() => {
      componentInstance.instance.setEditorValue(content);
    });

    return componentInstance.instance;
  }
}
