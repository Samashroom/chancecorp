const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 1280;
const DEFAULT_SCALE = 1;

function getFieldValue(el) {
  return el && el.value ? el.value : "";
}

function formatDateForCanvas(raw) {
  const r = (raw || "").replace(/\./g, "");
  if (!r) return "";
  const a = r.slice(0, 2);
  const b = r.slice(2, 4);
  const c = r.slice(4, 8);
  let out = a;
  if (b) out += "." + b;
  if (c) out += "." + c;
  return out;
}

function formatDateDisplay(raw) {
  const r = raw.replace(/\./g, "");
  const a = r.slice(0, 2);
  const b = r.slice(2, 4);
  const c = r.slice(4, 8);
  let out = a;
  if (b) out += "." + b;
  if (c) out += "." + c;
  return out;
}

function getRawDateValue(value) {
  return (value || "").replace(/\./g, "");
}

function displayCursorPos(rawPos) {
  if (rawPos <= 2) return rawPos;
  if (rawPos <= 4) return rawPos + 1;
  return rawPos + 2;
}

function attachDateMask(el, drawCard) {
  if (!el) return;

  el.addEventListener("input", function () {
    const rawBefore = getRawDateValue(el.value.slice(0, el.selectionStart || 0));
    const filtered = getRawDateValue(el.value)
      .replace(/[^0-9A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 8);
    const formatted = formatDateDisplay(filtered);
    el.value = formatted;
    const cursorPosition = displayCursorPos(Math.min(rawBefore.length, filtered.length));
    el.setSelectionRange(cursorPosition, cursorPosition);
    drawCard();
  });

  el.addEventListener("keydown", function (e) {
    const nav = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
    if (e.ctrlKey || e.metaKey || nav.includes(e.key)) return;
    if (e.key.length === 1 && !/^[0-9A-Za-z]$/.test(e.key)) {
      e.preventDefault();
    }
    const raw = getRawDateValue(el.value).replace(/[^0-9A-Za-z]/g, "");
    if (raw.length >= 8 && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  });

  el.addEventListener("paste", function (e) {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text") || "";
    const raw = getRawDateValue(el.value) + paste;
    const combined = raw
      .replace(/[^0-9A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 8);
    el.value = formatDateDisplay(combined);
    drawCard();
  });
}

function createCropper(photoInput, cropperImage, cropperContainer, applyCropBtn, cancelCropBtn, setUserPhoto, drawCard) {
  let cropper = null;

  if (photoInput) {
    photoInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, загрузите изображение!");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        cropperImage.src = event.target.result;
        cropperImage.onload = function () {
          if (cropper) {
            cropper.destroy();
          }
          cropperContainer.style.display = "block";
          cropper = new Cropper(cropperImage, {
            aspectRatio: 0.75,
            viewMode: 1,
            autoCropArea: 1,
            responsive: true,
            restore: true,
            guides: true,
            center: true,
            highlight: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: true,
            background: true,
          });
        };
      };
      reader.readAsDataURL(file);
    });
  }

  if (applyCropBtn) {
    applyCropBtn.addEventListener("click", function () {
      if (!cropper) return;
      const canvas2 = cropper.getCroppedCanvas({
        maxWidth: 750,
        maxHeight: 1000,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });
      const photo = new Image();
      photo.onload = function () {
        setUserPhoto(photo);
        drawCard();
        cropperContainer.style.display = "none";
        cropper.destroy();
        cropper = null;
      };
      photo.src = canvas2.toDataURL();
    });
  }

  if (cancelCropBtn) {
    cancelCropBtn.addEventListener("click", function () {
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
      cropperContainer.style.display = "none";
      photoInput.value = "";
    });
  }
}

function downloadImage(canvas, format) {
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 10);
  const name = `CHANCE_id_${timestamp}`;
  if (format === "png") {
    link.href = canvas.toDataURL("image/png");
    link.download = name + ".png";
  } else if (format === "jpg") {
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.download = name + ".jpg";
  }
  link.click();
}

function downloadPDF(canvas) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `CHANCE_id_${timestamp}.pdf`;
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window;
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [CANVAS_WIDTH, CANVAS_HEIGHT],
  });
  pdf.addImage(imgData, "PNG", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  pdf.save(filename);
}

