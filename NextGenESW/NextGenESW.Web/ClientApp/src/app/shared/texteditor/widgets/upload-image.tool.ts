declare var $;

export const UploadImageTool = () => {
  let editor;
  let container;

  function uploadImage() {
    container = this;
    editor = $(container).data('kendoEditor');
    const fileInput = createInputImageFileEl();
    container.append(fileInput);

    fileInput.onchange = (event: any) => {
      toBase64(event?.target?.files[0]).then(base64Content => {
        const imgElement = $(`<img src='${ base64Content }' />`)[0];

        editor.paste(imgElement.outerHTML);
        editor.trigger('change');
        imgElement.remove();
      });

      fileInput.remove();
    };

    clickElement(fileInput);
  }

  function createInputImageFileEl() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.value = null;
    return fileInput;
  }

  function clickElement(elem) {
    if ( elem && document.createEvent ) {
      var evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, false);
      elem.dispatchEvent(evt);
    }
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  return {
    name: 'image-insert',
    icon: 'image-insert',
    tooltip: 'Upload Image',
    exec: uploadImage
  };
};
