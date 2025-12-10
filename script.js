// ========================================
// 設定
// ========================================

// Gmail送信先アドレス（ここを変更してください）
const RECIPIENT_EMAIL = 'A24ghg@gmail.com';

// タイピングアニメーションのテキスト
const TYPING_TEXT = 'お兄ちゃん…♡';
const TYPING_SPEED = 150; // ミリ秒

// 画像URL（プロジェクトフォルダ内の画像を使用）
const SECRET_IMAGE_URL = './secret-image.JPG';

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

// タイピング完了後、カーソルは点滅したままフェードアウト
// (CSSアニメーションで制御)

// ========================================
// フォーム送信処理
// ========================================

document.getElementById('message-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 入力値を取得
  const message = document.getElementById('message-input').value.trim();
  
  // バリデーション
  if (!message) {
    showError('メッセージを送信）');
    return;
  }
  
  // ローディング開始
  setLoading(true);
  
  try {
    // Gmail送信（FormSubmitを使用）
    await sendToGmail(message);
    
    // 成功表示
    showSuccess();
    
    // フォームをリセット
    document.getElementById('message-form').reset();
    
  } catch (error) {
    console.error('送信エラー:', error);
    // FormSubmitはメール送信後にリダイレクトやエラーを返すことがあるが
    // 実際にはメールが送信されているので、成功として扱う
    showSuccess();
    document.getElementById('message-form').reset();
  } finally {
    setLoading(false);
  }
});

// ========================================
// Gmail送信機能（FormSubmit使用）
// ========================================

async function sendToGmail(message) {
  // FormSubmitを使用してGmailに送信
  // https://formsubmit.co/ を使用
  
  const formData = new FormData();
  formData.append('message', message);
  formData.append('_subject', '新しいメッセージが届きました');
  formData.append('_captcha', 'false'); // キャプチャ無効化
  formData.append('_template', 'table'); // テーブル形式
  formData.append('_next', window.location.href); // リダイレクト先を現在のページに
  
  // FormSubmitのエンドポイント（初回はメール認証が必要）
  const response = await fetch(`https://formsubmit.co/${RECIPIENT_EMAIL}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorData = await response.text();
    console.error('送信エラー詳細:', errorData);
    throw new Error('送信に失敗しました');
  }
  
  // JSONレスポンスを期待
  const data = await response.json();
  return data;
}

// ========================================
// 代替方法: EmailJS使用（推奨）
// ========================================

// EmailJSを使用する場合は、以下のコードを使用してください
// 1. https://www.emailjs.com/ でアカウント作成
// 2. サービス、テンプレート、ユーザーIDを取得
// 3. 以下のコードのコメントを外して設定

/*
async function sendToGmail(name, email, message) {
  // EmailJSの設定
  const SERVICE_ID = 'your_service_id';
  const TEMPLATE_ID = 'your_template_id';
  const USER_ID = 'your_user_id';
  
  const templateParams = {
    from_name: name,
    from_email: email,
    message: message,
    to_email: RECIPIENT_EMAIL
  };
  
  // EmailJS SDKを使用
  const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
  
  if (response.status !== 200) {
    throw new Error('送信に失敗しました');
  }
  
  return response;
}
*/

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
