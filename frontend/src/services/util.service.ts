import moment from "moment";
import obj from "object-path";

declare var window: any;

export default {
  safeStr(str) {
    if (str) return str.replace(/[^a-zA-Z ]/g, "");
  },
  loadApp() {
    window.app = obj.get(window.params, "parameter.app");
    window.app = this.safeStr(window.app);
    if (!window.app) window.app = "default";
    console.log(window.app);
  },
  generateId() {
    return parseInt(`${(new Date().getTime() / 100) % 10000000}`);
  },
  get(data, path, def) {
    return obj.get(data, path, def);
  },
  set(data, path, value) {
    return obj.set(data, path, value);
  },
  moment(d) {
    return moment(d)
  },
  resizeImage(file, maxSize) {
    let reader = new FileReader();
    let image: any = new Image();
    let canvas = document.createElement("canvas");

    const dataURItoBlob = (dataURI) => {
      const bytes = dataURI.split(',')[0].indexOf('base64') >= 0
        ? atob(dataURI.split(',')[1])
        : unescape(dataURI.split(',')[1]);
      const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const max = bytes.length;
      const ia = new Uint8Array(max);
      for (let i = 0; i < max; i += 1) ia[i] = bytes.charCodeAt(i);
      return new Blob([ia], { type: mime });
    };    

    const resize = () => {
      let { width, height } = image;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg");

      return dataUrl;
    };

    return new Promise((ok, no) => {
      if (!file.type.match(/image.*/)) {
        no(new Error("Not an image"));
        return;
      }

      reader.onload = (readerEvent) => {
        image.onload = () => ok(resize());
        image.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    });
  },
};
