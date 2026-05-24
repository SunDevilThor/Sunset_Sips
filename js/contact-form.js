(() => {
  const logger = window.SunsetSipsLogger;
  const testingEmailAddress = "thorkeane@gmail.com";

  function encodeMailtoValue(value) {
    return encodeURIComponent(value || "Not provided");
  }

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

  function initializeContactForm() {
    const inquiryForm = document.querySelector("[data-inquiry-form]");
    const formStatus = document.querySelector("[data-form-status]");

    if (!inquiryForm) {
      logger?.warn("Inquiry form was not found on this page.");
      return;
    }

    inquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(inquiryForm);
      const senderEmail = formData.get("email");

      if (!senderEmail) {
        formStatus.textContent = "Please add your email so Bree can respond to your inquiry.";
        logger?.warn("Inquiry form submit was blocked because email was missing.");
        return;
      }

      const emailSubject = `Sunset Sips Inquiry - ${formData.get("eventType") || "New Event"}`;
      const emailBody = buildEmailBody(formData);
      const mailtoUrl = `mailto:${testingEmailAddress}?subject=${encodeMailtoValue(emailSubject)}&body=${encodeMailtoValue(emailBody)}`;

      logger?.info("Opening mailto inquiry flow.", {
        testingEmailAddress,
        eventType: formData.get("eventType"),
        eventDate: formData.get("eventDate")
      });

      formStatus.textContent = "Opening your email app with the inquiry details. Please send the email from there.";
      window.location.href = mailtoUrl;
    });
  }

  document.addEventListener("DOMContentLoaded", initializeContactForm);
})();
