const APP_NAME = "Code";
const APP_MODE_KEY = "code_app_mode";
const APP_MODE_CUSTOM_KEY = "code_app_mode_custom";
const DEFAULT_APP_MODE = "Default";
const MAX_ASSISTANT_TOKENS = 1000;
const OPENAI_API_KEY = get_openai_api_key();
const DEFAULT_CODE_LANGUAGE = "python";
const DEFAULT_CODE_FILE_EXT = "py";
const DEFAULT_CODE_COMMENT = "#";

let prompt_settings = {};
let app_mode = '';
let running_session = "";

document.addEventListener("DOMContentLoaded", function () {
  
  document.title = APP_NAME;
  document.getElementById("app_name").textContent = APP_NAME;

  const user_input_field = document.getElementById("user_prompt_field");
  const user_input_button = document.getElementById("user_prompt_button");

  user_input_field.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      user_input_button.click();
    }
  });

  const save_changes = document.getElementById("save_changes");
  const add_prompt = document.getElementById("add_prompt");
  const user_prompts_container = document.getElementById("user_prompts_container");

  const init_local_storage = () => {
    if (!localStorage.getItem(APP_MODE_CUSTOM_KEY)) {
      const initial_custom = {
        system_prompt: prompt_mode_settings.custom_defaults.system_prompt,
        default_prompt: prompt_mode_settings.custom_defaults.default_prompt,
        default_assistant_message: prompt_mode_settings.custom_defaults.default_assistant_message,
        user_prompt_format: prompt_mode_settings.custom_defaults.user_prompt_format,
        user_prompts: prompt_mode_settings.custom_defaults.user_prompts,
        temperature: prompt_mode_settings.custom_defaults.temperature,
        model: prompt_mode_settings.custom_defaults.model,
      };
      localStorage.setItem(APP_MODE_CUSTOM_KEY, JSON.stringify(initial_custom));
    }
  };

  const load_values = () => {
    const custom = JSON.parse(localStorage.getItem(APP_MODE_CUSTOM_KEY));

    Object.keys(custom).forEach((key) => {
      if (Array.isArray(custom[key])) {
        user_prompts_container.innerHTML = "";
        custom[key].forEach((value, index) => {
          add_user_prompt(value, index);
        });
      } else {
        const input = document.getElementById(key);
        input.value = custom[key];
      }
    });
  };

  const add_user_prompt = (value = "", index) => {
    const prompt_container = document.createElement("div");
    prompt_container.className = "user_prompt_container";

    const input_group = document.createElement("div");
    input_group.className = "input-group mt-2";
    prompt_container.appendChild(input_group);

    const prompt_input = document.createElement("input");
    prompt_input.type = "text";
    prompt_input.className = "form-control";
    prompt_input.id = `user_prompt_${index}`;
    prompt_input.name = `user_prompt_${index}`;
    prompt_input.placeholder = `User prompt ${index + 1}`;
    prompt_input.value = value;
    input_group.appendChild(prompt_input);

    const delete_button = document.createElement("button");
    delete_button.type = "button";
    delete_button.className = "btn btn-danger input-group-text";
    delete_button.textContent = "Delete";
    delete_button.addEventListener("click", () => {
      user_prompts_container.removeChild(prompt_container);
    });
    input_group.appendChild(delete_button);

    user_prompts_container.appendChild(prompt_container);
  };
  const save_values = () => {
    const custom = {
      system_prompt: document.getElementById("system_prompt").value,
      default_prompt: document.getElementById("default_prompt").value,
      default_assistant_message: document.getElementById("default_assistant_message").value,
      user_prompt_format: document.getElementById("user_prompt_format").value,
      temperature: parseFloat(document.getElementById("temperature").value),
      model: document.getElementById("model").value,
    };

    const user_prompt_elements = user_prompts_container.getElementsByClassName("user_prompt_container");
    custom["user_prompts"] = [];
    for (let i = 0; i < user_prompt_elements.length; i++) {
      const prompt_input = user_prompt_elements[i].getElementsByTagName("input")[0];
      custom["user_prompts"].push(prompt_input.value);
    }

    localStorage.setItem(APP_MODE_CUSTOM_KEY, JSON.stringify(custom));

    prompt_settings = JSON.parse(localStorage.getItem(APP_MODE_CUSTOM_KEY));
  };

  init_local_storage();

  document.getElementById("customPromptModal").addEventListener("show.bs.modal", () => {
    load_values();
  });

  document.getElementById("customPromptModal").addEventListener("click", (event) => {
    if (event.target === save_changes) {
      save_values();
      const modal = bootstrap.Modal.getInstance(document.getElementById("customPromptModal"));
      modal.hide();
    }
  });

  document.getElementById("customPromptModal").addEventListener("click", (event) => {
    if (event.target === add_prompt) {
      const newIndex = user_prompts_container.getElementsByClassName("user_prompt_container").length;
      add_user_prompt("", newIndex);
    }
  });

  const app_mode_element = document.getElementById("app_modes");
  const app_mode_items = app_mode_element.querySelectorAll(".dropdown-item");
  const viable_app_modes = Array.from(app_mode_items).map(item => item.getAttribute("data-mode"));
  const current_mode_element = document.querySelector(".current-mode");
  const custom_button = document.getElementById('custom_button');

  function set_app_mode(mode) {
    if (!viable_app_modes.includes(mode)) {
      mode = DEFAULT_APP_MODE;
    }

    localStorage.setItem(APP_MODE_KEY, mode);
    current_mode_element.textContent = mode;

    app_mode = mode.toLowerCase();

    if (app_mode === "custom") {
      prompt_settings = JSON.parse(localStorage.getItem(APP_MODE_CUSTOM_KEY));
      custom_button.classList.remove('d-none');
    } else {
      prompt_settings = prompt_mode_settings[app_mode];
      custom_button.classList.add('d-none');
    }

    add_assistant_prompt(prompt_settings.default_assistant_message);
    user_input_field.value = prompt_settings.default_prompt;
    previous_assistant_messages = [];
  }

  function get_parameter_from_query_string(parameter) {
    const url_parameters = new URLSearchParams(window.location.search);
    return url_parameters.get(parameter);
  }
  
  const desired_mode = get_parameter_from_query_string('mode');

  function clear_query_string() {
    const current_url = new URL(window.location.href);
    const base_url = current_url.origin + current_url.pathname;
  
    history.replaceState({}, null, base_url);
  }
  
  if (desired_mode) {
    clear_query_string();
  }
  
  const stored_mode = localStorage.getItem(APP_MODE_KEY);
  const current_mode = stored_mode ? stored_mode : DEFAULT_APP_MODE;
  const mode_to_set = desired_mode ? desired_mode : current_mode;
  set_app_mode(mode_to_set);

  app_mode_items.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      
      const mode = event.target.getAttribute("data-mode");
      set_app_mode(mode);
    });
  });

  const temperature_input = document.getElementById('temperature');
  temperature_input.addEventListener('input', () => validate_temperature_input(temperature_input));

  function validate_temperature_input(input) {
    const min_value = parseFloat(input.min);
    const max_value = parseFloat(input.max);

    if (input.valueAsNumber < min_value) {
      input.value = min_value;
    } else if (input.valueAsNumber > max_value) {
      input.value = max_value;
    }
  }
});

