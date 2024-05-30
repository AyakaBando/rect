// ------------------------------------------------------- Photos Filter by Tags -------------------------------------------------------
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

// ------------------------------------------------------- Functionality for carousel and hotspots -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const carouselTrack = document.querySelector(".carousel-track");
  let currentIndex = 0;
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const productContainers = document.querySelectorAll(".product-container");

  function goToSlide(index) {
      slides.forEach((slide, i) => {
          if (i === index) {
              slide.classList.add("active");
              slide.style.display = "block";
              addHotspotsForImage(slide);
              handleSlideChange(index);
          } else {
              slide.classList.remove("active");
              slide.style.display = "none";
          }
      });
      currentIndex = index;
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

  goToSlide(0);

  // ------------------------------------------------------- Carousel -------------------------------------------------------
  function handleSlideChange(currentSlideIndex) {
    const currentSlide = slides[currentSlideIndex];
    const currentSlideImageId = currentSlide.getAttribute("data-image-id");

    productContainers.forEach((productContainer) => {
        const imageId = productContainer.getAttribute("data-image-id");
        if (imageId === currentSlideImageId) {
            productContainer.style.display = "flex";
        } else {
            productContainer.style.display = "none";
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

  function addHotspotsForImage(slide) {
    console.log(slide);
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
});

window.addEventListener("load", () => {
  const slides = document.querySelectorAll(".carousel-slide");
  slides.forEach((slide, index) => {
    const image = slide.querySelector("img");
    if (image) {
      image.addEventListener("load", () => {
        if (slide.classList.contains("active")) {
          addHotspotsForImage(slide);
        }
      });
    }
  });
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