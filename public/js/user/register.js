 // 이미지를 업로드하면 호출되는 함수
 function handleImageUpload() {
    const input = document.getElementById('uploadInput');
    const image = document.getElementById('profileImage');

    // 파일이 선택되었는지 확인
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // 이미지의 src를 선택한 파일의 경로로 설정
            image.src = e.target.result;
        };

        // 파일을 읽어오기
        reader.readAsDataURL(input.files[0]);
    }
}

// 이미지 리셋 버튼 클릭 시 호출되는 함수
function resetImage() {
    const image = document.getElementById('profileImage');
    // 기본 이미지 URL로 설정하거나 다른 동작 수행
    image.src = '/images/userDefault.jpg';
}

// 파일 입력(input type="file")의 change 이벤트에 handleImageUpload 함수 연결
document.getElementById('uploadInput').addEventListener('change', handleImageUpload);
