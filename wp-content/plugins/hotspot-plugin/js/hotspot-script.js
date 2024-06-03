jQuery(document).ready(function ($) {
    let hotspotData = [];
    let timeoutId;

    const loadHotspots = () => {
        const existingHotspots = JSON.parse($('#hotspots').val() || '[]');
        hotspotData = existingHotspots;
        existingHotspots.forEach(function (hotspot) {
            $('#hotspot-interface').append('<div class="hotspot" style="left:' + hotspot.x + '%; top:' + hotspot.y + '%;"></div>');
        });
    };

    $("#hotspots-image-select").on("change", function () {
        const imageId = $(this).val();
        if (imageId) {
            const imageUrl = $(this).find('option:selected').data('image-url');
            $("#hotspots-image").attr("src", imageUrl);
            $("input[name='hotspots_image_url']").val(imageUrl); // Store the image URL in a hidden field
        } else {
            $("#hotspots-image").attr("src", "");
        }
    });

    $("#choose-product-button").on("click", function (e) {
        e.preventDefault();

        let product = wp.media({
            title: "Select Product",
            multiple: false,
            library: {
                type: 'image'
            },
            button: {
                text: "Select"
            }
        }).open()
        .on("select", function () {
            const selectedProduct = product.state().get("selection").first().toJSON();
            const productHtml = `<div class="chosen-product" data-id="${selectedProduct.id}" data-url="${selectedProduct.url}">
                <img src="${selectedProduct.url}" style="max-width: 100px; max-height: 100px;">
                <span>${selectedProduct.title}</span>
            </div>`;
            $("#chosen-products").append(productHtml);
        });
    });

    const addHotspot = () => {
        const x = $("#hotspot-x").val();
        const y = $("#hotspot-y").val();
        const product = $("#chosen-products .chosen-product:last").data('url');

        if (product) {
            const hotspot = {
                x,
                y,
                info: product,
                image: $("#hotspots-image").attr("src")
            };

            hotspotData.push(hotspot);
            $("#hotspots").val(JSON.stringify(hotspotData));

            $("#hotspot-interface").append(
                '<div class="hotspot" style="left:' + x + '%; top:' + y + '%;"></div>'
            );
        }
    };

    $("#hotspot-x, #hotspot-y").on("input", function () {
        const value = $(this).val();
        $(this).next(".range-value").text(value);

        clearTimeout(timeoutId);
        timeoutId = setTimeout(addHotspot, 500); // Delay in milliseconds before adding the hotspot
    });

    $(document).on('load', '#hotspots-image', function () {
        loadHotspots();
    }).trigger('load');
});
