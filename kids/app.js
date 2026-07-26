// =========================================================================
// 🧒 محرك البروفايل والنقاط والمغريات (Kids Engine)
// =========================================================================

window.kidsState = {
    stars: parseInt(localStorage.getItem('kids_stars') || '10'),
    bricks: parseInt(localStorage.getItem('kids_bricks') || '5'),
    petFeedCount: parseInt(localStorage.getItem('kids_pet_feed') || '0'),
    cityBuildings: JSON.parse(localStorage.getItem('kids_city') || '[]')
};

function updateHeroHeader() {
    const starsEl = document.getElementById('heroStars');
    const bricksEl = document.getElementById('heroBricks');
    const rankEl = document.getElementById('heroRank');

    if (starsEl) starsEl.textContent = window.kidsState.stars;
    if (bricksEl) bricksEl.textContent = window.kidsState.bricks;

    let rank = "بَطَلٌ مُبْتَدِئٌ ⭐";
    if (window.kidsState.stars >= 50) rank = "طَالِبُ عِلْمٍ 📖";
    if (window.kidsState.stars >= 100) rank = "حَافِظٌ صَغِيرٌ 🏅";
    if (window.kidsState.stars >= 200) rank = "بَطَلُ الأُمَّةِ 👑";

    if (rankEl) rankEl.textContent = rank;
}

function switchKidsTab(tabName) {
    document.querySelectorAll('.kids-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.map-node').forEach(btn => btn.classList.remove('active'));

    const activeContent = document.getElementById('kidsContent_' + tabName);
    const activeBtn = document.getElementById('kidsTab_' + tabName);

    if (activeContent) activeContent.classList.add('active');
    if (activeBtn) activeBtn.classList.add('active');
}

// الصندوق اليومي
function openDailyBox() {
    const modal = document.getElementById('dailyBoxModal');
    if (modal) modal.style.display = 'flex';
}

function claimDailyReward() {
    window.kidsState.stars += 15;
    window.kidsState.bricks += 3;
    saveKidsState();
    alert("🎉 مَبْرُوكٌ! حَصَلْتَ عَلَى 15 نَجْمَةً وَ 3 طُوبَاتٍ!");
    const modal = document.getElementById('dailyBoxModal');
    if (modal) modal.style.display = 'none';
}

function saveKidsState() {
    localStorage.setItem('kids_stars', window.kidsState.stars);
    localStorage.setItem('kids_bricks', window.kidsState.bricks);
    localStorage.setItem('kids_pet_feed', window.kidsState.petFeedCount);
    localStorage.setItem('kids_city', JSON.stringify(window.kidsState.cityBuildings));
    updateHeroHeader();
}

document.addEventListener('DOMContentLoaded', () => {
    updateHeroHeader();
});
