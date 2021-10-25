const dateContainer = document.getElementById("date");
const timeContainer = document.getElementById("time");

const WIDTH = 88;
const HEIGHT = 16;
const OFFSET = HEIGHT / 2;
const CHARACTER_HEIGHT = 2 * HEIGHT + 2 * WIDTH;
const CHARACTER_WIDTH = 2 * HEIGHT + WIDTH;
const SKEW = -8;

const DIGITS = {
  "": [0, 0, 0, 0, 0, 0, 0],
  "-": [0, 0, 0, 0, 0, 0, 1],
  0: [1, 1, 1, 1, 1, 1, 0],
  1: [0, 1, 1, 0, 0, 0, 0],
  2: [1, 1, 0, 1, 1, 0, 1],
  3: [1, 1, 1, 1, 0, 0, 1],
  4: [0, 1, 1, 0, 0, 1, 1],
  5: [1, 0, 1, 1, 0, 1, 1],
  6: [1, 0, 1, 1, 1, 1, 1],
  7: [1, 1, 1, 0, 0, 0, 0],
  8: [1, 1, 1, 1, 1, 1, 1],
  9: [1, 1, 1, 1, 0, 1, 1]
};

function createCharacter() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  function createSegment(segmentX, segmentY, rotate) {
    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    function createPoint(x, y) {
      const point = svg.createSVGPoint();
      point.x = segmentX + x;
      point.y = segmentY + y;
      polygon.points.appendItem(point);
    }

    createPoint(0, HEIGHT / 2);
    createPoint(OFFSET, 0);
    createPoint(WIDTH - OFFSET, 0);
    createPoint(WIDTH, HEIGHT / 2);
    createPoint(WIDTH - OFFSET, HEIGHT);
    createPoint(OFFSET, HEIGHT);

    if (rotate) {
      polygon.setAttribute("transform", `rotate(90, ${segmentX}, ${segmentY})`);
    }

    svg.appendChild(polygon);
  }

  createSegment(OFFSET, 0); // A
  createSegment(OFFSET + OFFSET + WIDTH, OFFSET, true); // B
  createSegment(OFFSET + OFFSET + WIDTH, WIDTH + OFFSET, true); // C
  createSegment(OFFSET, WIDTH + WIDTH); // D
  createSegment(OFFSET + OFFSET, WIDTH + OFFSET, true); // E
  createSegment(HEIGHT, OFFSET, true); // F
  createSegment(OFFSET, WIDTH); // G

  svg.setAttribute("height", "10%");
  svg.setAttribute("width", "9%");
  svg.setAttribute("viewBox", `0 0 ${CHARACTER_WIDTH} ${CHARACTER_HEIGHT}`);

  return svg;
}

function createCircle(x, y, svg) {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", HEIGHT / 2);

  svg.appendChild(circle);
}

function createColon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  createCircle(HEIGHT, CHARACTER_HEIGHT / 2 - WIDTH / 2, svg);
  createCircle(HEIGHT, CHARACTER_HEIGHT / 2 + WIDTH / 2, svg);

  svg.setAttribute("height", "10%");
  svg.setAttribute("width", "3%");
  svg.setAttribute("viewBox", `0 0 ${CHARACTER_WIDTH / 3} ${CHARACTER_HEIGHT}`);

  return svg;
}

function createDecimalPlace() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  createCircle(HEIGHT, CHARACTER_HEIGHT - HEIGHT * 1.5, svg);

  svg.setAttribute("height", "5%");
  svg.setAttribute("width", "3%");
  svg.setAttribute("viewBox", `0 0 ${CHARACTER_WIDTH / 3} ${CHARACTER_HEIGHT}`);

  return svg;
}

function createSpacer() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute("height", 0);
  svg.setAttribute("width", 0);

  return svg;
}

function setupCharacter(character, digit) {
  var bits = DIGITS[digit];
  if (!bits) {
    return;
  }
  for (i = 0; i < bits.length; ++i) {
    if (bits[i] === 0) {
      character.children[i].classList.add("off");
    } else {
      character.children[i].classList.remove("off");
    }
  }
}

const string = "8888-88-88T88:88:88.888";

const characters = [];
var sawSpacer = false;
for (var i = 0; i < string.length; ++i) {
  const rawCharacter = string[i];
  const bits = DIGITS[rawCharacter];
  var displayCharacter;
  if (bits) {
    displayCharacter = createCharacter();
  } else if (rawCharacter === ":") {
    displayCharacter = createColon();
  } else if (rawCharacter === ".") {
    displayCharacter = createDecimalPlace();
  } else if (rawCharacter === "T") {
    displayCharacter = createSpacer();
  }
  if (!sawSpacer) {
    dateContainer.appendChild(displayCharacter);
  } else {
    timeContainer.appendChild(displayCharacter);
  }
  if (rawCharacter === "T") {
    sawSpacer = true;
  }
  characters.push(displayCharacter);
}

function setString(string) {
  for (var i = 0; i < characters.length; ++i) {
    setupCharacter(characters[i], string[i]);
  }
}

function update() {
  const now = new Date();
  const offset = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
  const string = offset.toISOString();
  setString(string);
  setTimeout(update, 100);
}

update();
