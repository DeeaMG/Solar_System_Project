const canvas = document.getElementById("circleCanvas");
const context = canvas.getContext("2d");

class BlackHole {
  #radius;
  #mass;

  constructor(name) {
    this.name = name;
    this.angularSpeed = 0.001;
    this.angle = 0;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
  }

  setRadius(newRadius) {
    this.#radius = newRadius;
  }

  getRadius() {
    return this.#radius;
  }

  setMass(newMass) {
    this.#mass = newMass;
  }

  getMass() {
    return this.#mass;
  }

  createBlackHole() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(this.x, this.y, this.#radius, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
    context.closePath();

    context.font = "bold 40px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.name, this.x, this.y);
    requestAnimationFrame(this.createBlackHole.bind(this));
  }
}

class Star {
  #radius;
  #mass;

  constructor(name, speed, distanceBlackHole) {
    this.name = name;
    this.speedOwnAxis = speed;
    this.distanceFromBlackHole = distanceBlackHole;
    this.color = "yellow";
    this.type = "Yellow Dwarf Star";
    this.angleOwnAxis = 0;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    this.createStar();
  }

  setRadius(newRadius) {
    this.#radius = newRadius;
  }

  getRadius() {
    return this.#radius;
  }

  setMass(newMass) {
    this.#mass = newMass;
  }

  getMass() {
    return this.#mass;
  }

  createStar() {
    context.beginPath();
    context.arc(this.x, this.y, this.#radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();

    context.font = "bold 30px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.name, this.x, this.y);

    const dotX = this.x + Math.cos(this.angleOwnAxis) * (this.#radius - 15);
    const dotY = this.y + Math.sin(this.angleOwnAxis) * (this.#radius - 15);

    context.beginPath();
    context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
  }

  rotateAroundOwnAxis() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.angleOwnAxis += this.speedOwnAxis;
    const angle = this.angleOwnAxis + (this.distanceFromBlackHole / 100) * (2 * Math.PI);
    this.x = canvas.width / 2 + Math.cos(angle) * this.distanceFromBlackHole;
    this.y = canvas.height / 2 + Math.sin(angle) * this.distanceFromBlackHole;
    requestAnimationFrame(this.rotateAroundOwnAxis.bind(this));
  }
}

class Planet {
  #radius;
  #mass;

  constructor(name, color, speed, speedAroundSun, distanceSun, trajectory, sun) {
    this.name = name;
    this.color = color;
    this.speedOwnAxis = speed;
    this.speedSunAxis = speedAroundSun;
    this.distanceFromSun = distanceSun;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.angleOwnAxis = 0;
    this.trajectory = trajectory;
    this.sun = sun;
  }

  setRadius(newRadius) {
    this.#radius = newRadius;
  }

  getRadius() {
    return this.#radius;
  }

  setMass(newMass) {
    this.#mass = newMass;
  }

  getMass() {
    return this.#mass;
  }

  createPlanet() {
    context.beginPath();
    context.arc(this.x, this.y, this.#radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();

    context.font = "bold 30px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.name, this.x, this.y);

    // Calculate the position of the dot for self-rotation around its own axis
    const dotX = this.x + Math.cos(this.angleOwnAxis) * this.#radius;
    const dotY = this.y + Math.sin(this.angleOwnAxis) * this.#radius;

    // Draw the dot for self-rotation
    context.beginPath();
    context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
  }

  rotateAroundAxis() {
    this.angleOwnAxis += this.speedOwnAxis * 0.01;
    this.createPlanet();
    requestAnimationFrame(this.rotateAroundAxis.bind(this));
  }

  rotateAroundSun() {
    const angle = this.angleOwnAxis + this.distanceFromSun * (2 * Math.PI);
    this.x = this.sun.x + Math.cos(angle) * this.distanceFromSun;
    this.y = this.sun.y + Math.sin(angle) * this.distanceFromSun;
    this.createPlanet();
    requestAnimationFrame(this.rotateAroundSun.bind(this));
  }
}

class SolarSystem {
  constructor() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const blackHoleRadius = 500;

    const blackhole = new BlackHole("The Blackest Black Hole");
    blackhole.setRadius(300);
    blackhole.setMass(100000);

    this.blackHole = blackhole; // Correctly set blackhole to this.blackHole
    this.sun = new Star("The Sun", 0.01, 700);
    this.sun.setRadius(200);
    this.sun.setMass(1000);

    this.planets = [
      new Planet("Mercury", "#8a4317", 0.002, 0.001, 300, 10, this.sun),
      new Planet("Venus", "#fa7705", 0.004, 0.002, 500, 20, this.sun),
      new Planet("Earth", "#f25b29", 0.006, 0.003, 700, 30, this.sun),
      new Planet("Mars", "#f25b29", 0.008, 0.004, 900, 20, this.sun),
      new Planet("Jupiter", "#3263a8", 0.003, 0.005, 1100, 30, this.sun),
      new Planet("Saturn", "#e8b941", 0.005, 0.006, 1300, 20, this.sun),
      new Planet("Uranus", "#329ba8", 0.007, 0.007, 1500, 30, this.sun),
      new Planet("Neptune", "#3263a8", 0.009, 0.008, 1700, 20, this.sun),
    ];

    for (let i = 0; i < this.planets.length; i++) {
      this.planets[i].setRadius(35);
      this.planets[i].setMass(100);
    }

    this.sun.createStar();
    this.sun.rotateAroundOwnAxis();
    this.rotateAroundStar(this.sun, centerX, centerY, blackHoleRadius);
  }

  rotateAroundStar(star, centerX, centerY, radius) {
    const blackHole = this.blackHole;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      blackHole.createBlackHole();
      const angle = star.angleOwnAxis + (star.distanceFromBlackHole / radius) * (2 * Math.PI);
      star.x = centerX + Math.cos(angle) * star.distanceFromBlackHole;
      star.y = centerY + Math.sin(angle) * star.distanceFromBlackHole;
      star.createStar();
      requestAnimationFrame(animate);
    };

    animate();
  }

  rotatePlanets() {
    const blackHole = this.blackHole;
    const sun = this.sun;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      blackHole.createBlackHole();
      sun.createStar();
      for (let i = 0; i < this.planets.length; i++) {
        const planet = this.planets[i];
        planet.createPlanet();
        planet.rotateAroundAxis();
        planet.rotateAroundSun();
      }
      requestAnimationFrame(animate);
    };

    animate();
  }
}

const solarSystem = new SolarSystem();
solarSystem.rotatePlanets();
