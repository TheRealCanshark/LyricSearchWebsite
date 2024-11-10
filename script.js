document.getElementById('lyricsForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const song = document.getElementById('song').value.trim();
    const artist = document.getElementById('artist').value.trim(); // 可以不輸入歌手
    const lyricsResult = document.getElementById('lyricsResult');
    const videoResult = document.getElementById('videoResult');
    const buttons = document.getElementById('buttons');
    
    lyricsResult.style.display = 'none';
    lyricsResult.innerText = '';
    videoResult.style.display = 'none';
    videoResult.innerHTML = '';
    buttons.style.display = 'none';
    
    if (song) {
        lyricsResult.innerText = '搜尋中...';
        
        try {
            // 取得歌詞，如果沒輸入歌手，歌手名稱使用空字串
            const artistSearch = artist || 'unknown'; // 如果沒輸入歌手，則設為 'unknown'
            const response = await fetch(`https://api.lyrics.ovh/v1/${artistSearch}/${song}`);
            const data = await response.json();
            
            if (data.lyrics) {
                lyricsResult.innerText = data.lyrics;
                buttons.style.display = 'block';
            } else {
                lyricsResult.innerText = '找不到歌詞，請檢查輸入。';
                lyricsResult.style.display = 'block';
            }
        } catch (error) {
            lyricsResult.innerText = '發生錯誤，請稍後再試。';
            lyricsResult.style.display = 'block';
            console.error(error);
        }
    }
});

document.getElementById('showLyricsBtn').addEventListener('click', function() {
    const lyricsResult = document.getElementById('lyricsResult');
    lyricsResult.style.display = lyricsResult.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('showVideoBtn').addEventListener('click', async function() {
    const videoResult = document.getElementById('videoResult');
    const song = document.getElementById('song').value.trim();
    const artist = document.getElementById('artist').value.trim(); // 可以不輸入歌手

    if (videoResult.style.display === 'block') {
        videoResult.style.display = 'none';
        videoResult.innerHTML = '';
    } else {
        try {
            // 使用 YouTube Data API 搜尋影片
            const apiKey = 'AIzaSyDEkdq31wAi0ALi9ebNKQkBsLtsOXlsB-U';
            const query = `${song} 音樂`; // 只搜尋歌曲名稱，不需要歌手
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`);
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                
                // 顯示 YouTube 影片網址，並提供直接跳轉的按鈕
                videoResult.innerHTML = `
                    <p>點擊下方按鈕觀看影片</p>
                    <a href="${videoUrl}" target="_blank">
                        <button>前往 YouTube 觀看</button>
                    </a>
                `;
                videoResult.style.display = 'block';
            } else {
                videoResult.innerHTML = '找不到相關影片。';
                videoResult.style.display = 'block';
            }
        } catch (error) {
            videoResult.innerHTML = '發生錯誤，請稍後再試。';
            videoResult.style.display = 'block';
            console.error(error);
        }
    }
});
