// ========================================
// SMART AGARBATTI DRYER SIMULATION
// ========================================


// Simulation state

let simulationRunning = false;

let cloudyWeather = false;

let timer = null;


// Sensor values

let temperature = 30;

let humidity = 70;

let batchWeight = 5.00;

let battery = 85;


// Target temperature

let targetTemperature = 45;


// ========================================
// START SIMULATION
// ========================================

function startSimulation() {

    if (!simulationRunning) {

        simulationRunning = true;

        timer = setInterval(updateSimulation, 1000);

        updateDisplay();
    }
}


// ========================================
// PAUSE SIMULATION
// ========================================

function pauseSimulation() {

    simulationRunning = false;

    clearInterval(timer);

    updateDisplay();
}


// ========================================
// RESET
// ========================================

function resetSimulation() {

    simulationRunning = false;

    clearInterval(timer);

    temperature = 30;

    humidity = 70;

    batchWeight = 5.00;

    battery = 85;

    cloudyWeather = false;

    updateDisplay();
}


// ========================================
// CLOUDY WEATHER
// ========================================

function toggleWeather() {

    cloudyWeather = !cloudyWeather;

    updateDisplay();
}


// ========================================
// TARGET TEMPERATURE
// ========================================

function changeTargetTemperature() {

    targetTemperature =
        Number(
            document.getElementById("targetTemperature").value
        );

    document.getElementById("targetValue").innerText =
        targetTemperature;

    updateDisplay();
}


// ========================================
// MAIN SIMULATION
// ========================================

function updateSimulation() {

    if (!simulationRunning) {
        return;
    }


    // ------------------------------------
    // SOLAR HEATING
    // ------------------------------------

    let solarHeat;

    if (cloudyWeather) {

        solarHeat = 0.18;

    } else {

        solarHeat = 0.55;
    }


    // ------------------------------------
    // TEMPERATURE CONTROL
    // ------------------------------------

    let temperatureControl =
        (targetTemperature - temperature) * 0.08;


    let fanCooling = 0.12;


    temperature =
        temperature +
        solarHeat +
        temperatureControl -
        fanCooling;


    // Keep temperature within realistic simulation range

    temperature =
        Math.max(
            28,
            Math.min(52, temperature)
        );


    // ------------------------------------
    // HUMIDITY
    // ------------------------------------

    humidity -=
        0.22 +
        Math.max(
            0,
            temperature - 38
        ) * 0.015;


    if (cloudyWeather) {

        humidity += 0.05;
    }


    humidity =
        Math.max(
            18,
            Math.min(75, humidity)
        );


    // ------------------------------------
    // LOAD CELL SIMULATION
    // ------------------------------------

    let dryingRate;


    if (temperature > 38) {

        dryingRate = 0.0045;

    } else {

        dryingRate = 0.0015;
    }


    dryingRate =
        dryingRate *
        (humidity / 55);


    batchWeight -= dryingRate;


    // Minimum simulated final weight

    batchWeight =
        Math.max(
            3.50,
            batchWeight
        );


    // ------------------------------------
    // BATTERY
    // ------------------------------------

    if (cloudyWeather) {

        battery -= 0.04;

    } else {

        battery += 0.025;
    }


    battery =
        Math.max(
            10,
            Math.min(100, battery)
        );


    // ------------------------------------
    // UPDATE SCREEN
    // ------------------------------------

    updateDisplay();


    // ------------------------------------
    // DRYING COMPLETE
    // ------------------------------------

    if (batchWeight <= 3.50) {

        simulationRunning = false;

        clearInterval(timer);
    }
}


// ========================================
// UPDATE WEBSITE
// ========================================

function updateDisplay() {


    // Temperature

    document.getElementById("temperature").innerText =
        temperature.toFixed(1) + "°C";


    // Humidity

    document.getElementById("humidity").innerText =
        Math.round(humidity) + "%";


    // Weight

    document.getElementById("weight").innerText =
        batchWeight.toFixed(2) + " kg";


    // ------------------------------------
    // DRYING PROGRESS
    // ------------------------------------

    let progress =
        ((5 - batchWeight) / 1.5) * 100;


    progress =
        Math.max(
            0,
            Math.min(100, progress)
        );


    document.getElementById("progress").innerText =
        Math.round(progress) + "%";


    document.getElementById("progressBar").style.width =
        progress + "%";


    // ------------------------------------
    // BATTERY
    // ------------------------------------

    document.getElementById("battery").innerText =
        Math.round(battery) + "%";


    // ------------------------------------
    // WEATHER
    // ------------------------------------

    document.getElementById("weather").innerText =
        cloudyWeather
            ? "CLOUDY"
            : "SUNNY";


    // ------------------------------------
    // FAN CONTROL
    // ------------------------------------

    let fanSpeed;


    if (temperature > targetTemperature + 1) {

        fanSpeed = 90;

    } else if (
        temperature <
        targetTemperature - 3
    ) {

        fanSpeed = 40;

    } else {

        fanSpeed = 65;
    }


    if (cloudyWeather) {

        fanSpeed =
            Math.max(
                fanSpeed,
                70
            );
    }


    document.getElementById("fan").innerText =
        fanSpeed + "%";


    // ------------------------------------
    // HEATER CONTROL
    // ------------------------------------

    let heaterStatus;


    if (
        temperature <
        targetTemperature - 2
    ) {

        heaterStatus = "ON";

    } else {

        heaterStatus = "OFF";
    }


    document.getElementById("heater").innerText =
        heaterStatus;


    // ------------------------------------
    // SOLAR PANEL
    // ------------------------------------

    if (cloudyWeather) {

        document.getElementById("solar").innerText =
            "LOW";

    } else {

        document.getElementById("solar").innerText =
            "ON";
    }


    // ------------------------------------
    // SYSTEM STATUS
    // ------------------------------------

    let status;


    if (progress >= 100) {

        status = "DRYING COMPLETE";

    } else if (simulationRunning) {

        status = "DRYING...";

    } else {

        status = "SIMULATION PAUSED";
    }


    document.getElementById("status").innerText =
        status;
}


// ========================================
// INITIAL DISPLAY
// ========================================

updateDisplay();