export function createChanceIdApp(config) {
  const {
    canvasId,
    photoInputId,
    cropperContainerId,
    cropperImageId,
    applyCropBtnId,
    cancelCropBtnId,
    downloadPngBtnId,
    downloadJpgBtnId,
    downloadPdfBtnId,
    lineInputIds,
    choiceInputId,
    dateInputIds,
    placeValueGetter,
    scale = DEFAULT_SCALE,
  } = config;

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn("ChanceID canvas not found", canvasId);
    return { drawCard: () => {} };
  }

  const ctx = canvas.getContext("2d");
  const photoInput = document.getElementById(photoInputId);
  const cropperContainer = document.getElementById(cropperContainerId);
  const cropperImage = document.getElementById(cropperImageId);
  const applyCropBtn = document.getElementById(applyCropBtnId);
  const cancelCropBtn = document.getElementById(cancelCropBtnId);
  const downloadPngBtn = document.getElementById(downloadPngBtnId);
  const downloadJpgBtn = document.getElementById(downloadJpgBtnId);
  const downloadPdfBtn = document.getElementById(downloadPdfBtnId);
  const lineInputs = (lineInputIds || []).map((id) => document.getElementById(id)).filter(Boolean);
  const choiceInput = document.getElementById(choiceInputId);
  const dateInputs = (dateInputIds || []).map((id) => document.getElementById(id)).filter(Boolean);

  let userPhoto = null;

  canvas.width = CANVAS_WIDTH * scale;
  canvas.height = CANVAS_HEIGHT * scale;
  ctx.scale(scale, scale);

  function drawCard() {
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#1d1dca";
    ctx.fillRect(0, 0, 120, CANVAS_HEIGHT);
    ctx.fillStyle = "#f3e600";
    ctx.fillRect(120, 0, CANVAS_WIDTH - 120, 90);
    ctx.fillStyle = "#2442c7";
    ctx.font = "bold 68px 'Arial Narrow', Arial, sans-serif";
    ctx.fillText("CHANCE id", 1980, 68);
    ctx.fillStyle = "#efefef";
    ctx.strokeStyle = "#2c7a88";
    ctx.lineWidth = 8;
    ctx.fillRect(60, 120, 750, 1000);
    ctx.strokeRect(60, 120, 750, 1000);
    if (userPhoto) {
      ctx.drawImage(userPhoto, 60, 120, 750, 1000);
    }

    function block(x, y, w, h, color, text, tx, ty, size = 48) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "#8fb6c0";
      ctx.font = `bold ${size}px Arial`;
      ctx.fillText(text, tx, ty);
    }

    block(840, 120, 1520, 150, "#ececec", "имя", 850, 160);
    block(840, 280, 1520, 150, "#ececec", "второе имя", 850, 320);
    block(840, 440, 1520, 150, "#ececec", "фамилия", 850, 480);
    ctx.fillStyle = "#7d8da1";
    ctx.fillRect(840, 610, 1520, 220);
    ctx.fillStyle = "#9ec1c9";
    ctx.font = "bold 48px 'Arial Narrow', Arial, sans-serif";
    ctx.fillText("гендерный маркер", 860, 660);
    ctx.fillText("дата регистрации", 1380, 660);
    ctx.fillText("дата выдачи", 1900, 660);
    ctx.fillStyle = "#d9eaf1";
    ctx.fillRect(840, 840, 1520, 400);
    ctx.fillStyle = "#6f8a96";
    ctx.font = "bold 56px 'Arial Narrow', Arial, sans-serif";
    ctx.fillText("место регистрации", 920, 900);
    ctx.fillText("место учёта", 920, 1080);
    ctx.fillStyle = "#ececec";
    ctx.font = "bold 44px 'Arial Narrow', Arial, sans-serif";
    ctx.fillText("номер", 130, 1200);
    ctx.fillText("счета:", 130, 1240);
    ctx.fillStyle = "#14586b";
    ctx.font = "bold 80px 'Arial Narrow'";
    const v1 = getFieldValue(lineInputs[0]);
    const v2 = getFieldValue(lineInputs[1]);
    const v3 = getFieldValue(lineInputs[2]);
    const c1 = getFieldValue(choiceInput);
    const d1raw = getFieldValue(dateInputs[0]);
    const d2raw = getFieldValue(dateInputs[1]);
    const d1 = formatDateForCanvas(d1raw);
    const d2 = formatDateForCanvas(d2raw);
    const placeValues = placeValueGetter ? placeValueGetter() : { t1: "", t2: "" };
    const t1 = placeValues.t1;
    const t2 = placeValues.t2;
    ctx.fillText(v1, 860, 240);
    ctx.fillText(v2, 860, 400);
    ctx.fillText(v3, 860, 560);
    ctx.fillText(c1, 1000, 760);
    ctx.fillText(d1, 1355, 760);
    ctx.fillText(d2, 1850, 760);
    ctx.fillText(t1, 900, 1000);
    ctx.fillText(t2, 900, 1180);
  }

  createCropper(
    photoInput,
    cropperImage,
    cropperContainer,
    applyCropBtn,
    cancelCropBtn,
    (photo) => {
      userPhoto = photo;
    },
    drawCard,
  );

  lineInputs.forEach((el) => {
    el.addEventListener("input", drawCard);
  });

  if (choiceInput) {
    choiceInput.addEventListener("change", drawCard);
  }

  dateInputs.forEach((el) => {
    attachDateMask(el, drawCard);
  });

  if (downloadPngBtn) {
    downloadPngBtn.addEventListener("click", () => downloadImage(canvas, "png"));
  }

  if (downloadJpgBtn) {
    downloadJpgBtn.addEventListener("click", () => downloadImage(canvas, "jpg"));
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => downloadPDF(canvas));
  }

  return {
    drawCard,
  };
}
