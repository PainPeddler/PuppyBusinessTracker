$(document).ready(function () {
  // Function to generate the buttons
  function generateButtons() {
    let number1Button = $('<button class="btn business-button" data-type="number1">Number 1</button>');
    let number2Button = $('<button class="btn business-button" data-type="number2">Number 2</button>');
    let customEntryButton = $('<button class="btn business-button custom-entry-button" data-type="custom">Custom Entry</button>');
    let buttonContainer = $('<div class="button-container mt-3"></div>').append(number1Button, number2Button, customEntryButton);
    $(".container-fluid").append(buttonContainer);
  }

  // Function to generate days
  function generateDays() {
    for (let i = 0; i < 7; i++) {
      let currentDate = dayjs().add(i, "day").format("YYYY-MM-DD");
      let newDay = $('<div class="row day"></div>');
      let newDayLabel = $('<div class="col-12 col-md-2 day-label text-center py-3"></div>');
      let newDescription = $('<div class="col-12 col-md-10 description"></div>');

      newDay.attr("id", currentDate);
      newDayLabel.text(dayjs(currentDate).format("dddd, MMM D"));
      newDay.append(newDayLabel, newDescription);
      newDay.attr("data-expanded", "false");
      $(".container-fluid").append(newDay);
    }
  }

  // Function to save activity data
  function saveActivity(buttonType) {
    let puppyData = JSON.parse(localStorage.getItem("puppyData")) || {};

    let currentDate = dayjs().format("YYYY-MM-DD");
    puppyData[currentDate] = puppyData[currentDate] || {};

    let currentTime = dayjs().format("HH:mm"); // Use 24-hour format for time

    if (buttonType === "number1") {
      puppyData[currentDate].number1 = puppyData[currentDate].number1 || [];
      puppyData[currentDate].number1.push(currentTime);
    } else if (buttonType === "number2") {
      puppyData[currentDate].number2 = puppyData[currentDate].number2 || [];
      puppyData[currentDate].number2.push(currentTime);
    } else if (buttonType === "custom") {
      puppyData[currentDate].customEntry = puppyData[currentDate].customEntry || [];
      const customEntryText = $("#custom-entry-input").val().trim();
      if (customEntryText !== "") {
        let customEntry = {
          text: customEntryText,
          time: currentTime,
        };
        puppyData[currentDate].customEntry.push(customEntry);
      }
    }

    localStorage.setItem("puppyData", JSON.stringify(puppyData));
    displayStoredData();
  }

  // Function to display stored data on the days
  function displayStoredData() {
    let storedData = JSON.parse(localStorage.getItem("puppyData")) || {};

    for (let date in storedData) {
      let descriptionDiv = $("#" + date + " .description");
      descriptionDiv.empty(); // Clear existing entries before re-populating

      let number1Times = storedData[date].number1;
      if (number1Times && number1Times.length > 0) {
        let activityText = "Number 1";
        for (let i = 0; i < number1Times.length; i++) {
          let time = number1Times[i];
          let newEntry = $('<div class="activity-entry"></div>').text(activityText + ": " + time);
          let removeButton = $('<button class="btn btn-sm btn-danger remove-button" data-type="number1" data-date="' + date + '" data-index="' + i + '">Remove</button>');
          newEntry.append("&nbsp;", removeButton); // Add spacing between the entry and the Remove button
          descriptionDiv.append(newEntry);
        }
      }

      let number2Times = storedData[date].number2;
      if (number2Times && number2Times.length > 0) {
        let activityText = "Number 2";
        for (let i = 0; i < number2Times.length; i++) {
          let time = number2Times[i];
          let newEntry = $('<div class="activity-entry"></div>').text(activityText + ": " + time);
          let removeButton = $('<button class="btn btn-sm btn-danger remove-button" data-type="number2" data-date="' + date + '" data-index="' + i + '">Remove</button>');
          newEntry.append("&nbsp;", removeButton); // Add spacing between the entry and the Remove button
          descriptionDiv.append(newEntry);
        }
      }

      let customEntries = storedData[date].customEntry;
      if (customEntries && customEntries.length > 0) {
        for (let i = 0; i < customEntries.length; i++) {
          let entry = customEntries[i];
          let activityText = entry.text;
          let time = entry.time;
          let newEntry = $('<div class="activity-entry"></div>').text(activityText + ": " + time);
          let removeButton = $('<button class="btn btn-sm btn-danger remove-button" data-type="custom" data-date="' + date + '" data-index="' + i + '">Remove</button>');
          newEntry.append("&nbsp;", removeButton); // Add spacing between the entry and the Remove button
          descriptionDiv.append(newEntry);
        }
      }
    }
  }

  // Function to toggle day visibility on click
  function toggleDayVisibility() {
    $(".day-label").on("click", function () {
      const dayRow = $(this).closest(".day");
      dayRow.toggleClass("active-day");
      dayRow.siblings(".day").removeClass("active-day");
    });
  }

  // Function to handle custom entry form display
  function handleCustomEntry() {
    $(".button-container").hide();
    $(".day").hide();
    $(".clear-button").hide(); // Hide the Clear All button
    $(".custom-entry-form").show();
  }

  // Function to handle custom entry submission
  function handleCustomEntrySubmit() {
    const customEntryInput = $("#custom-entry-input");
    const customEntryText = customEntryInput.val().trim();
    if (customEntryText !== "") {
      saveActivity("custom");
      // Hide the custom entry form after submission
      $(".custom-entry-form").hide();
      $(".button-container").show();
      $(".day").show();
      $(".clear-button").show(); // Show the Clear All button again
      customEntryInput.val(""); // Clear the input field
    }
  }

  // Function to handle custom entry cancel
  function handleCustomEntryCancel() {
    $(".custom-entry-form").hide();
    $(".button-container").show();
    $(".day").show();
    $(".clear-button").show(); // Show the Clear All button again
    $("#custom-entry-input").val(""); // Clear the input field
  }

  // Function to handle removal of entries
  $(".container-fluid").on("click", ".remove-button", function () {
    const buttonType = $(this).data("type");
    const date = $(this).data("date");
    const index = $(this).data("index");
    let puppyData = JSON.parse(localStorage.getItem("puppyData")) || {};

    if (buttonType === "number1") {
      if (puppyData[date].number1 && puppyData[date].number1.length > index) {
        puppyData[date].number1.splice(index, 1);
        if (puppyData[date].number1.length === 0) delete puppyData[date].number1;
      }
    } else if (buttonType === "number2") {
      if (puppyData[date].number2 && puppyData[date].number2.length > index) {
        puppyData[date].number2.splice(index, 1);
        if (puppyData[date].number2.length === 0) delete puppyData[date].number2;
      }
    } else if (buttonType === "custom") {
      if (puppyData[date].customEntry && puppyData[date].customEntry.length > index) {
        puppyData[date].customEntry.splice(index, 1);
        if (puppyData[date].customEntry.length === 0) delete puppyData[date].customEntry;
      }
    }

    localStorage.setItem("puppyData", JSON.stringify(puppyData));
    displayStoredData();
  });

  // Event listener for buttons
  $(".container-fluid").on("click", ".business-button", function () {
    let buttonType = $(this).data("type");
    if (buttonType === "custom") {
      handleCustomEntry();
    } else {
      saveActivity(buttonType);
    }
  });

  // Event listener for custom entry submit button
  $("#custom-entry-submit").on("click", function () {
    handleCustomEntrySubmit();
  });

  // Event listener for custom entry cancel button
  $("#custom-entry-cancel").on("click", function () {
    handleCustomEntryCancel();
  });

  // Event listener for clear all button
  $(".clear-button").on("click", function () {
    const confirmed = window.confirm("This will clear all of your entries. Are you sure?");
    if (confirmed) {
      localStorage.removeItem("puppyData");
      location.reload();
    }
  });

  // Generate buttons, days, and set up event listeners
  generateButtons();
  generateDays();
  toggleDayVisibility();
  displayStoredData();
});
