let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");

let clickCount = 0;  // 记录点击 No 的次数

// No 按钮的文字变化
const noTexts0 = [
    "假的吧……？",
    "不想一想……？",
    "开玩笑吧？",
    "会伤心哦……",
    "不要我了嘛……",
    "我不信你……",
    "你不正常……",
    "要不开心的……",
    "有点假的吧……？"
];

const noTexts1 = [
    "生气了！不要你了！"
]

// No 按钮点击事件
noButton.addEventListener("click", function() {
    clickCount++;

    // 让 Yes 变大，每次放大 2 倍
    let yesSize = 1 + (clickCount * 1.2);
    yesButton.style.transform = `scale(${yesSize})`;

    // 挤压 No 按钮，每次右移 100px
    let noOffset = clickCount * 50;
    noButton.style.transform = `translateX(${noOffset}px)`;

    // **新增：让图片和文字往上移动**
    let moveUp = clickCount * 25; // 每次上移 20px
    mainImage.style.transform = `translateY(-${moveUp}px)`;
    questionText.style.transform = `translateY(-${moveUp}px)`;

    // No 文案变化（前 5 次变化）
    if (clickCount <= 9) {
        noButton.innerText = noTexts0[clickCount - 1];
    }

    if (clickCount === 10) {
        noButton.innerText = noTexts1[0]; // 生气
    }

    // 图片变化（前 5 次变化）
    if (clickCount === 1) mainImage.src = "assets/images/icon/shocked.png"; // 震惊
    if (clickCount === 2) mainImage.src = "assets/images/icon/think.png";   // 思考
    if (clickCount === 3) mainImage.src = "assets/images/icon/angry.png";   // 生气
    if (clickCount >= 4 && clickCount <= 9) mainImage.src = "assets/images/icon/crying.png"; //哭
    if (clickCount === 10) mainImage.src = "assets/images/icon/angry.png"; // 生气
    if (clickCount >= 11) mainImage.src = "assets/images/icon/crying.png"; // 哭

});

// Yes 按钮点击后，进入表白成功页面
yesButton.addEventListener("click", function() {
    document.body.innerHTML = `
        <div class="yes-screen">
            <h1 class="yes-text">!!!喜欢你!! ( >᎑<)♡︎ᐝ</h1>
            <img src="assets/images/icon/hug.png" alt="拥抱" class="yes-image">
        </div>
    `;

    document.body.style.overflow = "hidden";
});