// Photos Filter by Tags
jQuery(document).ready(function ($) {
  // Filter images based on selected tag
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

// Photos Slider @single-project page
document.addEventListener("DOMContentLoaded", function () {
  const carouselTrack = document.querySelector(".carousel-track");
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const slideWidth = slides[0].getBoundingClientRect().width;
  let currentIndex = 0;

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
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

  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);

  // Show the first slide initially
  goToSlide(0);
});

// Projects grid layout change
document.addEventListener("DOMContentLoaded", function () {
  const threeColumnIcon = document.querySelector(".three-column");
  const twoColumnIcon = document.querySelector(".two-column");
  const projectsContainer = document.querySelector(".projects-container");
  const projectImage = document.querySelectorAll(".wp-post-image");

  threeColumnIcon.addEventListener("click", function () {
    projectsContainer.classList.remove("grid-two-column");
    projectsContainer.classList.add("grid-three-column");
    projectImage.forEach((image) => {
      image.style.width = "30rem";
      image.style.gap = "2rem";
    });
  });

  twoColumnIcon.addEventListener("click", function () {
    projectsContainer.classList.remove("grid-three-column");
    projectsContainer.classList.add("grid-two-column");
    projectImage.forEach((image) => {
      image.style.width = "45rem";
    });
  });
});
// Hotspot dot
document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".carousel");
  carousels.forEach(function (carousel) {
    carousel.addEventListener("afterChange", function (event) {
      const currentSlide = event.detail.currentSlide;
      const productInfos = document.querySelectorAll(
        ".image-hotspots-container .product-info"
      );
      const productDots = document.querySelectorAll(
        ".image-hotspots-container .product-dot"
      );

      // Remove active class from all product info and dots
      productInfos.forEach(function (productInfo) {
        productInfo.classList.remove("active");
      });
      productDots.forEach(function (productDot) {
        productDot.classList.remove("active");
      });

      // Add active class to product info and dot corresponding to the current slide
      const currentProductInfo = document
        .querySelectorAll(".image-hotspots-container")
        [currentSlide].querySelector(".product-info");
      const currentProductDot = document
        .querySelectorAll(".image-hotspots-container")
        [currentSlide].querySelector(".product-dot");
      currentProductInfo.classList.add("active");
      currentProductDot.classList.add("active");
    });

    // When a product dot is clicked
    const productDots = carousel.querySelectorAll(".product-dot");
    productDots.forEach(function (productDot) {
      productDot.addEventListener("click", function () {
        const dotIndex = Array.from(this.parentNode.children).indexOf(this);

        // Go to the corresponding slide in the carousel
        carousel.slick.slickGoTo(dotIndex);
      });
    });
  });
});

// Fullscreen
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const slides = document.querySelectorAll(".carousel-slide");

  const fullscreenBtn = document.createElement("button");
  fullscreenBtn.classList.add("fullscreen-btn");
  fullscreenBtn.innerHTML = "Fullscreen";
  let isFullscreen = false;

  function toggleFullScreen(image) {
    if (!document.fullscreenElement) {
      image.requestFullscreen();
      isFullscreen = true;
      console.log("Entered fullscreen mode");
    }
  }

  function exitFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullscreen = false;
      console.log("Exited fullscreen mode");
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
  } else {
    console.log("Arrow expand button not found");
  }
});
