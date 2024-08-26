let previous_assistant_messages = [];
let previous_system_div = null;
let previous_chat_div = null;

async function openai_completions(user_prompt, system_prompt) {

  let user_prompt_field = document.getElementById("user_prompt_field");

  let user_text = "";
  let system_text = "";

  const model = prompt_settings.model || DEFAULT_MODEL;

  if (!user_prompt && !user_prompt_field.value) {
    return;
  }

  user_text = user_prompt ? user_prompt : user_prompt_field.value.trim();

  user_prompt_field.value = user_text;

  add_user_prompt(user_text);

  // prepare system prompt
  if (system_prompt) {
    system_text = system_prompt;
  } else {
    system_text = prompt_settings.system_prompt;
  }

  if (user_text) {
    try {

      disable_buttons();

      const messages = [];

      const system_message = {
        role: "system",
        content: system_text,
      };
      if (system_text.length > 0) {
        messages.push(system_message);
      }

      let total_assistant_tokens = 0;

      for (let i = previous_assistant_messages.length - 1; i >= 0; i--) {
        const message = previous_assistant_messages[i];
        const tokens = message.split(' ');

        if (total_assistant_tokens + tokens.length <= MAX_ASSISTANT_TOKENS) {
          const assistant_message = {
            role: "assistant",
            content: `${message}`,
          };

          messages.unshift(assistant_message);

          total_assistant_tokens += tokens.length;
        }
        else {
          break;
        }
      }

      const user_message = {
        role: "user",
        content: `${user_text} ${prompt_settings.user_prompt_format.trim()}`,
      };
      if (user_text.length > 0) {
        messages.push(user_message);
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPENAI_API_KEY,
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: prompt_settings.temperature,
          }),
        }
      );

      enable_buttons();
      clear_renderingArea();
      user_prompt_field.value = "";

      if (response.ok) {
        const data = await response.json();
        render_response(get_response_from_json(data));
      } else {
        console.error(
          "HTTP ERROR: " + response.status + "\n" + response.statusText
        );
      }
    } catch (error) {
      console.error("ERROR: " + error);
    }
  } else {
    console.error("ERROR: user text is empty");
  }
}

function clean_json(json) {
  json.forEach(function (element, index) {
    if (element === ".") {
      json.splice(index, 1);
    }
  });
  return json;
}

function get_response_from_json(json) {
  let response = "";
  let choices = clean_json(json.choices);

  if (choices.length > 0) {
    response = json.choices[0].message.content;
  }

  return response;
}

function render_response(response) {
  const clean_response = replace_markdown(response.trim());

  add_to_running_session(clean_response.replaced_string);
  previous_assistant_messages.push(clean_response.replaced_string)

  const responseArea = document.getElementById("responseArea");

  const parser = new DOMParser();
  const doc = parser.parseFromString(clean_response.replaced_string, "text/html");

  renderMathInElement(doc, {
    delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
    ],
    throwOnError : false
  });

  const buttons = doc.getElementsByTagName("button");

  for (const button of buttons) {
    button.classList.add("btn");
    button.classList.add("btn-outline-primary");
    button.classList.add("btn-sm");
    button.classList.add("m-1");
    button.classList.add("followup-prompt");
  }

  const preBlocks = doc.getElementsByTagName("pre");

  code_actions = prompt_settings.code_actions || DEFAULT_CODE_ACTIONS;

  for (const preBlock of preBlocks) {
    preBlock.setAttribute("data-toolbar-order", code_actions);
  }

  const codeBlocks = doc.getElementsByTagName("code");

  for (const codeBlock of codeBlocks) {
    codeBlock.classList.add(`language-${DEFAULT_CODE_LANGUAGE}`);
    codeBlock.setAttribute("data-prismjs-copy", "Copy");
  }

  const modified_response = doc.body.innerHTML;

  var converter = new showdown.Converter({
    tables: true
  }),
  modified_response_html = converter.makeHtml(modified_response);

  const newDiv = document.createElement("div");
  newDiv.className = "chat-bubble-assistant";
  newDiv.innerHTML = modified_response_html;
  responseArea.appendChild(newDiv);

  // render flashcards
  const flashcard_fronts = newDiv.getElementsByClassName("flashcard-front");

  for (const flashcard_front of flashcard_fronts) {    
    flashcard_front.classList.add("card");
    
    flashcard_front.addEventListener("click", function () {
      const flashcard_back = flashcard_front.nextElementSibling;
      flashcard_back.classList.remove("d-none");
    });
  }

  const flashcard_backs = newDiv.getElementsByClassName("flashcard-back");

  for (const flashcard_back of flashcard_backs) {
    flashcard_back.classList.add("card");
    flashcard_back.classList.add("d-none");
  }

  // render followup prompts
  const followup_prompt_buttons = newDiv.querySelectorAll('button.followup-prompt');

  for (const followup_prompt_button of followup_prompt_buttons) {

    followup_prompt_button.innerHTML = `<i class="bi bi-arrow-right"></i> ${followup_prompt_button.textContent}`;
    
    followup_prompt_button.addEventListener("click", function () {
      openai_completions(followup_prompt_button.textContent);
    });
  }

  Prism.highlightAllUnder(newDiv);

  const copy_buttons = newDiv.querySelectorAll(".copy-to-clipboard-button");

  for (const copy_button of copy_buttons) {
    copy_button.innerHTML = `<i class="bi bi-clipboard"></i> Copy`;
  }

  if (previous_system_div) {
    const previous_followup_prompt_buttons = previous_system_div.querySelectorAll('button');

    for (const previous_followup_prompt_button of previous_followup_prompt_buttons) {
      if (!previous_followup_prompt_button.classList.contains('copy-to-clipboard-button')) {
        previous_followup_prompt_button.remove();
      }
    }
  }

  previous_system_div = newDiv;

  if (previous_chat_div) {
    previous_chat_div.scrollIntoView();
  }
}

function add_assistant_prompt(prompt) {
  const scrollableArea = document.getElementById("scrollableArea");
  const responseArea = document.getElementById("responseArea");

  responseArea.innerHTML = '';

  const newData = document.createElement("div");
  newData.className = "chat-bubble-assistant";
  newData.innerHTML = prompt;
  responseArea.appendChild(newData);

  scrollableArea.scrollTop = scrollableArea.scrollHeight;
}

function add_user_prompt(prompt) {
  const scrollableArea = document.getElementById("scrollableArea");
  const responseArea = document.getElementById("responseArea");
  const renderingArea = document.getElementById("renderingArea");

  const newDiv = document.createElement("div");
  newDiv.className = "chat-bubble-user";
  newDiv.innerText = prompt;
  responseArea.appendChild(newDiv);

  renderingArea.classList.remove("d-none");

  previous_chat_div = newDiv;

  scrollableArea.scrollTop = scrollableArea.scrollHeight;

  add_section_to_running_session(prompt);
}

function replace_markdown(input_string) {
  const code_pattern = /(```(\w+))((.|\n)*?)(```)/g;
  let detected_languages = [];

  const replaced = input_string.replace(
    code_pattern,
    function (_, start_tag, language, content, _, end_tag) {
      detected_languages.push(language);
      return "<pre><code>" + content.trim().replace(/^[\x00-\x1F\x7F]+/, '') + "</code></pre>";
    }
  );

  return { replaced_string: replaced, languages: detected_languages };
}
