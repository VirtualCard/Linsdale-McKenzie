(() => {
  "use strict";

  // Leave hostedUrl blank to automatically use the live URL where this page is hosted.
  const CARD_CONFIG = {
    hostedUrl: "",
    qrImage: "images/qr-code.jpg",
    qrDownloadName: "Linsdale-McKenzie-QR-Code.jpg",
    title: "Linsdale McKenzie | Digital Business Card",
    shareText: "Linsdale McKenzie — Founder & CEO | Leadership Development | Executive Recruitment"
  };

  const $ = (selector) => document.querySelector(selector);
  const hostedUrl = CARD_CONFIG.hostedUrl || window.location.href.split("#")[0];
  const shareText = CARD_CONFIG.shareText;
  const shareDialog = $("#shareDialog");
  const toast = $("#toast");

  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  async function copyText(text, message = "Link copied") {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
      showToast(message);
    }
  }

  const encodedUrl = encodeURIComponent(hostedUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(CARD_CONFIG.title);

  $("#shareWhatsApp").href = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  $("#shareSms").href = `sms:?&body=${encodedText}%20${encodedUrl}`;
  $("#shareFacebook").href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  $("#shareX").href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  $("#shareLinkedIn").href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  $("#shareTelegram").href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  $("#shareReddit").href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
  $("#shareEmail").href = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;

  $("#shareCardBtn").addEventListener("click", () => {
    if (typeof shareDialog.showModal === "function") shareDialog.showModal();
    else shareDialog.setAttribute("open", "");
  });

  $("#closeShareBtn").addEventListener("click", () => shareDialog.close());
  shareDialog.addEventListener("click", (event) => {
    if (event.target === shareDialog) shareDialog.close();
  });

  $("#copyHostedLinkBtn").addEventListener("click", () => copyText(hostedUrl, "Hosted link copied"));

  $("#nativeShareBtn").addEventListener("click", async () => {
    if (!navigator.share) {
      await copyText(hostedUrl, "Link copied — paste it into any app");
      return;
    }
    try {
      await navigator.share({ title: CARD_CONFIG.title, text: shareText, url: hostedUrl });
    } catch (error) {
      if (error && error.name !== "AbortError") showToast("Unable to open the share menu");
    }
  });

  $("#downloadQrBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = CARD_CONFIG.qrImage;
    link.download = CARD_CONFIG.qrDownloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("QR code download started");
  });
})();
