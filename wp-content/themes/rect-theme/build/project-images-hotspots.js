document.addEventListener("DOMContentLoaded", function () {
  function addHotspotsForImage(imageId, hotspots) {
    hotspots.forEach(hotspot => {
      if (hotspot.image === imageId) {
        let productId = hotspot.product;
        let x_position = hotspot.x_position;
        let y_position = hotspot.y_position;
        let hotspotHtml = `<div class="hotspot" data-product-id="${productId}" style="left:${x_position}%; top:${y_position}%;"></div>`;
        document.querySelector(`.image-hotspots-container[data-image-id="${imageId}"] .hotspots-container`).insertAdjacentHTML("beforeend", hotspotHtml);
      }
    });
  }

  document.querySelectorAll(".image-hotspots").forEach(imageElement => {
    imageElement.addEventListener("click", function (event) {
      event.preventDefault();
      let imageId = this.getAttribute("data-image-id");
      let hotspotsData = JSON.parse(this.dataset.hotspots);
      let hotspots = hotspotsData.filter(hotspot => hotspot.image === imageId);
      addHotspotsForImage(imageId, hotspots);
    });
  });

  document.getElementById("add-project-image").addEventListener("click", (e) => {
    e.preventDefault();
    let frame = wp.media({
      title: "Select or Upload Image",
      button: { text: "Use this image" },
      multiple: false
    });

    frame.on("select", () => {
      let attachment = frame.state().get("selection").first().toJSON();
      addHotspotsForImage(attachment.id, []);
    });

    frame.open();
  });

  document.getElementById("project-images-hotspots").addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-hotspot")) {
      e.target.closest(".hotspot").remove();
    }
  });

  document.getElementById("post").addEventListener("submit", () => {
    let imagesData = [];
    document.querySelectorAll("#project-images-hotspots .image-hotspots").forEach(imageElement => {
      let imageId = imageElement.getAttribute("data-image-id");
      let hotspots = [];

      imageElement.querySelectorAll(".hotspot").forEach(hotspotElement => {
        let productId = hotspotElement.getAttribute("data-product-id");
        let x = (parseFloat(hotspotElement.style.left) / imageElement.querySelector(".hotspots-container").offsetWidth) * 100;
        let y = (parseFloat(hotspotElement.style.top) / imageElement.querySelector(".hotspots-container").offsetHeight) * 100;

        hotspots.push({ product: productId, x_position: x, y_position: y });
      });

      imagesData.push({ image: imageId, hotspots });
    });

    document.getElementById("project_images_hotspots").value = JSON.stringify(imagesData);
  });

  let existingData = document.getElementById("project_images_hotspots").value;
  if (existingData) {
    let imagesData = JSON.parse(existingData);
    imagesData.forEach(imageData => addHotspotsForImage(imageData.image, imageData.hotspots));
  }
});
