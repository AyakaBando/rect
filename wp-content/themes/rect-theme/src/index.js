// // ------------------------------------------------------- Photos Filter by Tags -------------------------------------------------------
jQuery(document).ready(function ($) {
  $(".filter-button").on("click", function () {
    const selectedTag = $(this).data("tag");
    if (selectedTag === "all") {
      $(".gallery-item").show();
    } else {
      $(".gallery-item").hide();
      $(".gallery-item").each(function () {
        const tags = $(this).data("tags");
        if (tags.indexOf(selectedTag) !== -1) {
          $(this).show();
        }
      });
    }
  });
});

// // ------------------------------------------------------- Functionality for carousel and hotspots -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  let currentIndex = 0;
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const productContainers = document.querySelectorAll(".product-container");

  function goToSlide(index) {
      // Remove the active class from all slides
      slides.forEach((slide, i) => {
          if (i !== index) {
              slide.classList.remove("active");
              slide.style.display = "none";
          }
      });

      // Add the active class to the current slide
      const currentSlide = slides[index];
      currentSlide.classList.add("active");
      currentSlide.style.display = "block";

      console.log("currentSlide", currentSlide)

      currentIndex = index;
      handleSlideChange(index);
      addHotspotsForImage(currentSlide);
  }

  function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
  }

  function prevSlide() {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
  }

  const nextButton = document.querySelector(".carousel-next");
  const prevButton = document.querySelector(".carousel-prev");

  if (nextButton) {
      nextButton.addEventListener("click", nextSlide);
  }

  if (prevButton) {
      prevButton.addEventListener("click", prevSlide);
  }

  // Get the initial image_id from PHP
  const initialImageId = document.querySelector('.carousel').getAttribute('data-initial-image-id');

  // Find the index of the slide with initialImageId
  const initialSlideIndex = slides.findIndex(slide => slide.getAttribute("data-image-id") === initialImageId);

  // If initialImageId is found, go to that slide
  if (initialSlideIndex !== -1) {
      goToSlide(initialSlideIndex);
  } else {
      // Handle case when initialImageId doesn't match any slides
      console.error("Initial image_id not found in slides.");
      // Optionally, go to first slide as fallback
      goToSlide(0);
  }

  function handleSlideChange(currentSlideIndex) {
      const currentSlide = slides[currentSlideIndex];
      const currentSlideImageId = currentSlide.getAttribute("data-image-id");

      productContainers.forEach(productContainer => {
          const imageId = productContainer.getAttribute("data-image-id");
          if (imageId === currentSlideImageId) {
              productContainer.style.display = "flex";
          } else {
              productContainer.style.display = "none";
          }
      });
  }


  // // ------------------------------------------------------- Hotspots -------------------------------------------------------
  function addHotspotsForImage(slide) {
    const imageId = slide.getAttribute("data-image-id");
    const hotspotContainer = slide.querySelector(".image-hotspots-container");

    if (hotspotContainer) {
      const hotspots = JSON.parse(
        hotspotContainer.getAttribute("data-hotspots")
      );
      hotspotContainer.innerHTML = "";

      hotspots.forEach((hotspot) => {
        const { product, x_position, y_position } = hotspot;
        const hotspotElement = document.createElement("div");
        hotspotElement.classList.add("hotspot");
        hotspotElement.dataset.productId = product;
        hotspotElement.style.left = `${x_position}%`;
        hotspotElement.style.top = `${y_position}%`;
        hotspotContainer.appendChild(hotspotElement);
      });

      hotspotContainer.addEventListener("mouseover", () => {
        hotspotContainer.querySelectorAll(".hotspot").forEach((hotspot) => {
          hotspot.style.display = "block";
        });
      });

      hotspotContainer.addEventListener("mouseout", () => {
        hotspotContainer.querySelectorAll(".hotspot").forEach((hotspot) => {
          hotspot.style.display = "none";
        });
      });
    } else {
      console.warn(`Hotspot container not found for image ID: ${imageId}`);
    }
  }

// // ------------------------------------------------------- Fullscreen functionality -------------------------------------------------------
  let isFullscreen = false;

  function toggleFullScreen(element) {
    if (!document.fullscreenElement) {
      element.requestFullscreen();
      isFullscreen = true;
    }
  }

  function exitFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullscreen = false;
    }
  }

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
    arrowExpandBtn.addEventListener("click", () => {
      const activeSlideImg = document.querySelector(
        ".carousel-slide.active img"
      );
      if (activeSlideImg) {
        toggleFullScreen(activeSlideImg);
      }
    });
  }
});

// ------------------------------------------------------- Projects grid layout change -------------------------------------------------------
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

