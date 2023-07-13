const canvas = document.getElementById("circleCanvas");
const context = canvas.getContext("2d");

function BlackHole(radius, mass, name) {
  this._radius = radius;
  this._mass = mass;
  this._name = name;
  this.angularSpeed = 0.001;
  this.angle = 0;
}

BlackHole.prototype.createBlackHole = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, this._radius, 0, 2 * Math.PI);
  context.fillStyle = "black";
  context.fill();
  context.closePath();

  context.font = "bold 40px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(this._name, canvas.width / 2, canvas.height / 2);
};

function Star(radius, mass, name, speed, distanceBlackHole) {
  this._radius = radius;
  this._mass = mass;
  this._name = name;
  this._speedOwnAxis = speed;
  this._distanceFromBlackHole = distanceBlackHole;
  this.color = "yellow";
  this.type = "Yellow Dwarf Star";
  this.angleOwnAxis = 0;
}

Star.prototype.createStar = function () {
  context.beginPath();
  context.arc(this.x, this.y, this._radius, 0, 2 * Math.PI);
  context.fillStyle = this.color;
  context.fill();
  context.closePath();

  context.font = "bold 30px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(this._name, this.x, this.y);

  const dotX = this.x + Math.cos(this.angleOwnAxis) * (this._radius - 15);
  const dotY = this.y + Math.sin(this.angleOwnAxis) * (this._radius - 15);

  context.beginPath();
  context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
  context.fillStyle = "black";
  context.fill();
  context.closePath();
};

Star.prototype.rotateAroundOwnAxis = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  this.angleOwnAxis += this._speedOwnAxis;
  const distanceFromBlackHole = this._distanceFromBlackHole;
  const angle = this.angleOwnAxis + (distanceFromBlackHole / 100) * (2 * Math.PI);
  this.x = canvas.width / 2 + Math.cos(angle) * distanceFromBlackHole;
  this.y = canvas.height / 2 + Math.sin(angle) * distanceFromBlackHole;
  this.createStar();
  requestAnimationFrame(this.rotateAroundOwnAxis.bind(this));
};

// Planet declaration
function Planet(radius, mass, name, color, speed, speedAroundSun, distanceSun) {
  this._radius = radius;
  this._mass = mass;
  this._name = name;
  this._color = color;
  this._speedOwnAxis = speed;
  this._speedSunAxis = speedAroundSun;
  this._distanceFromSun = distanceSun;
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  this.angleOwnAxis = 0;
}

Planet.prototype.createPlanet = function () {
  context.beginPath();
  context.arc(this.x, this.y, this._radius, 0, 2 * Math.PI);
  context.fillStyle = this._color;
  context.fill();
  context.closePath();

  context.font = "bold 30px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(this._name, this.x, this.y);

  // Calculate the position of the dot for self-rotation around its own axis
  const dotX = this.x + Math.cos(this.angleOwnAxis) * this._radius;
  const dotY = this.y + Math.sin(this.angleOwnAxis) * this._radius;

  // Draw the dot for self-rotation
  context.beginPath();
  context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
  context.fillStyle = "black";
  context.fill();
  context.closePath();
};

Planet.prototype.rotateAroundAxis = function () {
  this.angleOwnAxis += this._speedOwnAxis * 0.01;
  this.createPlanet();
  requestAnimationFrame(this.rotateAroundAxis.bind(this));
};

Planet.prototype.rotateAroundSun = function () {
  const sun = solarSystem.sun;
  const distanceFromSun = this._distanceFromSun;
  const angle = this.angleOwnAxis + distanceFromSun * (2 * Math.PI);
  this.x = sun.x + Math.cos(angle) * distanceFromSun;
  this.y = sun.y + Math.sin(angle) * distanceFromSun;
  this.createPlanet();
  requestAnimationFrame(this.rotateAroundSun.bind(this));
};

// Planet entity
function PlanetEntity(radius, mass, name, color, speed, speedAroundSun, distanceSun, trajectory) {
  Star.call(this, radius, mass, name, speed, distanceSun);
  this._color = color;
  this._speedOwnAxis = speed;
  this._speedSunAxis = speedAroundSun;
  this._distanceFromSun = distanceSun;
  this._trajectory = trajectory;
}

PlanetEntity.prototype = Object.create(Planet.prototype);
PlanetEntity.prototype.constructor = PlanetEntity;

function SolarSystem() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const blackHoleRadius = 500;

  this.blackHole = new BlackHole(blackHoleRadius, 1989e30 * 4.3, "Sagittarius A*");
  this.sun = new Star(200, 1989e30, "Sun", 0.003, blackHoleRadius + 600);

  this.planets = [
    new PlanetEntity(40, 3.30104 * Math.pow(10, 23), "Mercury", "#8a4317", 0.002, 0.001, 300, 10),
    new PlanetEntity(60, 3.30104 * Math.pow(10, 23), "Venus", "#fa7705", 0.004, 0.002, 500, 20),
    new PlanetEntity(80, 3.30104 * Math.pow(10, 23), "Earth", "#f25b29", 0.006, 0.003, 700, 30),
    new PlanetEntity(30, 3.30104 * Math.pow(10, 23), "Mars", "#f25b29", 0.008, 0.004, 900, 20),
    new PlanetEntity(100, 3.30104 * Math.pow(10, 23), "Jupiter", "#3263a8", 0.003, 0.005, 1100, 30),
    new PlanetEntity(80, 3.30104 * Math.pow(10, 23), "Saturn", "#e8b941", 0.005, 0.006, 1300, 20),
    new PlanetEntity(80, 3.30104 * Math.pow(10, 23), "Uranus", "#329ba8", 0.007, 0.007, 1500, 30),
    new PlanetEntity(80, 3.30104 * Math.pow(10, 23), "Neptune", "#3263a8", 0.009, 0.008, 1700, 20),
  ];

  this.sun.createStar();
  this.sun.rotateAroundOwnAxis();
  this.rotateAroundStar(this.sun, centerX, centerY, blackHoleRadius);
}

SolarSystem.prototype.rotateAroundStar = function (star, centerX, centerY, radius) {
  const blackHole = this.blackHole;

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    blackHole.createBlackHole();
    const angle = star.angleOwnAxis + (star._distanceFromBlackHole / radius) * (2 * Math.PI);
    star.x = centerX + Math.cos(angle) * star._distanceFromBlackHole;
    star.y = centerY + Math.sin(angle) * star._distanceFromBlackHole;
    star.createStar();
    requestAnimationFrame(animate);
  }

  animate();
};

SolarSystem.prototype.rotatePlanets = function () {
  const blackHole = this.blackHole; // Reference to the blackHole object
  const sun = this.sun; // Reference to the sun object

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    blackHole.createBlackHole(); // Access blackHole through the SolarSystem object
    sun.createStar(); // Access sun through the SolarSystem object
    for (let i = 0; i < solarSystem.planets.length; i++) {
      const planet = solarSystem.planets[i];
      planet.createPlanet();
      planet.rotateAroundAxis();
      planet.rotateAroundSun();
    }
    requestAnimationFrame(animate);
  }

  animate();
};

const solarSystem = new SolarSystem();
solarSystem.rotatePlanets();
