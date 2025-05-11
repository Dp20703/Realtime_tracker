const socket = io();

console.log("Connection established to socket.io");

// Send location using geolocation.watchPosition and socket emit
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Latitude:", latitude, "Longitude:", longitude);
            // send location to server [socket.io]
            socket.emit('send-location', { latitude, longitude });
        },
        (error) => {
            console.log("Error from socket send-location:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// create map and add tile layer
const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "codewithdp"
}).addTo(map);

// create markers
const markers = {};

// receive location from server [socket.io]
socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;
    console.log("data:", data);
    // update map
    map.setView([latitude, longitude]);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// disconnect from socket.io
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
    console.log("Disconnected from socket.io", id);
});
