const cols = document.querySelectorAll('.col');

function copyToClickboard(text) {
  return navigator.clipboard.writeText(text);
}

function generateRandomColor() {
  const hexCodes = '0123456789ABCDEF';
  const result = hexCodes.split('').sort(() => Math.random() - 0.5);
  return `#${result.slice(0, 6).join('')}`;
}

window.addEventListener('keypress', (e) => {
  e.preventDefault();
  if (e.code === 'Space') {
    setRandomColors();
  }
});

document.addEventListener('click', (e) => {
  const type = e.target.dataset.type;
  if (type === 'lock') {
    const node = e.target.tagName.toLowerCase() === 'i' ? event.target : event.target.children[0];
    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
  } else if (type === 'copy') {
    copyToClickboard(e.target.textContent);
  }
});

function setRandomColors(isInitial) {
  const allColors = isInitial ? getColorsFromHash() : [];
  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock');
    const colText = col.querySelector('h2');
    const button = col.querySelector('button');

    if (isLocked) {
      allColors.push(colText.textContent);
      return;
    }

    const color = isInitial
      ? allColors[index]
        ? allColors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      allColors.push(color);
    }

    colText.innerText = color;
    col.style.backgroundColor = color;
    setTextColor(colText, color);
    setTextColor(button, color);
  });

  updateColorsHash(allColors);
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? 'black' : 'white';
}

function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join('-');
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map((elem) => {
        return `#${elem}`;
      });
  }
  return [];
}
console.log(getColorsFromHash());
setRandomColors(true);
