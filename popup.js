// ポップアップが開いた時に現在の設定を読み込む
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['maxRounds'], (result) => {
        document.getElementById('roundInput').value = result.maxRounds || 50;
    });
});

// 保存ボタン押下時の処理
document.getElementById('saveBtn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('roundInput').value);
    chrome.storage.local.set({ maxRounds: val }, () => {
        alert('設定を保存しました！');
    });
});