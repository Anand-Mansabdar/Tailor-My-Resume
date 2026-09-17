export function submitToOverleaf(overleaf, latex) {
  if (!overleaf?.action || !overleaf?.method || !overleaf?.field) {
    throw new Error("The backend did not provide complete Overleaf handoff information.");
  }

  const form = document.createElement("form");
  form.method = overleaf.method.toUpperCase();
  form.action = overleaf.action;
  form.target = "_blank";
  form.style.display = "none";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = overleaf.field;
  input.value = btoa(unescape(encodeURIComponent(latex)));

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  form.remove();
}