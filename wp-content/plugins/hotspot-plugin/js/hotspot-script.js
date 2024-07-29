jQuery(document).ready(function ($) {
  let hotspotData = [];
  let deleteMode = false;
  let isDragging = false;
  let dragIndex = -1;
  let currentImageID = "";
  


  // Function to load existing hotspots from JSON
  const loadHotspots = () => {
    const existingHotspots = JSON.parse($("#hotspots").val() || "[]");
    hotspotData = existingHotspots;
    console.log("Loaded hotspots:", hotspotData);

    if (currentImageID) {
      const imageData = hotspotData.find(
        (image) => image.image === currentImageID
      );

      if (imageData && imageData.hotspots && imageData.hotspots.length > 0) {
        imageData.hotspots.forEach((hotspot, index) => {
          addHotspotElement(currentImageID, hotspot, index);
        });
      }
    }

    displayJSONData();
  };

     // Function to initialize the project image and hotspots
     const initializeProject = () => {
      const initialImageID = $("#hotspots-image-select").val(); // Use the select element's value
      console.log("initialImageID", initialImageID);
  
      if (initialImageID) {
          const selectedOption = $(`#hotspots-image-select option[value='${initialImageID}']`);
          console.log("selectedOption", selectedOption)
          const imageUrl = selectedOption.data("image-url");
          console.log("imageUrl", imageUrl)
          $("#hotspots-image").attr("src", imageUrl).show();
          currentImageID = initialImageID;
          loadHotspots();
      }
  };

  // Function to add a new hotspot element to the DOM
  const addHotspotElement = (imageID, hotspot, index) => {
    $("#hotspot-interface").append(
      `<div class="hotspot" data-image="${imageID}" data-index="${index}" style="left:${
        hotspot.x_position
      }%; top:${hotspot.y_position}%; z-index: ${index + 1};">
        <div class="hotspot-circle"></div>
        <button class="delete-hotspot" style="display: none;">Delete</button>
      </div>`
    );
  };

  // Function to display JSON data
  const displayJSONData = () => {
    $("#hotspot-json-display").text(JSON.stringify(hotspotData, null, 2));
  };

  // Function to copy JSON data to clipboard
  const copyJSONToClipboard = () => {
    const jsonText = $("#hotspot-json-display").text();
    const textarea = document.createElement("textarea");
    textarea.value = jsonText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };



  // Handle project image selection
  $("#hotspots-image-select").on("change", function () {
    const selectedOption = $(this).find("option:selected");
    const imageID = selectedOption.val(); // Get the image ID from the option value
    $("#hotspots_image_id").val(imageID); // Use a hidden input to store the image ID
    const imageUrl = selectedOption.data("image-url");
    $("#hotspots-image").attr("src", imageUrl).show();

    currentImageID = imageID;

    $("#hotspot-interface .hotspot").remove();
    loadHotspots();
  });

  $("#choose-product-button").on("click", function (e) {
    e.preventDefault();

    let productFrame = wp
      .media({
        title: "Select Product",
        multiple: false,
        library: {
          type: "image",
        },
        button: {
          text: "Select",
        },
      })
      .open()
      .on("select", function () {
        const selectedProduct = productFrame
          .state()
          .get("selection")
          .first()
          .toJSON();
        console.log("selectedProduct", selectedProduct);
        const productHtml = `<div class="chosen-product" data-id="${selectedProduct.id}" data-url="${selectedProduct.url}">
          <img src="${selectedProduct.url}" style="max-width: 100px; max-height: 100px;">
          <span>${selectedProduct.title}</span>
        </div>`;
        $("#chosen-products").html(productHtml); // Display the selected product
        $("#hotspot-controls").show(); // Show the controls for positioning the hotspot

        // Display initial hotspot circle at default position (50%, 50%)
        const initialX = $("#hotspot-x").val();
        const initialY = $("#hotspot-y").val();
        displayHotspotPreview(initialX, initialY);
      });
  });

  const saveHotspotData = () => {
    // Update hidden input value with JSON data
    $("#hotspots").val(JSON.stringify(hotspotData, null, 2));

    displayJSONData();
  };

  const addHotspot = () => {
    const x_position = $("#hotspot-x").val();
    const y_position = $("#hotspot-y").val();
    const product = $("#chosen-products .chosen-product:last").data("id");

    if (product && currentImageID) {
      let imageIndex = hotspotData.findIndex(
        (image) => image.image === currentImageID
      );

      console.log("Add hotspot - imageIndex:", imageIndex);
      console.log("currentImageID:", currentImageID);
      console.log("hotspotData:", hotspotData);

      if (imageIndex === -1) {
        imageIndex = hotspotData.length;
        hotspotData.push({
          image: currentImageID, // Store the image ID here
          hotspots: [],
        });
      }

      const hotspot = {
        product,
        x_position,
        y_position,
      };

      hotspotData[imageIndex].hotspots.push(hotspot);
      $("#hotspots").val(JSON.stringify(hotspotData));

      const index = hotspotData[imageIndex].hotspots.length - 1;
      addHotspotElement(currentImageID, hotspot, index);

      // Clear the selected product and controls to allow adding another hotspot
      $("#chosen-products").html("");
      $("#hotspot-controls").hide();

      saveHotspotData();
    }
  };

  // Handle clicking the "Add Hotspot" button
  $("#add-hotspot").on("click", function (e) {
    e.preventDefault();
    addHotspot();
  });

  const toggleDeleteMode = () => {
    deleteMode = !deleteMode;
    if (deleteMode) {
      $(".hotspot").each(function () {
        $(this).append('<button class="delete-hotspot">Delete</button>');
      });
    } else {
      $(".delete-hotspot").remove();
    }
  };

  const deleteHotspot = (index, imageID) => {
    console.log("Deleting hotspot at index:", index, "for imageID:", imageID);

    // Debugging: Log current hotspotData
    console.log("Before deletion:", hotspotData);

    const imageIndex = hotspotData.findIndex(
      (image) => image.image === imageID
    );

    console.log("Delete hotspot - imageIndex:", imageIndex);

    // if (imageIndex !== -1) {
    console.log(hotspotData[index].hotspots)
      hotspotData[index].hotspots.splice(index, 1);

      // If no hotspots left for this image, remove the image entry
      if (hotspotData[index].hotspots.length === 0) {
        hotspotData.splice(index, 1);
      }

      // Update the hidden input with the new hotspot data
      $("#hotspots").val(JSON.stringify(hotspotData));

      // Clear and reload hotspots
      $("#hotspot-interface").empty();
      loadHotspots();
      
      if (deleteMode) {
        toggleDeleteMode();
      }
    // }

    displayJSONData();
  };

  $(document).on("click", ".delete-hotspot", function (e) {
    e.preventDefault();

    const index = $(this).parent().data("index");
    const imageID = $(this).parent().data("image");
    console.log("Delete button clicked - index:", index, "imageID:", imageID);
    deleteHotspot(index, imageID);
  });

  $("#delete-mode").on("click", function () {
    toggleDeleteMode();
  });

  // Handle dragging of hotspots
  $(document).on("mousedown", ".hotspot", function (e) {
    if (!deleteMode) {
      isDragging = true;
      dragIndex = $(this).data("index");
      const offset = $(this).offset();
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      $(document).on("mousemove.hotspotDrag", function (e) {
        if (isDragging) {
          const dx = e.pageX - mouseX;
          const dy = e.pageY - mouseY;
          const newLeft =
            ((offset.left + dx) / $("#hotspots-image").width()) * 100;
          const newTop =
            ((offset.top + dy) / $("#hotspots-image").height()) * 100;
          $(`.hotspot[data-index="${dragIndex}"]`).css({
            left: newLeft + "%",
            top: newTop + "%",
          });
        }
      });
    }
  });

  $(document).on("mouseup", function () {
    if (isDragging) {
      isDragging = false;
      $(document).off("mousemove.hotspotDrag");
      const newLeft = $(`.hotspot[data-index="${dragIndex}"]`).css("left");
      const newTop = $(`.hotspot[data-index="${dragIndex}"]`).css("top");

      const imageIndex = hotspotData.findIndex(
        (image) => image.image === currentImageID
      );

      if (imageIndex !== -1 && dragIndex !== -1) {
        hotspotData[imageIndex].hotspots[dragIndex].x_position =
          parseFloat(newLeft);
        hotspotData[imageIndex].hotspots[dragIndex].y_position =
          parseFloat(newTop);
        $("#hotspots").val(JSON.stringify(hotspotData));
      }
    }

    displayJSONData();
  });

  // Function to display hotspot circle preview based on range input values
  const displayHotspotPreview = (x_position, y_position) => {
    $(".hotspot-preview").remove(); // Remove any existing hotspot preview
    $("#hotspot-interface").append(
      `<div class="hotspot-preview" style="left:${x_position}%; top:${y_position}%;">
        <div class="hotspot-circle"></div>
      </div>`
    );
  };

  // Update hotspot preview as range inputs change
  $("#hotspot-x, #hotspot-y").on("input", function () {
    const x_position = $("#hotspot-x").val();
    const y_position = $("#hotspot-y").val();
    displayHotspotPreview(x_position, y_position);
  });

  // Ensure the image loads correctly to trigger the load event
  $("#hotspots-image").on("load", function () {
    loadHotspots();
    console.log("hotspotData", hotspotData);
  });

  // If the image source is already set, trigger the load event
  if ($("#hotspots-image").attr("src")) {
    $("#hotspots-image").trigger("load");
  }

  const clearAllData = () => {
    const imageIndex = hotspotData.findIndex(
      (image) => image.image === currentImageID
    );

    if (imageIndex !== -1) {
      hotspotData[imageIndex].hotspots = [];
    }

    // Remove image objects without hotspots
    hotspotData = hotspotData.filter((image) => image.hotspots.length > 0);

    $("#hotspots").val(JSON.stringify(hotspotData));

    $("#hotspot-interface").empty();
    $("#chosen-products").empty();
    $("#hotspot-controls").empty();

    displayJSONData();
  };

  $("#clear-all-data").on("click", function () {
    clearAllData();
  });

  // Button to create other product hotspots on the same project image
  $("#create-other-hotspots").on("click", function () {
    // Reset the selected product controls for adding a new hotspot
    $("#chosen-products").html("");
    $("#hotspot-controls").hide();
    // Optionally, reset the range inputs
    $("#hotspot-x").val(50);
    $("#hotspot-y").val(50);
    $(".hotspot-preview").css({ left: "50%", top: "50%" });
  });

  // Copy JSON to Clipboard
  $("#copy-json-button").on("click", function (e) {
    e.preventDefault();
    copyJSONToClipboard();
  });

  // Initial load of hotspots
  loadHotspots();
  initializeProject();
});
