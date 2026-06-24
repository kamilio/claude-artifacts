for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    await navigator.clipboard.writeText(value);
    const original = button.textContent;
    button.textContent = "Copied";
    button.dataset.copied = "true";
    window.setTimeout(() => {
      button.textContent = original;
      delete button.dataset.copied;
    }, 1400);
  });
}
