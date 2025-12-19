// ========================================
// 設定
// ========================================

// ========================================
// Google Apps Script設定
// ========================================
// Google Apps ScriptのWebアプリURLをここに貼り付けてください
// 例: https://script.google.com/macros/s/AKfycby.../exec
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTSLGIl9EUFQBC5cK3N10nEm1unNtOoxgGMMZHusK99aZcG5aN34M2fC12CpNGteJM/exec';
const ENABLE_DEBUG_OVERLAY = false; // 一時的な画面ログ表示用（不要になったらfalse）

// タイピングアニメーションのテキスト
const TYPING_TEXT = 'お兄ちゃん…♡';
const TYPING_SPEED = 150; // ミリ秒

// 画像URL（プロジェクトフォルダ内の画像を使用）
const SECRET_IMAGE_URL = './secret-image.JPG';

// ========================================
// Google Apps Script初期化（不要なため削除）
// ========================================

// ========================================
// 簡易ログ表示オーバーレイ（デバッグ用）
// ========================================
function initDebugOverlay() {
  if (!ENABLE_DEBUG_OVERLAY || document.getElementById('debug-log')) return;
  const box = document.createElement('div');
  box.id = 'debug-log';
  box.style.position = 'fixed';
  box.style.bottom = '10px';
  box.style.left = '10px';
  box.style.right = '10px';
  box.style.maxHeight = '40vh';
  box.style.overflowY = 'auto';
  box.style.background = 'rgba(0,0,0,0.8)';
  box.style.color = '#0f0';
  box.style.fontSize = '12px';
  box.style.padding = '8px';
  box.style.zIndex = '9999';
  box.style.whiteSpace = 'pre-wrap';
  box.style.fontFamily = 'monospace';
  document.body.appendChild(box);
}

function logToScreen(msg) {
  if (!ENABLE_DEBUG_OVERLAY) return;
  const box = document.getElementById('debug-log');
  if (!box) return;
  const now = new Date().toISOString();
  const line = `[${now}] ${msg}`;
  const p = document.createElement('div');
  p.textContent = line;
  box.appendChild(p);
}

window.addEventListener('error', (e) => {
  initDebugOverlay();
  logToScreen(`Error: ${e.message}`);
});

window.addEventListener('unhandledrejection', (e) => {
  initDebugOverlay();
  logToScreen(`Promise rejection: ${e.reason}`);
});

// ========================================
// タイピングアニメーション
// ========================================

let charIndex = 0;

function typeText() {
  if (charIndex < TYPING_TEXT.length) {
    document.getElementById('typed-text').textContent += TYPING_TEXT.charAt(charIndex);
    charIndex++;
    setTimeout(typeText, TYPING_SPEED);
  }
}

// ページ読み込み後、少し待ってからタイピング開始
setTimeout(typeText, 500);

// ========================================
// フォーム送信処理
// ========================================

document.getElementById('message-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  initDebugOverlay();
  
  // 入力値を取得
  const message = document.getElementById('message-input').value.trim();
  
  // バリデーション
  if (!message) {
    showError('メッセージを入力してください');
    logToScreen('Validation failed: empty message');
    return;
  }
  
  // ローディング開始
  setLoading(true);
  
  try {
    // Googleスプレッドシートに保存
    let result = await saveToSpreadsheet(message);
    logToScreen('saveToSpreadsheet success');
    
    // 成功表示
    showSuccess();
    
    // フォームをリセット
    document.getElementById('message-form').reset();
    
  } catch (error) {
    console.error('送信エラー:', error);
    logToScreen(`送信エラー: ${error.message || error}`);
    showError('送信に失敗しました: ' + error.message);
  } finally {
    setLoading(false);
  }
});

// ========================================
// Googleスプレッドシートに保存
// ========================================

async function saveToSpreadsheet(message) {
  logToScreen(`POST start -> ${GOOGLE_APPS_SCRIPT_URL}`);

  let response;
  try {
    // Google Apps ScriptのWebアプリにPOSTリクエストを送信
    response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // CORSによるブロックを回避（レスポンスは読めなくなる）
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message
      })
    });
  } catch (networkError) {
    logToScreen(`fetch例外: ${networkError}`);
    throw new Error(`ネットワークエラー: ${networkError}`);
  }
  
  // no-cors の場合、レスポンスは読めないが送信は行われる
  logToScreen('送信完了（no-corsのためレスポンス読めず）');
  return { success: true };
}

// ========================================
// UI制御関数
// ========================================

function setLoading(isLoading) {
  const submitButton = document.getElementById('submit-button');
  const buttonText = document.getElementById('button-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  submitButton.disabled = isLoading;
  
  if (isLoading) {
    buttonText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
  } else {
    buttonText.classList.remove('hidden');
    loadingSpinner.classList.add('hidden');
  }
}

function showSuccess() {
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  
  errorMessage.classList.add('hidden');
  successMessage.classList.remove('hidden');
  
  // フォームを非表示
  document.getElementById('message-form').style.display = 'none';
}

function showError(message) {
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  
  successMessage.classList.add('hidden');
  errorText.textContent = message;
  errorMessage.classList.remove('hidden');
  
  // 5秒後に自動で非表示
  setTimeout(() => {
    errorMessage.classList.add('hidden');
  }, 5000);
}

// ========================================
// 秘密のボタン & モーダル機能
// ========================================

const secretButton = document.getElementById('secret-button');
const modal = document.getElementById('image-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalImage = document.getElementById('modal-image');

// 秘密のボタンをクリック
secretButton.addEventListener('click', () => {
  modalImage.src = SECRET_IMAGE_URL;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // スクロール防止
});

// モーダルを閉じる
function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = ''; // スクロール復元
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.getElementById('modal-close-bottom').addEventListener('click', closeModal);

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