function clear_renderingArea() {
  const renderingArea = document.getElementById("renderingArea");
  renderingArea.classList.add("d-none");
}

function get_openai_api_key() {
  if (localStorage.getItem("OPENAI_API_KEY")) {
    return localStorage.getItem("OPENAI_API_KEY");
  } else {
    return prompt_for_openai_api_key();
  }
}

function prompt_for_openai_api_key() {
  let apiKey = prompt("Please enter your OpenAI API Key:");

  if (apiKey && apiKey.trim()) {
    localStorage.setItem("OPENAI_API_KEY", apiKey);
    return localStorage.getItem("OPENAI_API_KEY");
  } else {
    return prompt_for_openai_api_key();
  }
}

function random_user_prompt() {
  previous_assistant_messages = [];

  let random_index = Math.floor(
    Math.random() * prompt_settings.user_prompts.length
  );

  return prompt_settings.user_prompts[random_index];
}

function disable_buttons() {
  document.getElementById("user_prompt_button").disabled = true;
  document.getElementById("random_prompt_button").disabled = true;

  const responseArea = document.getElementById("responseArea");
  const buttons = responseArea.getElementsByTagName("button");

  for (const button of buttons) {
    button.disabled = true;
  }

}

function enable_buttons() {
  document.getElementById("user_prompt_button").disabled = false;
  document.getElementById("random_prompt_button").disabled = false;

  const responseArea = document.getElementById("responseArea");
  const buttons = responseArea.getElementsByTagName("button");

  for (const button of buttons) {
    button.disabled = false;
  }
}

function clear_cache() {
  const confirmed = confirm('Are you sure you want to clear cache and reload?');

  if (confirmed) {
    localStorage.clear();
    location.reload(true);
  }
}

function download_running_session() {
  if (running_session === "") {
    alert("Nothing to download");
    return;
  }

  const dateTime = new Date().toISOString().replace(/[:.-]/g, "");
  const filename = `session_${dateTime}.${DEFAULT_CODE_FILE_EXT}`;
  const blob = new Blob([running_session], {
    type: "text/plain;charset=utf-8",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

function add_section_to_running_session(section_header) {
  running_session += DEFAULT_CODE_COMMENT + " " + section_header + "\n";
}

function add_to_running_session(section) {
  section = extract_code_blocks(section);
  running_session += section + "\n";
}

function extract_code_blocks(input_string) {
  const regex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
  let matches;
  let result = "";

  while ((matches = regex.exec(input_string)) !== null) {
    result += matches[1].trim().replace(/^[\x00-\x1F\x7F]+/, '') + "\n";
  }

  return result;
}