// Photos Filter by Tags
jQuery(document).ready(function ($) {
  $(".filter-button").on("click", function () {
    const selectedTag = $(this).data("tag");
    if (selectedTag === "all") {
      $(".gallery-item").show(); // Show all images if 'All' tag is selected
    } else {
      $(".gallery-item").hide(); // Hide all images initially
      $(".gallery-item").each(function () {
        const tags = $(this).data("tags");
        if (tags.indexOf(selectedTag) !== -1) {
          $(this).show(); // Show images with selected tag
        }
      });
    }
  });
});

// Functionality for carousel and hotspots
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  const carouselTrack = document.querySelector(".carousel-track");
  let currentIndex = 0;
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));

  function goToSlide(index) {
    console.log("Going to slide:", index);
    slides.forEach((slide, i) => {
      const productInfo = slide.querySelector(".product-info");
      if (i === index) {
        slide.classList.add("active");
        slide.style.display = "block";
        if (productInfo) productInfo.style.display = "block";
      } else {
        slide.classList.remove("active");
        slide.style.display = "none";
        if (productInfo) productInfo.style.display = "none";
      }
    });
    currentIndex = index;
    handleSlideChange(index);
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    console.log("Next slide:", nextIndex);
    goToSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    console.log("Previous slide:", prevIndex);
    goToSlide(prevIndex);
  }

  const nextButton = document.querySelector(".carousel-next");
  const prevButton = document.querySelector(".carousel-prev");

  nextButton?.addEventListener("click", nextSlide);
  prevButton?.addEventListener("click", prevSlide);

  goToSlide(0);

  function handleSlideChange(currentSlideIndex) {
    const currentSlide = slides[currentSlideIndex];
    const currentSlideImageId = currentSlide.getAttribute("data-image-id");

    console.log(
      "Slide changed to:",
      currentSlideIndex,
      "Image ID:",
      currentSlideImageId
    );

    const hotspotContainers = document.querySelectorAll(
      ".image-hotspots-container"
    );
    hotspotContainers.forEach((hotspotContainer) => {
      const imageId = hotspotContainer.getAttribute("data-image-id");
      if (imageId === currentSlideImageId) {
        // Show hotspots for the matching image
        hotspotContainer.style.display = "block";
        addHotspotsForImage(
          imageId,
          JSON.parse(hotspotContainer.getAttribute("data-hotspots"))
        );
      } else {
        // Hide hotspots for non-matching images
        hotspotContainer.style.display = "none";
      }
    });
  }

  slides.forEach((slide, index) => {
    slide.addEventListener("transitionend", () => {
      if (slide.classList.contains("active")) {
        handleSlideChange(index);
      }
    });
  });
});

function addHotspotsForImage(imageId, hotspots) {
  console.log("Adding hotspots for image:", imageId, hotspots);

  // Find the hotspot container for the current image ID
  const hotspotContainer = document.querySelector(
    `.image-hotspots-container[data-image-id="${imageId}"]`
  );

  if (hotspotContainer) {
    // Clear existing hotspots
    hotspotContainer.innerHTML = "";

    // Add hotspots for the current image
    hotspots.forEach((hotspot) => {
      const { product, x_position, y_position } = hotspot;
      const hotspotHtml = `
              <div class="hotspot" data-product-id="${product}" style="left:${x_position}%; top:${y_position}%;"></div>
          `;
      hotspotContainer.insertAdjacentHTML("beforeend", hotspotHtml);
    });
    console.log(
      "Hotspot container HTML after adding hotspots:",
      hotspotContainer.innerHTML
    );
  } else {
    console.warn(`Hotspot container not found for image ID: ${imageId}`);
  }
}

// Ensure hotspots are added after images are fully loaded
window.addEventListener("load", () => {
  const slides = document.querySelectorAll(".carousel-slide");
  slides.forEach((slide, index) => {
    const image = slide.querySelector("img");
    if (image) {
      image.addEventListener("load", () => {
        handleSlideChange(index);
      });
      if (image.complete) {
        handleSlideChange(index);
      }
    }
  });
});

// Projects grid layout change
function setupColumnIcons() {
  const threeColumnIcon = document.querySelector(".three-column");
  const twoColumnIcon = document.querySelector(".two-column");
  const projectsContainer = document.querySelector(".projects-container");
  const projectImages = document.querySelectorAll(".wp-post-image");

  if (
    !threeColumnIcon ||
    !twoColumnIcon ||
    !projectsContainer ||
    projectImages.length === 0
  ) {
    return;
  }

  threeColumnIcon.addEventListener("click", function () {
    projectsContainer.classList.remove("grid-two-column");
    projectsContainer.classList.add("grid-three-column");
    projectImages.forEach((image) => {
      image.style.width = "30rem";
      image.style.gap = "2rem";
    });
  });

  twoColumnIcon.addEventListener("click", function () {
    projectsContainer.classList.remove("grid-three-column");
    projectsContainer.classList.add("grid-two-column");
    projectImages.forEach((image) => {
      image.style.width = "45rem";
    });
  });
}

document.addEventListener("DOMContentLoaded", setupColumnIcons);

// Fullscreen functionality
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const slides = document.querySelectorAll(".carousel-slide");

  const fullscreenBtn = document.createElement("button");
  fullscreenBtn.classList.add("fullscreen-btn");
  fullscreenBtn.innerHTML = "Fullscreen";
  let isFullscreen = false;

  function toggleFullScreen(image) {
    if (!document.fullscreenElement) {
      image?.requestFullscreen();
      isFullscreen = true;
    }
  }

  function exitFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullscreen = false;
    }
  }

  fullscreenBtn.addEventListener("click", () => {
    toggleFullScreen(carousel.querySelector(".carousel-slide.active img"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isFullscreen) {
      exitFullScreen();
    }
  });

  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      if (isFullscreen) exitFullScreen();
    });
  });

  const arrowExpandBtn = document.querySelector(".expand-arrow");
  if (arrowExpandBtn) {
    arrowExpandBtn.addEventListener("click", (event) => {
      toggleFullScreen(carousel.querySelector(".carousel-slide.active img"));
    });
  }
});
