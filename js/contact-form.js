(() => {
  const logger = window.SunsetSipsLogger;
  const testingEmailAddress = "thorkeane@gmail.com";

  function buildEmailBody(formData) {
    return [
      "New Sunset Sips inquiry:",
      "",
      `Name: ${formData.get("name") || "Not provided"}`,
      `Email: ${formData.get("email") || "Not provided"}`,
      `Phone: ${formData.get("phone") || "Not provided"}`,
      `Event Type: ${formData.get("eventType") || "Not provided"}`,
      `Event Date: ${formData.get("eventDate") || "Not provided"}`,
      `Event Location: ${formData.get("eventLocation") || "Not provided"}`,
      `Estimated Guest Count: ${formData.get("guestCount") || "Not provided"}`,
      "",
      "Message:",
      formData.get("message") || "Not provided"
    ].join("\n");
  }

  function buildMailtoUrl(emailSubject, emailBody) {
    const mailtoParameters = new URLSearchParams({
      subject: emailSubject,
      body: emailBody
    });

    return `mailto:${testingEmailAddress}?${mailtoParameters.toString()}`;
  }

  async function copyInquiryDetails(inquiryOutput, formStatus) {
    const inquiryText = inquiryOutput.value;

    if (!inquiryText) {
      formStatus.textContent = "There are no inquiry details to copy yet.";
      logger?.warn("Copy inquiry was requested before inquiry text existed.");
      return;
    }

    try {
      await navigator.clipboard.writeText(inquiryText);
      formStatus.textContent = "Inquiry details copied. You can paste them into your email app.";
      logger?.info("Inquiry details were copied to clipboard.");
    } catch (clipboardError) {
      inquiryOutput.focus();
      inquiryOutput.select();
      formStatus.textContent = "Copy failed automatically. Select the text box and press Command + C.";
      logger?.error("Clipboard copy failed for inquiry details.", { clipboardError });
    }
  }

  function initializeContactForm() {
    const inquiryForm = document.querySelector("[data-inquiry-form]");
    const formStatus = document.querySelector("[data-form-status]");
    const inquiryFallback = document.querySelector("[data-inquiry-fallback]");
    const inquiryOutput = document.querySelector("[data-inquiry-output]");
    const copyInquiryButton = document.querySelector("[data-copy-inquiry]");
    const directEmailLink = document.querySelector("[data-direct-email-link]");

    if (!inquiryForm) {
      logger?.warn("Inquiry form was not found on this page.");
      return;
    }

    if (!formStatus || !inquiryFallback || !inquiryOutput || !copyInquiryButton || !directEmailLink) {
      logger?.error("Inquiry form fallback elements were not found. Mailto behavior may be incomplete.", {
        hasFormStatus: Boolean(formStatus),
        hasInquiryFallback: Boolean(inquiryFallback),
        hasInquiryOutput: Boolean(inquiryOutput),
        hasCopyInquiryButton: Boolean(copyInquiryButton),
        hasDirectEmailLink: Boolean(directEmailLink)
      });
      return;
    }

    copyInquiryButton.addEventListener("click", () => {
      copyInquiryDetails(inquiryOutput, formStatus);
    });

    inquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(inquiryForm);
      const senderEmail = formData.get("email");

      if (!senderEmail) {
        formStatus.textContent = "Please add your email so Sunset Sips can respond to your inquiry.";
        logger?.warn("Inquiry form submit was blocked because email was missing.");
        return;
      }

      const emailSubject = `Sunset Sips Inquiry - ${formData.get("eventType") || "New Event"}`;
      const emailBody = buildEmailBody(formData);
      const mailtoUrl = buildMailtoUrl(emailSubject, emailBody);

      inquiryOutput.value = `To: ${testingEmailAddress}\nSubject: ${emailSubject}\n\n${emailBody}`;
      directEmailLink.href = mailtoUrl;
      inquiryFallback.hidden = false;
      formStatus.textContent = "Inquiry prepared. Click Open Email App, or copy the inquiry details below.";

      logger?.info("Prepared inquiry email details and updated the mailto fallback link.", {
        testingEmailAddress,
        eventType: formData.get("eventType"),
        eventDate: formData.get("eventDate"),
        mailtoCharacterLength: mailtoUrl.length,
        autoOpenedMailClient: false
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initializeContactForm);
})();