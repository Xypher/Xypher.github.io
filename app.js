const GEMPA_URL = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';
const GEMPA_LIST = document.getElementById('gempa-list');
const LOADING = document.getElementById('loading');
const UPDATE_TIME = document.getElementById('update-time');

async function getGempaData() {
    try {
        LOADING.style.display = 'block';
        const response = await fetch(GEMPA_URL);
        const data = await response.json();
        
        // Clear existing data
        GEMPA_LIST.innerHTML = '';
        
        // Format waktu update
        const waktuUpdate = moment(data.Infogempa.gempa.DateTime).format('DD MMM YYYY HH:mm:ss');
        UPDATE_TIME.textContent = waktuUpdate;
        
        // Create earthquake card
        const gempa = data.Infogempa.gempa;
        const card = document.createElement('div');
        card.className = 'gempa-item';
        card.innerHTML = `
            <div class="gempa-magnitude">${gempa.Magnitude}</div>
            <div class="gempa-lokasi">${gempa.Wilayah}</div>
            <div class="gempa-waktu">${moment(gempa.DateTime).format('DD MMM YYYY HH:mm:ss')}</div>
            <div class="gempa-kedalaman">Kedalaman: ${gempa.Kedalaman}</div>
            <div class="gempa-koordinat">Koordinat: ${gempa.Coordinates}</div>
        `;
        
        GEMPA_LIST.appendChild(card);
        LOADING.style.display = 'none';
        
    } catch (error) {
        console.error('Error fetching data:', error);
        LOADING.style.display = 'none';
        GEMPA_LIST.innerHTML = '<div class="error">Gagal memuat data gempa</div>';
    }
}

// Get initial data
getGempaData();

// Refresh data every 5 minutes
setInterval(getGempaData, 300000);