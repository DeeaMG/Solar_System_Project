class Entity {
  constructor(
    public name: string,
    private radius: number,
    private mass: number,
    protected canvas: HTMLCanvasElement,
    protected context: CanvasRenderingContext2D,
    protected angleOwnAxis: number,
    private x: number = canvas.width / 2,
    private y: number = canvas.height / 2
  ) {}

  rotateAroundOwnAxis() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Calculate dotX and dotY
    const dotX = this.x + Math.cos(this.angleOwnAxis) * (this.getRadius() - 15);
    const dotY = this.y + Math.sin(this.angleOwnAxis) * (this.getRadius() - 15);

    this.context.beginPath();
    this.context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();

    requestAnimationFrame(this.rotateAroundOwnAxis.bind(this));
  }

  setRadius(newRadius: number) {
    this.radius = newRadius;
  }

  getRadius() {
    return this.radius;
  }

  setMass(newMass: number) {
    this.mass = newMass;
  }

  getMass() {
    return this.mass;
  }

  get getX() {
    return this.x;
  }

  get getY() {
    return this.y;
  }

  set setX(newX: number) {
    this.x = newX;
  }

  set setY(newY: number) {
    this.y = newY;
  }
}

class BlackHole extends Entity {
  angularSpeed: number;
  angle: number;

  constructor(name: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    super(name, 0, 0, canvas, context, 0);
    this.angularSpeed = 0.001;
    this.angle = 0;
  }

  createBlackHole() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.arc(this.getX, this.getY, this.getRadius(), 0, 2 * Math.PI);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();

    this.context.font = "bold 40px Arial";
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.name, this.getX, this.getY);
    requestAnimationFrame(this.createBlackHole.bind(this));
  }
}

class Star extends Entity {
  name: string;
  speedOwnAxis: number;
  distanceFromBlackHole: number;
  color: string;
  type: string;
  angleOwnAxis: number;

  constructor(
    name: string,
    speed: number,
    distanceBlackHole: number,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    super(name, 0, 0, canvas, context, 0);
    this.name = name;
    this.speedOwnAxis = speed;
    this.distanceFromBlackHole = distanceBlackHole;
    this.color = "yellow";
    this.type = "Yellow Dwarf Star";
    this.angleOwnAxis = 0;
  }

  createStar() {
    this.context.beginPath();
    this.context.arc(this.getX, this.getY, this.getRadius(), 0, 2 * Math.PI);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.closePath();

    this.context.font = "bold 30px Arial";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.name, this.getX, this.getY);

    const dotX = this.getX + Math.cos(this.angleOwnAxis) * (this.getRadius() - 15);
    const dotY = this.getY + Math.sin(this.angleOwnAxis) * (this.getRadius() - 15);

    this.context.beginPath();
    this.context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();
  }

  rotateAroundOwnAxis() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.angleOwnAxis += this.speedOwnAxis;
    const angle = this.angleOwnAxis + (this.distanceFromBlackHole / 100) * (2 * Math.PI);
    this.setX = this.canvas.width / 2 + Math.cos(angle) * this.distanceFromBlackHole;
    this.setY = this.canvas.height / 2 + Math.sin(angle) * this.distanceFromBlackHole;
    this.createStar();
    requestAnimationFrame(this.rotateAroundOwnAxis.bind(this));
  }
}

class Planet extends Entity {
  name: string;
  color: string;
  speedOwnAxis: number;
  speedSunAxis: number;
  distanceFromSun: number;
  angleOwnAxis: number;
  trajectory: number;
  sun: Star;

  constructor(
    name: string,
    color: string,
    speed: number,
    speedAroundSun: number,
    distanceSun: number,
    trajectory: number,
    sun: Star,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    super(name, 0, 0, canvas, context, 0);
    this.name = name;
    this.color = color;
    this.speedOwnAxis = speed;
    this.speedSunAxis = speedAroundSun;
    this.distanceFromSun = distanceSun;
    this.angleOwnAxis = 0;
    this.trajectory = trajectory;
    this.sun = sun;
  }

  createPlanet() {
    this.context.beginPath();
    this.context.arc(this.getX, this.getY, this.getRadius(), 0, 2 * Math.PI);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.closePath();

    this.context.font = "bold 30px Arial";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.name, this.getX, this.getY);

    const dotX = this.getX + Math.cos(this.angleOwnAxis) * this.getRadius();
    const dotY = this.getY + Math.sin(this.angleOwnAxis) * this.getRadius();

    this.context.beginPath();
    this.context.arc(dotX, dotY, 3, 0, 2 * Math.PI);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.closePath();
  }

  rotateAroundAxis() {
    this.angleOwnAxis += this.speedOwnAxis * 0.01;
    this.createPlanet();
    requestAnimationFrame(this.rotateAroundAxis.bind(this));
  }

  rotateAroundSun() {
    const angle = this.angleOwnAxis + this.distanceFromSun * (2 * Math.PI);
    this.setX = this.sun.getX + Math.cos(angle) * this.distanceFromSun;
    this.setY = this.sun.getY + Math.sin(angle) * this.distanceFromSun;
    this.createPlanet();
    requestAnimationFrame(this.rotateAroundSun.bind(this));
  }
}

class SolarSystem {
  blackHole: BlackHole;
  sun: Star;
  planets: Planet[];

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const blackHoleRadius = 500;

    const blackhole = new BlackHole("The Blackest Black Hole", canvas, context);
    blackhole.setRadius(300);
    blackhole.setMass(100000);

    this.blackHole = blackhole;
    this.sun = new Star("The Sun", 0.01, 700, canvas, context);
    this.sun.setRadius(200);
    this.sun.setMass(1000);

    this.planets = [
      new Planet("Mercury", "#8a4317", 0.002, 0.001, 300, 10, this.sun, canvas, context),
      new Planet("Venus", "#fa7705", 0.004, 0.002, 500, 20, this.sun, canvas, context),
      new Planet("Earth", "#f25b29", 0.006, 0.003, 700, 30, this.sun, canvas, context),
      new Planet("Mars", "#f25b29", 0.008, 0.004, 900, 20, this.sun, canvas, context),
      new Planet("Jupiter", "#3263a8", 0.003, 0.005, 1100, 30, this.sun, canvas, context),
      new Planet("Saturn", "#e8b941", 0.005, 0.006, 1300, 20, this.sun, canvas, context),
      new Planet("Uranus", "#329ba8", 0.007, 0.007, 1500, 30, this.sun, canvas, context),
      new Planet("Neptune", "#3263a8", 0.009, 0.008, 1700, 20, this.sun, canvas, context),
    ];

    for (let i = 0; i < this.planets.length; i++) {
      this.planets[i].setRadius(35);
      this.planets[i].setMass(100);
    }

    this.sun.createStar();
    this.sun.rotateAroundOwnAxis();
    this.rotateAroundStar(this.sun, centerX, centerY, blackHoleRadius);
  }

  rotateAroundStar(star: Star, centerX: number, centerY: number, radius: number) {
    const blackHole = this.blackHole;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      blackHole.createBlackHole();
      const angle = star.angleOwnAxis + (star.distanceFromBlackHole / radius) * (2 * Math.PI);
      star.setX = centerX + Math.cos(angle) * star.distanceFromBlackHole;
      star.setY = centerY + Math.sin(angle) * star.distanceFromBlackHole;
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

const canvas = document.getElementById("circleCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const solarSystem = new SolarSystem(canvas, context);
solarSystem.rotatePlanets();
