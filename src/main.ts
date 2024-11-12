import $ from "jquery";

$("#app").html(`
  <form id="my-form">
      <select multiple id="original-select-1" name="select-1">
          <option value="OPT_1">Option 1</option>
          <option value="OPT_2">Optionnnn 2</option>
          <option value="OPT_3">Optinnon 3</option>
          <option value="OPT_4">Option 4</option>
          <option value="OPT_5">Optinnon 5</option>
          <option value="OPT_6">Option 6</option>
          <option value="OPT_7">Optinon 7</option>
      </select>

      <select multiple id="original-select-2" name="select-2">
          <option value="OPT_1">Option 1</option>
          <option value="OPT_2">Optionnnn 2</option>
          <option value="OPT_3">Optinnon 3</option>
      </select>

      <button type="submit">Submit</button>
      <button type="button" id="check">Check</button>
      <button type="button" id="empty-checkboxes">Empty checkboxes</button>
      <button type="button" id="empty-select-options">Empty select options</button>
  </form>
`);

function setupCustomSelect(selectId: string) {
    const $selectMultiple = $(`#${selectId}`);
    if ($selectMultiple.length === 0) return;

    const $customSelect = $("<div>", {
        id: "custom-select",
        class: "custom-select-container",
    });
    $selectMultiple.after($customSelect);

    const $trigger = $("<div>", { class: "custom-select-trigger" });
    $customSelect.append($trigger);

    const $dropdown = $("<div>", { class: "custom-select-dropdown" });
    $customSelect.append($dropdown);

    const $options = $selectMultiple.find("option");

    // Hide the original select element
    $selectMultiple.hide();

    // For each option, create a div element containing a checkbox input element and a label element with the text of the option
    $options.each((_, option) => {
        const $option = $(option);
        const $optionContainer = $("<div>", { class: "custom-select-option" });
        const $checkbox = $("<input>", {
            type: "checkbox",
            value: $option.val(),
            id: $option.val(),
            checked: $option.is(":selected"),
        });
        const $label = $("<label>", {
            for: $option.val(),
            text: $option.text(),
        });

        // Add event listener to update the checkbox when the select element is changed
        const handleChangeCheckbox = () => {
            $option.prop("selected", $checkbox.prop("checked"));
            updateTriggerContent();
        };

        $optionContainer.on("click", (event) => {
            // Only trigger the checkbox change event if the click event was not on the checkbox itself
            if (!$(event.target).is($checkbox)) {
                $checkbox.prop("checked", !$checkbox.prop("checked"));
                $checkbox.trigger("change");
            }
        });

        $checkbox.on("change", (event) => {
            event.stopPropagation();
            handleChangeCheckbox();
        });

        $option.on("change", () => {
            $checkbox.prop("checked", $option.is(":selected"));
            updateTriggerContent();
        });

        $optionContainer.append($checkbox).append($label);
        $dropdown.append($optionContainer);
    });

    // Add event listener to toggle the dropdown visibility
    $trigger.on("click", () => {
        $dropdown.toggleClass("show");
    });

    // Close the dropdown if clicked outside
    $(document).on("click", (event) => {
        if (
            !$customSelect.is(event.target) &&
            $customSelect.has(event.target).length === 0
        ) {
            $dropdown.removeClass("show");
        }
    });

    // Function to update the trigger text with selected options
    const updateTriggerContent = () => {
        const selectedOptions = $options
            .filter(":selected")
            .map((_, option) => $(option).text())
            .get();
        if (selectedOptions.length === 0) {
            $trigger.text("Select options");
        } else {
            const toAppend = selectedOptions.map(
                (option) => `<div class="selected-option">${option}</div>`
            );
            $trigger.html(
                `<div class="selected-options">${toAppend.join("")}</div>`
            );
        }
    };

    // Initialize the trigger text
    updateTriggerContent();

    // Search in the dropdown
    const $searchInput = $("<input>", {
        type: "text",
        placeholder: "Search...",
        class: "custom-select-search-input",
    });

    $searchInput.on("input", () => {
        const query = $searchInput.val()!.toString().toLowerCase();
        const $optionsToFilter = $dropdown.find("div.custom-select-option");

        $optionsToFilter.each((_, option) => {
            const $option = $(option);
            if ($option.text().toLowerCase().includes(query)) {
                $option.show();
            } else {
                $option.hide();
            }
        });
    });

    $dropdown.prepend($searchInput);

    const getCurrentState = () => {
        return $options
            .map((_, option) => ({
                label: option.label,
                value: option.value,
                selected: option.selected,
            }))
            .get();
    };

    return { getCurrentState };
}

const result1 = setupCustomSelect("original-select-1");
const result2 = setupCustomSelect("original-select-2");

$("#my-form").on("submit", (event) => {
    event.preventDefault();
    console.log($("form").serializeArray());
});

$("#check").on("click", () => {
    console.log(result1?.getCurrentState());
    console.log(result2?.getCurrentState());
});

// Deselect all checkboxes
$("#empty-checkboxes").on("click", () => {
    $("input[type='checkbox']").prop("checked", false).trigger("change");
});

$("#empty-select-options").on("click", () => {
  $("option").prop("selected", false).trigger("change");
});

// Add some basic styles
const style = document.createElement("style");

style.textContent = `
  .custom-select-container {
    position: relative;
    display: inline-block;
    width: 250px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .custom-select-trigger {
    padding: 8px;
    background-color: #f1f1f1;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
  }
  .custom-select-dropdown {
    display: none;
    box-sizing: border-box;
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    z-index: 1;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
  }
  .custom-select-dropdown.show {
    display: block;
  }
  .custom-select-option {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
  }
  .custom-select-option:hover {
    background-color: #f1f1f1;
  }
  .selected-options {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
  .selected-option {
    background-color: green;
    color: white;
    padding: 4px;
    border-radius: 4px;
    display: block;
  }
  .custom-select-search-input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ccc;
  }
`;
document.head.appendChild(style);
