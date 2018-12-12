window.onload = setSplitBoxHeight();

function setSplitBoxHeight() {
  let imageBoxArray = document.querySelectorAll(".split-box__image").forEach(item => {item.addEventListener('load', function() {
    this.parentElement.parentElement.style.height = `${this.naturalHeight}px`;
    })
  });
}

