Prism.plugins.toolbar.registerButton("explain", function (env) {
  const button = document.createElement("button");
  button.innerHTML = '<i class="bi bi-megaphone"></i> Explain';

  const get_selected_text = () => {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
      return document.selection.createRange().text;
    }
    return "";
  };

  const select_element_text = (element) => {
    let selected_text = "";

    if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
      selected_text = range.text;
    } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
      selected_text = selection.toString();
    }

    return selected_text;
  };

  button.addEventListener("click", function () {
    let selection_to_explain = get_selected_text();

    if (!selection_to_explain) {
      selection_to_explain = select_element_text(env.element);
    }

    openai_completions(
      "Explain: " + selection_to_explain,
      SYSTEM_PROMPT_EXPLAIN
    );
  });

  return button;
});

Prism.plugins.toolbar.registerButton("add-comments", function (env) {
  const button = document.createElement("button");
  button.innerHTML = '<i class="bi bi-plus-square"></i> Add Comments';

  button.addEventListener("click", function () {
    openai_completions(
      "Comment logical sections"
    );
  });

  return button;
});

Prism.plugins.toolbar.registerButton("make-function", function (env) {
  const button = document.createElement("button");
  button.innerHTML = '<i class="bi bi-braces"></i> Make Function';

  button.addEventListener("click", function () {
    openai_completions(
      "Turn this into a function"
    );
  });

  return button;
});