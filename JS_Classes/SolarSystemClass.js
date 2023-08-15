class Entity {
  #radius;
  #mass;

  constructor(name, canvas, context) {
    this.name = name;
    this.canvas = canvas;
    this.context = context;
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

  rotateAroundOwnAxis() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.angleOwnAxis += this.speedOwnAxis;
    const dotX = this.x + Math.cos(this.angleOwnAxis) * (this.getRadius() - 15);
    const dotY = this.y + Math.sin(this.angleOwnAxis) * (this.getRadius() - 15);

    this.context.beginPath();
    this.context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();

    requestAnimationFrame(this.rotateAroundOwnAxis.bind(this));
  }
}

class BlackHole extends Entity {
  constructor(name, canvas, context) {
    super(name, canvas, context);
    this.angularSpeed = 0.001;
    this.angle = 0;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;

    this.createBlackHole();
  }

  createBlackHole() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.getRadius(), 0, 2 * Math.PI);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();

    this.context.font = "bold 40px Arial";
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.name, this.x, this.y);
    requestAnimationFrame(this.createBlackHole.bind(this));
  }
}

class Star extends Entity {
  constructor(name, speed, distanceBlackHole, canvas, context) {
    super(name, canvas, context);
    this.speedOwnAxis = speed;
    this.distanceFromBlackHole = distanceBlackHole;
    this.color = "yellow";
    this.type = "Yellow Dwarf Star";
    this.angleOwnAxis = 0;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;

    this.createStar();
  }

  createStar() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.getRadius(), 0, 2 * Math.PI);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.closePath();

    this.context.font = "bold 30px Arial";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.name, this.x, this.y);

    const dotX = this.x + Math.cos(this.angleOwnAxis) * (this.getRadius() - 15);
    const dotY = this.y + Math.sin(this.angleOwnAxis) * (this.getRadius() - 15);

    this.context.beginPath();
    this.context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();
  }
}

class Planet extends Entity {
  constructor(name, color, speed, speedAroundSun, distanceSun, trajectory, sun, canvas, context) {
    super(name, canvas, context);
    this.color = color;
    this.speedOwnAxis = speed;
    this.speedSunAxis = speedAroundSun;
    this.distanceFromSun = distanceSun;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.angleOwnAxis = 0;
    this.trajectory = trajectory;
    this.sun = sun;

    this.createPlanet();
  }

  createPlanet() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.getRadius(), 0, 2 * Math.PI);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.closePath();

    this.context.font = "bold 30px Arial";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.name, this.x, this.y);

    // Calculate the position of the dot for self-rotation around its own axis
    const dotX = this.x + Math.cos(this.angleOwnAxis) * this.getRadius();
    const dotY = this.y + Math.sin(this.angleOwnAxis) * this.getRadius();

    // Draw the dot for self-rotation
    this.context.beginPath();
    this.context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();
  }

  rotateAroundSun() {
    const angle = this.angleOwnAxis + this.distanceFromSun * (2 * Math.PI);
    this.x = this.sun.x + Math.cos(angle) * this.distanceFromSun;
    this.y = this.sun.y + Math.sin(angle) * this.distanceFromSun;
    requestAnimationFrame(this.rotateAroundSun.bind(this));
  }
}

class SolarSystem {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const blackHoleRadius = 500;

    const blackhole = new BlackHole("The Blackest Black Hole", this.canvas, this.context);
    blackhole.setRadius(300);
    blackhole.setMass(100000);

    this.blackHole = blackhole; // Correctly set blackhole to this.blackHole
    this.sun = new Star("The Sun", 0.01, 700, this.canvas, this.context);
    this.sun.setRadius(200);
    this.sun.setMass(1000);

    this.planets = [
      new Planet("Mercury", "#8a4317", 0.002, 0.001, 300, 10, this.sun, this.canvas, this.context),
      new Planet("Venus", "#fa7705", 0.004, 0.002, 500, 20, this.sun, this.canvas, this.context),
      new Planet("Earth", "#f25b29", 0.006, 0.003, 700, 30, this.sun, this.canvas, this.context),
      new Planet("Mars", "#f25b29", 0.008, 0.004, 900, 20, this.sun, this.canvas, this.context),
      new Planet("Jupiter", "#3263a8", 0.003, 0.005, 1100, 30, this.sun, this.canvas, this.context),
      new Planet("Saturn", "#e8b941", 0.005, 0.006, 1300, 20, this.sun, this.canvas, this.context),
      new Planet("Uranus", "#329ba8", 0.007, 0.007, 1500, 30, this.sun, this.canvas, this.context),
      new Planet("Neptune", "#3263a8", 0.009, 0.008, 1700, 20, this.sun, this.canvas, this.context),
    ];

    for (let i = 0; i < this.planets.length; i++) {
      this.planets[i].setRadius(35);
      this.planets[i].setMass(100);
    }

    this.sun.createStar();
    this.sun.rotateAroundOwnAxis();
    this.rotateAroundStar(this.sun, centerX, centerY, blackHoleRadius, this.context, this.canvas);
  }

  rotateAroundStar(star, centerX, centerY, radius, context, canvas) {
    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const angle = star.angleOwnAxis + (star.distanceFromBlackHole / radius) * (2 * Math.PI);
      star.x = centerX + Math.cos(angle) * star.distanceFromBlackHole;
      star.y = centerY + Math.sin(angle) * star.distanceFromBlackHole;
      requestAnimationFrame(animate);
    };

    animate();
  }

  rotatePlanets() {
    const animate = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = 0; i < this.planets.length; i++) {
        const planet = this.planets[i];
        planet.rotateAroundOwnAxis();
        planet.rotateAroundSun();
      }
      requestAnimationFrame(animate);
    };

    animate();
  }
}

const canvas = document.getElementById("circleCanvas");
const context = canvas.getContext("2d");

const solarSystem = new SolarSystem(canvas, context);
solarSystem.rotatePlanets();
