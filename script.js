const qrText = document.getElementById("qrText");
const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");

const downloadBtn = document.getElementById("downloadBtn");
const copyBtn = document.getElementById("copyBtn");

const qrcodeContainer = document.getElementById("qrcode");
const emptyState = document.getElementById("emptyState");

const charCount = document.getElementById("charCount");

let qrCode = null;

/* =========================
   CHARACTER COUNTER
========================= */

qrText.addEventListener("input", () => {
    charCount.textContent = qrText.value.length;
});

/* =========================
   GENERATE QR
========================= */

function generateQRCode() {

    const text = qrText.value.trim();

    if (!text) {

        qrText.classList.add("error");

        setTimeout(() => {
            qrText.classList.remove("error");
        }, 500);

        qrText.focus();

        return;
    }

    // Clear previous QR
    qrcodeContainer.innerHTML = "";

    // Create new QR
    qrCode = new QRCode(qrcodeContainer, {
        text: text,
        width: 220,
        height: 220,
        colorDark: "#111111",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Show QR
    qrcodeContainer.style.display = "block";
    emptyState.style.display = "none";

    // Enable buttons
    downloadBtn.disabled = false;
    copyBtn.disabled = false;
}

/* =========================
   GENERATE BUTTON
========================= */

generateBtn.addEventListener("click", generateQRCode);

/* =========================
   ENTER KEY
========================= */

qrText.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key === "Enter") {
        generateQRCode();
    }

});

/* =========================
   DOWNLOAD QR
========================= */

downloadBtn.addEventListener("click", () => {

    if (!qrCode) {
        return;
    }

    const canvas = qrcodeContainer.querySelector("canvas");

    if (!canvas) {
        return;
    }

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.href = image;
    link.download = "qr-code.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

});

/* =========================
   COPY TEXT
========================= */

copyBtn.addEventListener("click", async () => {

    const text = qrText.value.trim();

    if (!text) {
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        const originalText = copyBtn.textContent;

        copyBtn.textContent = "Copied!";

        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);

    } catch (error) {

        console.error("Failed to copy:", error);

    }

});

/* =========================
   RESET
========================= */

resetBtn.addEventListener("click", () => {

    qrText.value = "";

    charCount.textContent = "0";

    qrcodeContainer.innerHTML = "";
    qrcodeContainer.style.display = "none";

    emptyState.style.display = "block";

    downloadBtn.disabled = true;
    copyBtn.disabled = true;

    qrCode = null;

    qrText.focus();

});