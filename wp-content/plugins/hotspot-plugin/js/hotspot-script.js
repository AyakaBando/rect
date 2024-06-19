jQuery(document).ready(function ($) {
  let hotspotData = [];

  const loadHotspots = () => {
    const existingHotspots = JSON.parse($("#hotspots").val() || "[]");
    hotspotData = existingHotspots;
    console.log("hotspotData", hotspotData)
    existingHotspots.forEach(function (hotspot) {
      $("#hotspot-interface").append(
        '<div class="hotspot" style="left:' +
          hotspot.x_position +
          "%; top:" +
          hotspot.y_position +
          '%;"></div>'
      );
    });
  };

  $("#select-project-image").on("click", function (e) {
    e.preventDefault();

    let projectImageFrame = wp
      .media({
        title: "Select Project Image",
        button: {
          text: "Use this image",
        },
        multiple: false,
      })
      .open()
      .on("select", function () {
        const attachment = projectImageFrame
          .state()
          .get("selection")
          .first()
          .toJSON();
        $("#hotspots_image_id").val(attachment.id);
        $("#hotspots_image_url").val(attachment.url);
        $("#hotspots-image").attr("src", attachment.url);
      });
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
        const productHtml = `<div class="chosen-product" data-id="${selectedProduct.id}" data-url="${selectedProduct.url}">
                <img src="${selectedProduct.url}" style="max-width: 100px; max-height: 100px;">
                <span>${selectedProduct.title}</span>
            </div>`;
        // $("#chosen-products").append(productHtml);
        $("#chosen-products").html(productHtml);
        $("#hotspot-controls").show();
      });
  });

  const addHotspot = () => {
    const x_position = $("#hotspot-x").val();
    const y_position = $("#hotspot-y").val();
    const product = $("#chosen-products .chosen-product:last").data("id");
    const productUrl = $("#chosen-products .chosen-product:last").data("url");

    if (product) {
      const hotspot = {
        product: product,
        x_position: x_position,
        y_position: y_position,
        product_url: productUrl,
      };

      hotspotData.push(hotspot);
      $("#hotspots").val(JSON.stringify(hotspotData));

      $("#hotspot-interface").append(
        '<div class="hotspot" style="left:' +
          x_position +
          "%; top:" +
          y_position +
          '%;"></div>'
      );

      $("#chosen-products").html("");
      $("#hotspot-controls").hide();
    }
  };

  $("#add-hotspot").on("click", function () {
    addHotspot();
  });

  $("#hotspot-x, #hotspot-y").on("input", function () {
    // const value = $(this).val();
    // $(this).next(".range-value").text(value);
    const x_position = $("#hotspot-x").val();
    const y_position = $("#hotspot-y").val();
    $(".hotspot-preview").css({
      left: x_position + "%",
      top: y_position + "%",
    });
  });

  $("#hotspot-x, #hotspot-y").trigger("input");

  // $(document).on('load', '#hotspots-image', function() {
  //     loadHotspots();
  // }).trigger("load");

  $("#hotspots-image").on("load", function () {
    loadHotspots();
  });

  if ($("#hotspots-image").attr("src")) {
    $("#hotspots-image").trigger("load");
  }

  $("#create-other-hotspot").on("click", function () {
    $("#chosen-products").html("");
    $("#hotspot-controls").hide();
    $("#hotspot-x").val(50);
    $("#hotspot-y").val(50);
    $(".hotspot-preview").css({ left: "50%", top: "50%" });
  });
});
