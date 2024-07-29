jQuery(document).ready(function ($) {
  let hotspotData = [];
  let deleteMode = false;
  let isDragging = false;
  let dragIndex = -1;
  let currentImage = "";

  // Function to load existing hotspots from JSON
  const loadHotspots = () => {
    const existingHotspots = JSON.parse($("#hotspots").val() || "[]");
    hotspotData = existingHotspots;

    // if (currentImage && hotspotData[currentImage]) {
    //     hotspotData[currentImage].forEach(function (hotspot, index) {
    //         addHotspotElement(hotspot, index);
    //     });
    // }
    if (currentImage) {
      const imageData = hotspotData.find(
        (image) => image.image === currentImage
      );

      if (imageData && imageData.hotspots && imageData.hotspots.length > 0) {
        imageData.hotspots.forEach((hotspot, index) => {
          addHotspotElement(currentImage, hotspot, index);
        });
      }
    }

    // hotspotData.forEach(function (imageData) {
    //   const imageUrl = imageData.image;
    //   const hotspots = imageData.hotspots;

    //   if (imageUrl && hotspots && hotspots.length > 0) {
    //     hotspots.forEach(function (hotspot, index) {
    //       addHotspotElement(imageUrl, hotspot, index);
    //     });
    //   }
    // });
  };

  // Function to add a new hotspot element to the DOM
  const addHotspotElement = (imageUrl, hotspot, index) => {
    $("#hotspot-interface").append(
      `<div class="hotspot" data-image="${imageUrl}" data-index="${index}" style="left:${
        hotspot.x_position
      }%; top:${hotspot.y_position}%; z-index: ${index + 1};">
              <div class="hotspot-circle"></div>
              <button class="delete-hotspot" style="display: none;">Delete</button>
          </div>`
    );
  };

  // Handle project image selection
  $("#hotspots-image-select").on("change", function () {
    const selectedOption = $(this).find("option:selected");
    const imageUrl = selectedOption.data("image-url");
    $("#hotspots_image_url").val(imageUrl);
    $("#hotspots-image").attr("src", imageUrl).show();

    currentImage = imageUrl;

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

  const addHotspot = () => {
    const x_position = $("#hotspot-x").val();
    const y_position = $("#hotspot-y").val();
    const product = $("#chosen-products .chosen-product:last").data("id");
    // const productUrl = $("#chosen-products .chosen-product:last").data("url");

    if (product && currentImage) {
      let imageIndex = hotspotData.findIndex(
        (image) => image.image === currentImage
      );
      console.log("imageIndex", imageIndex);

      if (imageIndex === -1) {
        imageIndex = hotspotData.length;
        hotspotData.push({
          image: currentImage,
          hotspots: [],
        });
      }

      const hotspot = {
        product,
        x_position,
        y_position,
      };
      // if (product) {
      //   const hotspot = {
      //     product: product,
      //     x_position: x_position,
      //     y_position: y_position,
      //     product_url: productUrl,
      //   };

      // if (!hotspotData[currentImage]) {
      //   hotspotData[currentImage] = [];
      // }

      hotspotData[imageIndex].hotspots.push(hotspot);
      $("#hotspots").val(JSON.stringify(hotspotData));

      const index = hotspotData[imageIndex].hotspots.length - 1;
      addHotspotElement(hotspot, currentImage, index);

      // Clear the selected product and controls to allow adding another hotspot
      $("#chosen-products").html("");
      $("#hotspot-controls").hide();
    }
  };

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

  const deleteHotspot = (index, imageUrl) => {
    const imageIndex = hotspotData.findIndex(
      (image) => image.image === imageUrl
    );

    if (imageIndex !== -1) {
      hotspotData[imageIndex].hotspots.splice(index, 1);
      $("#hotspots").val(JSON.stringify(hotspotData));

      $("#hotspot-interface").empty();
      loadHotspots();
      if (deleteMode) {
        toggleDeleteMode();
      }
    }
    // if (hotspotData[currentImage]) {
    //   hotspotData[currentImage].splice(index, 1);
    //   $("#hotspots").val(JSON.stringify(hotspotData));

    //   // Re-render the hotspots
    //   $("#hotspot-interface").empty();
    //   loadHotspots();
    //   if (deleteMode) {
    //     toggleDeleteMode();
    //   }
    // }
  };

  $(document).on("click", ".delete-hotspot", function () {
    const index = $(this).parent().data("index");
    const imageUrl = $(this).parent().data("image");
    deleteHotspot(index, imageUrl);
  });

  $("#delete-mode").on("click", function () {
    toggleDeleteMode();
  });

  $("#add-hotspot").on("click", function () {
    addHotspot();
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
        (image) => image.image === currentImage
      );

      // if (hotspotData[currentImage]) {
      if (imageIndex !== -1 && dragIndex !== -1) {
        hotspotData[currentImage].hotspots[dragIndex].x_position =
          parseFloat(newLeft);
        hotspotData[currentImage].hotspots[dragIndex].y_position =
          parseFloat(newTop);
        $("#hotspots").val(JSON.stringify(hotspotData));
      }
    }
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

  // Trigger the load event to initialize hotspots
  $("#hotspots-image").on("load", function () {
    loadHotspots();
    console.log("hotspotData", hotspotData);
  });

  // Ensure the image loads correctly to trigger the load event
  if ($("#hotspots-image").attr("src")) {
    $("#hotspots-image").trigger("load");
  }

  const clearAllData = () => {
    const imageIndex = hotspotData.findIndex(
      (image) => image.image === currentImage
    );

    console.log("imageIndex", imageIndex);

    if (imageIndex !== -1) {
      hotspotData[imageIndex].hotspots = [];
      $("#hotspots").val(JSON.stringify(hotspotData));

      $("#hotspot-interface").empty();
      $("#chosen-products").empty();
      $("#hotspot-controls").empty();
    }
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
});

// -----------------------------------OLD---------------------------------------------------------------------
// jQuery(document).ready(function ($) {
//   let hotspotData = [];
//   let deleteMode = false;
//   let isDragging = false;
//   let dragIndex = -1;
//   let currentImage = "";

//   // Function to load existing hotspots from JSON
//   const loadHotspots = () => {
//     const existingHotspots = JSON.parse($("#hotspots").val() || "[]");
//     hotspotData = existingHotspots;

//     if (currentImage && hotspotData[currentImage]) {
//         hotspotData[currentImage].forEach(function (hotspot, index) {
//             addHotspotElement(hotspot, index);
//         });
//     }
//   };

//   // Function to add a new hotspot element to the DOM
//   const addHotspotElement = (hotspot, index) => {
//     $("#hotspot-interface").append(
//       `<div class="hotspot" data-index="${index}" style="left:${
//         hotspot.x_position
//       }%; top:${hotspot.y_position}%; z-index: ${index + 1};">
//               <div class="hotspot-circle"></div>
//               <button class="delete-hotspot" style="display: none;">Delete</button>
//           </div>`
//     );
//   };

//   // Handle project image selection
//   $("#hotspots-image-select").on("change", function () {
//     const selectedOption = $(this).find("option:selected");
//     const imageUrl = selectedOption.data("image-url");
//     $("#hotspots_image_url").val(imageUrl);
//     $("#hotspots-image").attr("src", imageUrl).show();

//     currentImage = imageUrl;
//     loadHotspots();
//   });

//   $("#choose-product-button").on("click", function (e) {
//     e.preventDefault();

//     let productFrame = wp
//       .media({
//         title: "Select Product",
//         multiple: false,
//         library: {
//           type: "image",
//         },
//         button: {
//           text: "Select",
//         },
//       })
//       .open()
//       .on("select", function () {
//         const selectedProduct = productFrame
//           .state()
//           .get("selection")
//           .first()
//           .toJSON();
//         const productHtml = `<div class="chosen-product" data-id="${selectedProduct.id}" data-url="${selectedProduct.url}">
//               <img src="${selectedProduct.url}" style="max-width: 100px; max-height: 100px;">
//               <span>${selectedProduct.title}</span>
//           </div>`;
//         $("#chosen-products").html(productHtml); // Display the selected product
//         $("#hotspot-controls").show(); // Show the controls for positioning the hotspot

//         // Display initial hotspot circle at default position (50%, 50%)
//         const initialX = $("#hotspot-x").val();
//         const initialY = $("#hotspot-y").val();
//         displayHotspotPreview(initialX, initialY);
//       });
//   });

//   const addHotspot = () => {
//     const x_position = $("#hotspot-x").val();
//     const y_position = $("#hotspot-y").val();
//     const product = $("#chosen-products .chosen-product:last").data("id");
//     const productUrl = $("#chosen-products .chosen-product:last").data("url");

//     if (product) {
//       const hotspot = {
//         product: product,
//         x_position: x_position,
//         y_position: y_position,
//         product_url: productUrl,
//       };

//       if (!hotspotData[currentImage]) {
//         hotspotData[currentImage] = [];
//       }

//       hotspotData[currentImage].push(hotspot);
//       $("#hotspots").val(JSON.stringify(hotspotData));

//       const index = hotspotData[currentImage].length - 1;
//       addHotspotElement(hotspot, index);

//       // Clear the selected product and controls to allow adding another hotspot
//       $("#chosen-products").html("");
//       $("#hotspot-controls").hide();
//     }
//   };

//   const toggleDeleteMode = () => {
//     deleteMode = !deleteMode;
//     if (deleteMode) {
//       $(".hotspot").each(function () {
//         $(this).append('<button class="delete-hotspot">Delete</button>');
//       });
//     } else {
//       $(".delete-hotspot").remove();
//     }
//   };

//   const deleteHotspot = (index) => {
//     if (hotspotData[currentImage]) {
//       hotspotData[currentImage].splice(index, 1);
//       $("#hotspots").val(JSON.stringify(hotspotData));

//       // Re-render the hotspots
//       $("#hotspot-interface").empty();
//       loadHotspots();
//       if (deleteMode) {
//         toggleDeleteMode();
//       }
//     }
//   };

//   $(document).on("click", ".delete-hotspot", function () {
//     const index = $(this).parent().data("index");
//     deleteHotspot(index);
//   });

//   $("#delete-mode").on("click", function () {
//     toggleDeleteMode();
//   });

//   $("#add-hotspot").on("click", function () {
//     addHotspot();
//   });

//   // Handle dragging of hotspots
//   $(document).on("mousedown", ".hotspot", function (e) {
//     if (!deleteMode) {
//       isDragging = true;
//       dragIndex = $(this).data("index");
//       const offset = $(this).offset();
//       const mouseX = e.pageX;
//       const mouseY = e.pageY;
//       $(document).on("mousemove.hotspotDrag", function (e) {
//         if (isDragging) {
//           const dx = e.pageX - mouseX;
//           const dy = e.pageY - mouseY;
//           const newLeft =
//             ((offset.left + dx) / $("#hotspots-image").width()) * 100;
//           const newTop =
//             ((offset.top + dy) / $("#hotspots-image").height()) * 100;
//           $(`.hotspot[data-index="${dragIndex}"]`).css({
//             left: newLeft + "%",
//             top: newTop + "%",
//           });
//         }
//       });
//     }
//   });

//   $(document).on("mouseup", function () {
//     if (isDragging) {
//       isDragging = false;
//       $(document).off("mousemove.hotspotDrag");
//       const newLeft = $(`.hotspot[data-index="${dragIndex}"]`).css("left");
//       const newTop = $(`.hotspot[data-index="${dragIndex}"]`).css("top");
//       if (hotspotData[currentImage]) {
//         hotspotData[currentImage][dragIndex].x_position = parseFloat(newLeft);
//         hotspotData[currentImage][dragIndex].y_position = parseFloat(newTop);
//         $("#hotspots").val(JSON.stringify(hotspotData));
//       }
//     }
//   });

//   // Function to display hotspot circle preview based on range input values
//   const displayHotspotPreview = (x_position, y_position) => {
//     $(".hotspot-preview").remove(); // Remove any existing hotspot preview
//     $("#hotspot-interface").append(
//       `<div class="hotspot-preview" style="left:${x_position}%; top:${y_position}%;">
//               <div class="hotspot-circle"></div>
//           </div>`
//     );
//   };

//   // Update hotspot preview as range inputs change
//   $("#hotspot-x, #hotspot-y").on("input", function () {
//     const x_position = $("#hotspot-x").val();
//     const y_position = $("#hotspot-y").val();
//     displayHotspotPreview(x_position, y_position);
//   });

//   // Trigger the load event to initialize hotspots
//   $("#hotspots-image").on("load", function () {
//     loadHotspots();
//     console.log("hotspotData", hotspotData);
//   });

//   // Ensure the image loads correctly to trigger the load event
//   if ($("#hotspots-image").attr("src")) {
//     $("#hotspots-image").trigger("load");
//   }

//   const clearAllData = () => {
//     if (currentImage && hotspotData[currentImage]) {
//       hotspotData[currentImage] = []; // Reset hotspot data for the current image
//       $("#hotspots").val(JSON.stringify(hotspotData)); // Update the hidden input field value

//       // Clear the UI
//       $("#hotspot-interface").empty(); // Remove all hotspot elements from the DOM
//       $("#chosen-products").empty(); // Clear selected products UI
//       $("#hotspot-controls").hide(); // Hide hotspot controls
//     }
//   };

//   $("#clear-all-data").on("click", function () {
//     clearAllData();
//   });

//   // Button to create other product hotspots on the same project image
//   $("#create-other-hotspots").on("click", function () {
//     // Reset the selected product controls for adding a new hotspot
//     $("#chosen-products").html("");
//     $("#hotspot-controls").hide();
//     // Optionally, reset the range inputs
//     $("#hotspot-x").val(50);
//     $("#hotspot-y").val(50);
//     $(".hotspot-preview").css({ left: "50%", top: "50%" });
//   });
// });

// ----------------------------------------------jQuery-------------------------------------------------------------------------------------------------
// jQuery(document).ready(function ($) {
//   let hotspotData = [];
//   let deleteMode = false;
//   let isDragging = false;
//   let dragIndex = -1;

//   const loadHotspots = () => {
//     const existingHotspots = JSON.parse($('#hotspots').val() || '[]');
//     if (Array.isArray(existingHotspots)) {
//         hotspotData = existingHotspots;
//         existingHotspots.forEach(function (hotspot, index) {
//             addHotspotElement(hotspot, index);
//         });
//     } else {
//         console.error('Existing hotspots data is not an array:', existingHotspots);
//     }
// };

//   // Function to add a new hotspot element to the DOM
//   const addHotspotElement = (hotspot, index) => {
//       $('#hotspot-interface').append(
//           `<div class="hotspot" data-index="${index}" style="left:${hotspot.x_position}%; top:${hotspot.y_position}%; z-index: ${index + 1};">
//               <div class="hotspot-circle"></div>
//               <button class="delete-hotspot" style="display: none;">Delete</button>
//           </div>`
//       );
//   };

//   // Handle project image selection
//   $("#hotspots-image-select").on("change", function () {
//       const selectedOption = $(this).find('option:selected');
//       const imageUrl = selectedOption.data('image-url');
//       $('#hotspots_image_url').val(imageUrl);
//       $('#hotspots-image').attr("src", imageUrl).show();
//   });

//   $("#choose-product-button").on("click", function (e) {
//       e.preventDefault();

//       let productFrame = wp.media({
//           title: "Select Product",
//           multiple: false,
//           library: {
//               type: 'image'
//           },
//           button: {
//               text: "Select"
//           }
//       }).open()
//       .on("select", function () {
//           const selectedProduct = productFrame.state().get("selection").first().toJSON();
//           const productHtml = `<div class="chosen-product" data-id="${selectedProduct.id}" data-url="${selectedProduct.url}">
//               <img src="${selectedProduct.url}" style="max-width: 100px; max-height: 100px;">
//               <span>${selectedProduct.title}</span>
//           </div>`;
//           $("#chosen-products").html(productHtml);  // Display the selected product
//           $('#hotspot-controls').show();  // Show the controls for positioning the hotspot

//           // Display initial hotspot circle at default position (50%, 50%)
//           const initialX = $('#hotspot-x').val();
//           const initialY = $('#hotspot-y').val();
//           displayHotspotPreview(initialX, initialY);
//       });
//   });

//   const addHotspot = () => {
//       const x_position = $("#hotspot-x").val();
//       const y_position = $("#hotspot-y").val();
//       const product = $("#chosen-products .chosen-product:last").data('id');
//       const productUrl = $("#chosen-products .chosen-product:last").data('url');

//       if (product) {
//           const hotspot = {
//               product: product,
//               x_position: x_position,
//               y_position: y_position,
//               product_url: productUrl
//           };

//           hotspotData.push(hotspot);
//           $("#hotspots").val(JSON.stringify(hotspotData));

//           const index = hotspotData.length - 1;
//           addHotspotElement(hotspot, index);

//           // Clear the selected product and controls to allow adding another hotspot
//           $("#chosen-products").html('');
//           $('#hotspot-controls').hide();
//       }
//   };

//   const toggleDeleteMode = () => {
//       deleteMode = !deleteMode;
//       if (deleteMode) {
//           $('.hotspot').each(function () {
//               $(this).append('<button class="delete-hotspot">Delete</button>');
//           });
//       } else {
//           $('.delete-hotspot').remove();
//       }
//   };

//   const deleteHotspot = (index) => {
//       hotspotData.splice(index, 1);
//       $("#hotspots").val(JSON.stringify(hotspotData));

//       // Re-render the hotspots
//       $("#hotspot-interface").empty();
//       loadHotspots();
//       if (deleteMode) {
//           toggleDeleteMode();
//       }
//   };

//   $(document).on("click", ".delete-hotspot", function () {
//       const index = $(this).parent().data("index");
//       deleteHotspot(index);
//   });

//   $("#delete-mode").on("click", function () {
//       toggleDeleteMode();
//   });

//   $("#add-hotspot").on("click", function () {
//       addHotspot();
//   });

//   // Handle dragging of hotspots
//   $(document).on('mousedown', '.hotspot', function (e) {
//       if (!deleteMode) {
//           isDragging = true;
//           dragIndex = $(this).data('index');
//           const offset = $(this).offset();
//           const mouseX = e.pageX;
//           const mouseY = e.pageY;
//           $(document).on('mousemove.hotspotDrag', function (e) {
//               if (isDragging) {
//                   const dx = e.pageX - mouseX;
//                   const dy = e.pageY - mouseY;
//                   const newLeft = ((offset.left + dx) / $('#hotspots-image').width()) * 100;
//                   const newTop = ((offset.top + dy) / $('#hotspots-image').height()) * 100;
//                   $(`.hotspot[data-index="${dragIndex}"]`).css({left: newLeft + '%', top: newTop + '%'});
//               }
//           });
//       }
//   });

//   $(document).on('mouseup', function () {
//       if (isDragging) {
//           isDragging = false;
//           $(document).off('mousemove.hotspotDrag');
//           const newLeft = $(`.hotspot[data-index="${dragIndex}"]`).css('left');
//           const newTop = $(`.hotspot[data-index="${dragIndex}"]`).css('top');
//           hotspotData[dragIndex].x_position = parseFloat(newLeft);
//           hotspotData[dragIndex].y_position = parseFloat(newTop);
//           $("#hotspots").val(JSON.stringify(hotspotData));
//       }
//   });

//   // Function to display hotspot circle preview based on range input values
//   const displayHotspotPreview = (x_position, y_position) => {
//       $('.hotspot-preview').remove(); // Remove any existing hotspot preview
//       $('#hotspot-interface').append(
//           `<div class="hotspot-preview" style="left:${x_position}%; top:${y_position}%;">
//               <div class="hotspot-circle"></div>
//           </div>`
//       );
//   };

//   // Update hotspot preview as range inputs change
//   $('#hotspot-x, #hotspot-y').on('input', function () {
//       const x_position = $('#hotspot-x').val();
//       const y_position = $('#hotspot-y').val();
//       displayHotspotPreview(x_position, y_position);
//   });

//   // Trigger the load event to initialize hotspots
//   $('#hotspots-image').on('load', function() {
//       loadHotspots();
//   });

//   // Ensure the image loads correctly to trigger the load event
//   if ($('#hotspots-image').attr('src')) {
//       $('#hotspots-image').trigger('load');
//   }

// //   const clearAllData = () => {
// //     hotspotData = []; // Reset hotspot data array
// //     $('#hotspots').val(''); // Clear the hidden input field value if needed

// //     // Clear the UI
// //     $('#hotspot-interface').empty(); // Remove all hotspot elements from the DOM
// //     $('#chosen-products').empty(); // Clear selected products UI
// //     $('#hotspot-controls').hide(); // Hide hotspot controls
// // };

// // // Handle project image selection
// // $("#hotspots-image-select").on("change", function () {
// //     const selectedOption = $(this).find('option:selected');
// //     const imageUrl = selectedOption.data('image-url');
// //     $('#hotspots_image_url').val(imageUrl);
// //     $('#hotspots-image').attr("src", imageUrl).show();
// // });

// //   $("#clear-all-data").on("click", function () {
// //     clearAllData();
// // });

//   // Button to create other product hotspots on the same project image
//   $("#create-other-hotspots").on("click", function () {
//       // Reset the selected product controls for adding a new hotspot
//       $('#chosen-products').html('');
//       $('#hotspot-controls').hide();
//       // Optionally, reset the range inputs
//       $('#hotspot-x').val(50);
//       $('#hotspot-y').val(50);
//       $('.hotspot-preview').css({left: '50%', top: '50%'});
//   });
// });

// ----------------------------------------Vanilla JS---------------------------------------------------------------
// document.addEventListener("DOMContentLoaded", function () {
//   // Initialize hotspot data (will store hotspot data here)
//   let hotspotData = [];

//   //  Loading existing hotspot data
//   const loadHotspots = () => {
//     const hotspotsElement = document.getElementById("hotspots");
//     if (!hotspotsElement) return;

//     const existingHotspots = JSON.parse(hotspotsElement.value || "[]");
//     hotspotData = existingHotspots;
//     const hotspotInterface = document.getElementById("hotspot-interface");
//     existingHotspots.forEach(function (hotspot) {
//       const hotspotDiv = document.createElement("div");
//       hotspotDiv.className = "hotspot";
//       hotspotDiv.style.left = hotspot.x_position + "%";
//       hotspotDiv.style.top = hotspot.y_position + "%";
//       hotspotInterface.appendChild(hotspotDiv);
//     });
//   };

//   // Save the current hotspot data to a hidden input element in JSON format
//   const saveHotspotsData = () => {
//     const hotspotsElement = document.getElementById("hotspots");
//     if (hotspotsElement) {
//       hotspotsElement.value = JSON.stringify(hotspotData);
//     }
//   };

//   // Select image, and change the displayed selected image
//   const hotspotImageSelect = document.getElementById("hotspots-image-select");
//   if (hotspotImageSelect) {
//     hotspotImageSelect.addEventListener("change", function () {
//       const selectedOption = this.options[this.selectedIndex];
//       const imageUrl = selectedOption.getAttribute("data-image-url");
//       const hotspotsImageUrlInput = document.getElementById("hotspots_image_url");
//       if (hotspotsImageUrlInput) {
//         hotspotsImageUrlInput.value = imageUrl;
//       }
//       const hotspotsImage = document.getElementById("hotspots-image");
//       if (hotspotsImage) {
//         hotspotsImage.setAttribute("src", imageUrl);
//         hotspotsImage.style.display = "block";
//       }
//     });
//   }

//   // update the displayed value of range input sliders
//   const rangeInputs = document.querySelectorAll('input[type="range"]');
//   rangeInputs.forEach(function (input) {
//     const rangeValueSpan = input.nextElementSibling;
//     if (rangeValueSpan) {
//       rangeValueSpan.innerHTML = input.value;
//     }
//     input.addEventListener("input", function () {
//       rangeValueSpan.innerHTML = this.value;
//     });
//   });

//   // opens the media library to select a product image
//   const chooseProductButton = document.getElementById("choose-product-button");
//   if (chooseProductButton) {
//     chooseProductButton.addEventListener("click", function (e) {
//       e.preventDefault();
//       const productFrame = wp
//         .media({
//           title: "製品の選択",
//           multiple: false,
//           library: { type: "image" },
//           button: { text: "選択" },
//         })
//         .open()
//         .on("select", function () {
//           const selectedProduct = productFrame.state().get("selection").first().toJSON();
//           const productHtml = `
//             <div class="chosen-product" data-id="${selectedProduct.id}" data-url="${selectedProduct.url}">
//               <img src="${selectedProduct.url}" style="max-width: 100px; max-height: 100px;">
//             </div>`;
//           const chosenProducts = document.getElementById("chosen-products");
//           if (chosenProducts) {
//             chosenProducts.innerHTML = productHtml;
//           }
//           const hotspotControls = document.getElementById("hotspot-controls");
//           if (hotspotControls) {
//             hotspotControls.style.display = "block";
//           }
//         });
//     });
//   }

//   // add hotspot to a project image
//   const addHotspot = (hotspotControls, chosenProducts, x_position, y_position) => {
//     const chosenProduct = chosenProducts.querySelector(".chosen-product");
//     if (!chosenProduct) return;
//     const product = chosenProduct.getAttribute("data-id");
//     const productUrl = chosenProduct.getAttribute("data-url");

//     if (product) {
//       const hotspot = {
//         product: product,
//         x_position: x_position,
//         y_position: y_position,
//         product_url: productUrl,
//       };

//       console.log("hotspotData", hotspotData)

//       hotspotData.push(hotspot);
//       console.log('Hotspot added:', hotspot);  // Debug statement
//       saveHotspotsData();

//       const hotspotDiv = document.createElement("div");
//       hotspotDiv.className = "hotspot";
//       hotspotDiv.style.left = x_position + "%";
//       hotspotDiv.style.top = y_position + "%";
//       document.getElementById("hotspot-interface").appendChild(hotspotDiv);

//       chosenProducts.innerHTML = "";
//       hotspotControls.style.display = "none";
//     } else {
//       console.error('Product not found');  // Debug statement
//     }
//   };

//   // update the position of the hotspot preview
//   const updateHotspotPreview = (hotspotControlsContainer) => {
//     const x_position = hotspotControlsContainer.querySelector(".hotspot-x").value;
//     const y_position = hotspotControlsContainer.querySelector(".hotspot-y").value;
//     const hotspotPreview = hotspotControlsContainer.querySelector(".hotspot-preview");
//     const xRangeValue = hotspotControlsContainer.querySelector(".x-range-value");
//     const yRangeValue = hotspotControlsContainer.querySelector(".y-range-value");

//     if (hotspotPreview) {
//       hotspotPreview.style.left = x_position + "%";
//       hotspotPreview.style.top = y_position + "%";
//     }
//     if (xRangeValue) {
//       xRangeValue.textContent = x_position;
//     }
//     if (yRangeValue) {
//       yRangeValue.textContent = y_position;
//     }
//   };

//   // create hotspot controls, range sliders, and add hotspot button
//   const createHotspotControls = () => {
//     const hotspotControlsContainer = document.createElement("div");
//     hotspotControlsContainer.className = "hotspot-controls";
//     hotspotControlsContainer.id = "hotspot-controls";

//     hotspotControlsContainer.innerHTML = `
//       <div class="chosen-products" id="chosen-products"></div>
//       <div class="hotspot-controls">
//         <label for="hotspot-x">X Position:</label>
//         <input type="range" class="hotspot-x" min="0" max="100" value="50">
//         <span class="x-range-value">50</span><br>

//         <label for="hotspot-y">Y Position:</label>
//         <input type="range" class="hotspot-y" min="0" max="100" value="50">
//         <span class="y-range-value">50</span><br>

//         <div class="hotspot-preview" style="position: absolute; width: 10px; height: 10px; background: red; border-radius: 50%;"></div>
//         <button id="add-hotspot">Add Hotspot</button>
//       </div>
//     `;

//     console.log(hotspotControlsContainer)

//     const addHotspotBtn = document.getElementById("add-hotspot");
//     console.log("addHotspotBtn", addHotspotBtn);

//     addHotspotBtn.addEventListener("click", function (e) {
//       console.log("click", e)
//       e.preventDefault();
//       const hotspotControls = this.closest(".hotspot-controls");
//       const chosenProducts = hotspotControlsContainer.querySelector(".chosen-products");
//       const x_position = hotspotControls.querySelector(".hotspot-x").value;
//       const y_position = hotspotControls.querySelector(".hotspot-y").value;
//       console.log("Adding hotspot:", { x_position, y_position });
//       addHotspot(hotspotControls, chosenProducts, x_position, y_position);
//     });

//     const hotspotX = hotspotControlsContainer.querySelector(".hotspot-x");
//     const hotspotY = hotspotControlsContainer.querySelector(".hotspot-y");

//     if (hotspotX) {
//       hotspotX.addEventListener("input", function () {
//         updateHotspotPreview(hotspotControlsContainer);
//       });
//     }

//     if (hotspotY) {
//       hotspotY.addEventListener("input", function () {
//         updateHotspotPreview(hotspotControlsContainer);
//       });
//     }

//     const hotspotControlsParent = document.getElementById("hotspot-controls-container");
//     if (hotspotControlsParent) {
//       hotspotControlsParent.appendChild(hotspotControlsContainer);
//       updateHotspotPreview(hotspotControlsContainer);
//     } else {
//       console.error("hotspot-controls-container does not exist in the DOM.");
//     }
//   };

//   const createOtherHotspotsButton = document.getElementById("create-other-hotspots");
//   if (createOtherHotspotsButton) {
//     createOtherHotspotsButton.addEventListener("click", function (e) {
//       e.preventDefault();
//       createHotspotControls();
//     });
//   }

//   // Load existing hotspots on page load
//   loadHotspots();

//   // add event listeners to the hotspot image (when the image is loaded, it loads existing hotspots)
//   const hotspotsImage = document.getElementById("hotspots-image");
//   if (hotspotsImage) {
//     hotspotsImage.addEventListener("load", loadHotspots);
//     hotspotsImage.addEventListener("click", function (event) {
//       const rect = this.getBoundingClientRect();
//       const x_position = ((event.clientX - rect.left) / rect.width) * 100;
//       const y_position = ((event.clientY - rect.top) / rect.height) * 100;

//       const hotspotControls = document.getElementById("hotspot-controls");
//       const chosenProducts = document.getElementById("chosen-products");

//       if (hotspotControls && chosenProducts) {
//         addHotspot(hotspotControls, chosenProducts, x_position, y_position);
//       }
//     });
//     if (hotspotsImage.getAttribute("src")) {
//       hotspotsImage.dispatchEvent(new Event("load"));
//     }
//   }

//   console.log(hotspotData)
// });

/////////////////////////////////////////////////////////////////////////////
// document.addEventListener("DOMContentLoaded", function () {
//   let hotspotData = [];

//   const loadHotspots = () => {
//     console.log("Loading hotspots...");
//     const hotspotsElement = document.getElementById("hotspots");
//     if (!hotspotsElement) return;

//     const existingHotspots = JSON.parse(hotspotsElement.value || "[]");
//     console.log("existing Hotspots", existingHotspots)
//     hotspotData = existingHotspots;
//     console.log("hotspotData", hotspotData)
//     const hotspotInterface = document.getElementById("hotspot-interface");
//     hotspotData.forEach(function (hotspot) {
//       const hotspotDiv = document.createElement("div");
//       hotspotDiv.className = "hotspot";
//       hotspotDiv.style.left = hotspot.x_position + "%";
//       hotspotDiv.style.top = hotspot.y_position + "%";
//       hotspotInterface.appendChild(hotspotDiv);
//     });
//     console.log("Hotspots loaded:", hotspotData);
//   };

//   const saveHotspotsData = () => {
//     const hotspotsElement = document.getElementById("hotspots");
//     if (hotspotsElement) {
//       hotspotsElement.value = JSON.stringify(hotspotData);
//       console.log("Hotspots saved:", hotspotsElement.value);
//     }
//   };

//   const hotspotImageSelect = document.getElementById("hotspots-image-select");
//   if (hotspotImageSelect) {
//     hotspotImageSelect.addEventListener("change", function () {
//       const selectedOption = this.options[this.selectedIndex];
//       const imageUrl = selectedOption.getAttribute("data-image-url");
//       const hotspotsImageUrlInput =
//         document.getElementById("hotspots_image_url");
//       if (hotspotsImageUrlInput) {
//         hotspotsImageUrlInput.value = imageUrl;
//       }
//       const hotspotsImage = document.getElementById("hotspots-image");
//       if (hotspotsImage) {
//         hotspotsImage.setAttribute("src", imageUrl);
//         hotspotsImage.style.display = "block";
//         console.log("Image selected:", imageUrl);
//       }
//     });
//   }

//   const rangeInputs = document.querySelectorAll('input[type="range"]');
//   rangeInputs.forEach(function (input) {
//     const rangeValueSpan = input.nextElementSibling;
//     if (rangeValueSpan) {
//       rangeValueSpan.innerHTML = input.value;
//     }
//     input.addEventListener("input", function () {
//       rangeValueSpan.innerHTML = this.value;
//     });
//   });

//   const chooseProductButton = document.getElementById("choose-product-button");
//   if (chooseProductButton) {
//     chooseProductButton.addEventListener("click", function (e) {
//       e.preventDefault();
//       const productFrame = wp
//         .media({
//           title: "製品の選択",
//           multiple: false,
//           library: { type: "image" },
//           button: { text: "選択" },
//         })
//         .open()
//         .on("select", function () {
//           const selectedProduct = productFrame
//             .state()
//             .get("selection")
//             .first()
//             .toJSON();
//           const productHtml = `
//             <div class="chosen-product" data-id="${selectedProduct.id}" data-url="${selectedProduct.url}">
//               <img src="${selectedProduct.url}" style="max-width: 100px; max-height: 100px;">
//             </div>`;
//           const chosenProducts = document.getElementById("chosen-products");
//           if (chosenProducts) {
//             chosenProducts.innerHTML = productHtml;
//             console.log("Product selected:", selectedProduct);
//           }
//           const hotspotControls = document.getElementById("hotspot-controls");
//           if (hotspotControls) {
//             hotspotControls.style.display = "block";
//           }
//         });
//     });
//   }

//   // const addHotspot = (hotspotControls, chosenProducts, x_position, y_position) => {
//   //   const chosenProduct = chosenProducts.querySelector(".chosen-product");
//   //   if (!chosenProduct) return;
//   //   const product = chosenProduct.getAttribute("data-id");
//   //   const productUrl = chosenProduct.getAttribute("data-url");

//   //   if (product) {
//   //     const hotspot = {
//   //       product: product,
//   //       x_position: x_position,
//   //       y_position: y_position,
//   //       product_url: productUrl,
//   //     };

//   //     console.log("hotspotData before adding:", hotspotData);

//   //     hotspotData.push(hotspot);
//   //     console.log('Hotspot added:', hotspot);
//   //     saveHotspotsData();

//   //     const hotspotDiv = document.createElement("div");
//   //     hotspotDiv.className = "hotspot";
//   //     hotspotDiv.style.left = x_position + "%";
//   //     hotspotDiv.style.top = y_position + "%";
//   //     document.getElementById("hotspot-interface").appendChild(hotspotDiv);

//   //     chosenProducts.innerHTML = "";
//   //     hotspotControls.style.display = "none";
//   //   } else {
//   //     console.error('Product not found');
//   //   }
//   // };

//   const addHotspot = () => {
//     const x_position = document.getElementById("hotspot-x").value;
//     const y_position = document.getElementById("hotspot-y").value;
//     const chosenProduct = document.querySelector(
//       "#chosen-products .chosen-product:last-child"
//     );
//     console.log("chosen-products", chosenProduct)
//     const product = chosenProduct.getAttribute("data-id");
//     console.log("product", product);
//     const productUrl = chosenProduct.getAttribute("data-url");

//     if (product) {
//       const hotspot = {
//         product: product,
//         x_position: x_position,
//         y_position: y_position,
//         product_url: productUrl,
//       };

//       hotspotData.push(hotspot);
//       document.getElementById("hotspots").value = JSON.stringify(hotspotData);

//       const hotspotDiv = document.createElement("div");
//       hotspotDiv.className = "hotspot";
//       hotspotDiv.style.left = x_position + "%";
//       hotspotDiv.style.top = y_position + "%";
//       document.getElementById("hotspot-interface").appendChild(hotspotDiv);

//       // Clear the selected product and controls to allow adding another hotspot
//       document.getElementById("chosen-products").innerHTML = "";
//       document.getElementById("hotspot-controls").style.display = "none";
//     }
//   };

//   document.getElementById("add-hotspot").addEventListener("click", function () {
//     addHotspot();
//     saveHotspotsData();
//   });

//   document.getElementById("hotspot-x").addEventListener("input", function () {
//     const x_position = this.value;
//     const y_position = document.getElementById("hotspot-y").value;
//     document.querySelector("#hotspots-image").style.left = x_position + "%";
//     document.querySelector("#hotspots-image").style.top = y_position + "%";
//   });

//   document.getElementById("hotspot-y").addEventListener("input", function () {
//     const x_position = document.getElementById("hotspot-x").value;
//     const y_position = this.value;
//     document.querySelector("#hotspots-image").style.left = x_position + "%";
//     document.querySelector("#hotspots-image").style.top = y_position + "%";
//   });

//   document.getElementById("hotspot-x").dispatchEvent(new Event("input"));
//   document.getElementById("hotspot-y").dispatchEvent(new Event("input"));

//   // Trigger the load event to initialize hotspots
//   document
//     .getElementById("hotspots-image")
//     .addEventListener("load", function () {
//       loadHotspots();
//     });

//   const updateHotspotPreview = (hotspotControlsContainer) => {
//     const x_position =
//       hotspotControlsContainer.querySelector(".hotspot-x").value;
//     const y_position =
//       hotspotControlsContainer.querySelector(".hotspot-y").value;
//     const hotspotPreview =
//       hotspotControlsContainer.querySelector(".hotspot-preview");
//     const xRangeValue =
//       hotspotControlsContainer.querySelector(".x-range-value");
//     const yRangeValue =
//       hotspotControlsContainer.querySelector(".y-range-value");

//     if (hotspotPreview) {
//       hotspotPreview.style.left = x_position + "%";
//       hotspotPreview.style.top = y_position + "%";
//     }
//     if (xRangeValue) {
//       xRangeValue.textContent = x_position;
//     }
//     if (yRangeValue) {
//       yRangeValue.textContent = y_position;
//     }
//   };

//   const createHotspotControls = () => {
//     console.log("Creating hotspot controls...");
//     const hotspotControlsContainer = document.createElement("div");
//     hotspotControlsContainer.className = "hotspot-controls";
//     hotspotControlsContainer.id = "hotspot-controls";

//     hotspotControlsContainer.innerHTML = `
//       <div class="chosen-products" id="chosen-products"></div>
//       <div class="hotspot-controls">
//         <label for="hotspot-x">X Position:</label>
//         <input type="range" class="hotspot-x" min="0" max="100" value="50">
//         <span class="x-range-value">50</span><br>

//         <label for="hotspot-y">Y Position:</label>
//         <input type="range" class="hotspot-y" min="0" max="100" value="50">
//         <span class="y-range-value">50</span><br>

//         <div class="hotspot-preview" style="position: absolute; width: 10px; height: 10px; background: red; border-radius: 50%;"></div>
//         <button id="add-hotspot">Add Hotspot</button>
//       </div>
//     `;

//     const hotspotControlsParent = document.getElementById(
//       "hotspot-controls-container"
//     );
//     if (hotspotControlsParent) {
//       hotspotControlsParent.appendChild(hotspotControlsContainer);
//       updateHotspotPreview(hotspotControlsContainer);

//       const addHotspotBtn =
//         hotspotControlsContainer.querySelector("#add-hotspot");
//       console.log("addHotspotBtn", addHotspotBtn);
//       if (addHotspotBtn) {
//         addHotspotBtn.addEventListener("click", function (e) {
//           console.log("Add Hotspot button clicked");
//           e.preventDefault();
//           const hotspotControls = this.closest(".hotspot-controls");
//           const chosenProducts =
//             hotspotControls.querySelector(".chosen-products");
//           const x_position = hotspotControls.querySelector(".hotspot-x").value;
//           const y_position = hotspotControls.querySelector(".hotspot-y").value;
//           console.log("Adding hotspot:", { x_position, y_position });
//           addHotspot(hotspotControls, chosenProducts, x_position, y_position);
//         });
//       } else {
//         console.error("add-hotspot button not found.");
//       }
//     } else {
//       console.error("hotspot-controls-container does not exist in the DOM.");
//     }
//   };

//   const createOtherHotspotsButton = document.getElementById(
//     "create-other-hotspots"
//   );
//   if (createOtherHotspotsButton) {
//     createOtherHotspotsButton.addEventListener("click", function (e) {
//       e.preventDefault();
//       createHotspotControls();
//     });
//   }

//   loadHotspots();

//   const hotspotsImage = document.getElementById("hotspots-image");
//   if (hotspotsImage) {
//     hotspotsImage.addEventListener("load", loadHotspots);
//     hotspotsImage.addEventListener("click", function (event) {
//       const rect = this.getBoundingClientRect();
//       const x_position = ((event.clientX - rect.left) / rect.width) * 100;
//       const y_position = ((event.clientY - rect.top) / rect.height) * 100;

//       const hotspotControls = document.getElementById("hotspot-controls");
//       const chosenProducts = document.getElementById("chosen-products");

//       if (hotspotControls && chosenProducts) {
//         addHotspot(hotspotControls, chosenProducts, x_position, y_position);
//       }
//     });
//     if (hotspotsImage.getAttribute("src")) {
//       hotspotsImage.dispatchEvent(new Event("load"));
//     }
//   }

//   console.log("Initial hotspotData:", hotspotData);
// });
