  $(function () {
    const $slides = $(".product-slide");
    const $dots = $("#dotNav div");
    const $carousel = $("#productCarousel");
    const $container = $("#carouselContainer");
    const $price = $("#productPrice");
    const $flavor = $("#productFlavor");
    const $sizeBtns = $("button[data-size='true']");
    const $buyBtn = $("#buyNowBtn");
    const $body = $("#pageBody");

    let index = 0;

    const products = [
      {
        color: "text-blue-600",
        bgClass: "from-blue-400 via-blue-500 to-blue-600"
      },
      {
        color: "text-purple-600",
        bgClass: "from-purple-500 via-purple-600 to-purple-700"
      },
      {
        color: "text-red-600",
        bgClass: "from-red-400 via-red-500 to-red-600"
      }
    ];

    function updateCarousel(i) {
      $slides.each((s, el) => {
        const $el = $(el);
        const active = i === s;
        $el.css({
          opacity: active ? 1 : 0,
          pointerEvents: active ? "auto" : "none",
          zIndex: active ? 10 : 1,
          transform: active ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)"
        });
      });

      $dots.each((d, dot) => {
        const $dot = $(dot);
        $dot
          .toggleClass("bg-white", d === i)
          .toggleClass("bg-white/50", d !== i)
          .toggleClass("scale-125", d === i);
      });

      const product = products[i];
      $price.text(product.price);
      $flavor.text(product.flavor);

      const colorClasses = ["text-orange-600", "text-teal-600", "text-purple-600", "text-blue-600", "text-red-600"];

      $sizeBtns.each((_, btn) => {
        const $btn = $(btn);
        colorClasses.forEach(cls => $btn.removeClass(cls));
        if ($btn.hasClass("bg-white")) {
          $btn.addClass(product.color);
        }
      });

      colorClasses.forEach(cls => $buyBtn.removeClass(cls));
      $buyBtn.addClass(product.color);

      const bgClasses = product.bgClass.split(" ");
      const preserved = $body.attr("class").split(" ").filter(cls => !cls.startsWith("from-") && !cls.startsWith("via-") && !cls.startsWith("to-"));
      $body.attr("class", [...preserved, "bg-gradient-to-br", ...bgClasses].join(" "));
    }

    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    const threshold = 50;

    $container.on("mousedown", function (e) {
      isDragging = true;
      startY = currentY = e.clientY;
      $container.css("cursor", "grabbing");
      e.preventDefault();
    });

    $(document).on("mousemove", function (e) {
      if (!isDragging) return;
      currentY = e.clientY;
      const deltaY = currentY - startY;
      const scale = 1 - Math.min(1, Math.abs(deltaY / threshold)) * 0.05;
      $carousel.css("transform", `translateY(${deltaY * 0.1}px) scale(${scale})`);
      e.preventDefault();
    });

    $(document).on("mouseup", function () {
      if (!isDragging) return;
      isDragging = false;
      $container.css("cursor", "grab");
      $carousel.css("transform", "translateY(0) scale(1)");

      const deltaY = currentY - startY;
      if (Math.abs(deltaY) > threshold) {
        index = deltaY > 0 ? (index + 1) % $slides.length : (index - 1 + $slides.length) % $slides.length;
        updateCarousel(index);
      }
    });

    // Dots click handler
    $dots.on("click", function () {
      index = Number($(this).data("index"));
      updateCarousel(index);
    });

    // Initialize
    updateCarousel(index);
  });