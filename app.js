const GEMPA_API = 'https://api.allorigins.win/get?url=https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';
const container = document.getElementById('gempa-container');
const loading = document.getElementById('loading');
const updateTime = document.getElementById('update-time');

moment.locale('id');

async function getGempaData() {
    try {
        showLoading();
        
        const response = await fetch(GEMPA_API);
        const data = await response.json();
        const gempaData = JSON.parse(data.contents).Infogempa.gempa;
        
        container.innerHTML = '';
        updateTime.textContent = moment().format('DD MMMM YYYY HH:mm:ss');
        
        gempaData.forEach(gempa => {
            const card = document.createElement('div');
            card.className = 'gempa-card';
            card.innerHTML = `
                <div class="magnitude">${gempa.Magnitude}</div>
                <div class="lokasi">${gempa.Wilayah}</div>
                <div class="waktu">${moment(gempa.DateTime).format('dddd, DD MMMM YYYY HH:mm:ss')}</div>
                <div class="detail">
                    <div>Kedalaman: ${gempa.Kedalaman}</div>
                    <div>Koordinat: ${gempa.Coordinates}</div>
                    <div>Dirasakan: ${gempa.Dirasakan || '-'}</div>
                </div>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `<div class="error">Gagal memuat data. Silakan refresh halaman.</div>`;
    } finally {
        hideLoading();
    }
}

function showLoading() {
    loading.style.display = 'flex';
    container.style.opacity = '0.5';
}

function hideLoading() {
    loading.style.display = 'none';
    container.style.opacity = '1';
}

// Initial load
getGempaData();

// Auto-refresh every 5 minutes
setInterval(getGempaData, 300000);