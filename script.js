// ========================================
// 設定
// ========================================

// ========================================
// EmailJS設定（以下3つを自分のIDに書き換えてください）
// ========================================
const EMAILJS_USER_ID = 'iqaIOGlXCk-Klc0Jb';      // 例: y3I9Zxxx_xxxmEt
const EMAILJS_SERVICE_ID = 'ishiro146';        // 例: service_xxxxx
const EMAILJS_TEMPLATE_ID = 'template_inoa4jp';      // 例: template_xxxxx

// タイピングアニメーションのテキスト
const TYPING_TEXT = 'お兄ちゃん…♡';
const TYPING_SPEED = 150; // ミリ秒

// 画像URL（プロジェクトフォルダ内の画像を使用）
const SECRET_IMAGE_URL = './secret-image.JPG';

// ========================================
// EmailJS初期化
// ========================================
(function() {
  emailjs.init({
    publicKey: EMAILJS_USER_ID
  });
})();

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
  
  // 入力値を取得
  const message = document.getElementById('message-input').value.trim();
  
  // バリデーション
  if (!message) {
    showError('メッセージを入力してください');
    return;
  }
  
  // ローディング開始
  setLoading(true);
  
  try {
    // EmailJSでメール送信
    let result = await sendToGmail(message);
    
    // 成功表示
    showSuccess();
    
    // フォームをリセット
    document.getElementById('message-form').reset();
    
  } catch (error) {
    console.error('送信エラー:', error);
    showError('送信に失敗しました: ' + error.message);
  } finally {
    setLoading(false);
  }
});

// ========================================
// EmailJSでメール送信
// ========================================

async function sendToGmail(message) {
  // テンプレートに渡すパラメータ（テンプレ側で {{message}} などで使える）
  const templateParams = {
    message: message,
    name: 'フォーム送信者',
    time: new Date().toLocaleString()
  };

  const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
  return response;
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
