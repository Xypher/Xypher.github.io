const API_URL = 'https://cors-anywhere.herokuapp.com/https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';
const earthquakeGrid = document.getElementById('earthquake-grid');
const errorContainer = document.getElementById('error-container');
const updateTimeElement = document.getElementById('update-time');

moment.locale('id');

async function loadData() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Gagal mengambil data');
        
        const data = await response.json();
        renderEarthquakes(data.Infogempa.gempa);
        updateTime();
        hideError();
    } catch (error) {
        console.error('Error:', error);
        showError();
    }
}

function renderEarthquakes(earthquakes) {
    earthquakeGrid.innerHTML = '';
    
    earthquakes.forEach(eq => {
        const magnitude = parseFloat(eq.Magnitude);
        const card = document.createElement('div');
        card.className = 'earthquake-card';
        card.innerHTML = `
            <div class="magnitude" data-magnitude="${magnitude}">
                <i class="fas fa-ruler-combined"></i>
                ${magnitude} SR
            </div>
            <div class="location">
                <i class="fas fa-map-marker-alt"></i>
                ${eq.Wilayah}
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                ${moment(eq.DateTime).format('dddd, DD MMM YYYY HH:mm')}
            </div>
            <div class="detail-item">
                <i class="fas fa-ruler-vertical"></i>
                Kedalaman: ${eq.Kedalaman}
            </div>
            <div class="detail-item">
                <i class="fas fa-map-pin"></i>
                ${eq.Coordinates}
            </div>
        `;
        earthquakeGrid.appendChild(card);
    });
}

function updateTime() {
    updateTimeElement.textContent = moment().format('DD MMMM YYYY HH:mm:ss');
}

function showLoading() {
    earthquakeGrid.innerHTML = `
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
    `;
    errorContainer.style.display = 'none';
}

function showError() {
    earthquakeGrid.innerHTML = '';
    errorContainer.style.display = 'block';
}

function hideError() {
    errorContainer.style.display = 'none';
}

// Auto refresh setiap 1 menit
setInterval(loadData, 60000);

// Initial load
loadData();

// Refresh saat online kembali
window.addEventListener('online', loadData);