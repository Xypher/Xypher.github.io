const GEMPA_API = 'https://api.allorigins.win/get?url=https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';
const container = document.getElementById('gempa-container');
const errorMessage = document.getElementById('error-message');
const updateTime = document.getElementById('update-time');

moment.locale('id');

async function getGempaData() {
    try {
        // Tampilkan skeleton loading
        container.innerHTML = `
            <div class="skeleton-loading">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
        `;
        
        const response = await fetch(GEMPA_API);
        const data = await response.json();
        const gempaData = JSON.parse(data.contents).Infogempa.gempa;
        
        // Update waktu
        updateTime.textContent = moment().format('DD MMMM YYYY HH:mm:ss');
        
        // Render data
        container.innerHTML = '';
        gempaData.forEach((gempa, index) => {
            const card = document.createElement('div');
            card.className = 'gempa-card';
            card.innerHTML = `
                <div class="magnitude" data-magnitude="${gempa.Magnitude}">
                    <i class="fas fa-ruler-combined"></i>
                    ${gempa.Magnitude} SR
                </div>
                
                <div class="lokasi">
                    <i class="fas fa-map-marker-alt"></i>
                    ${gempa.Wilayah}
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    ${moment(gempa.DateTime).format('dddd, DD MMM YYYY HH:mm')}
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-ruler-vertical"></i>
                    Kedalaman: ${gempa.Kedalaman}
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-map-pin"></i>
                    Koordinat: ${gempa.Coordinates}
                </div>
                
                <div class="detail-item">
                    <i class="fas fa-exclamation-circle"></i>
                    Dirasakan: ${gempa.Dirasakan || 'Tidak dilaporkan'}
                </div>
            `;
            
            // Animasi fade in
            card.style.animation = 'fadeIn 0.5s ease-out';
            container.appendChild(card);
        });
        
        errorMessage.style.display = 'none';
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '';
        errorMessage.style.display = 'flex';
    }
}

// Auto refresh setiap 1 menit
setInterval(getGempaData, 60000);

// Initial load
getGempaData();

// Refresh saat online kembali
window.addEventListener('online', getGempaData);