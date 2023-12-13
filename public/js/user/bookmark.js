const bookmarkIcon = document.querySelector('.bookmarkIcon');

let isBookmarked = false; // 북마크 상태를 나타내는 변수

bookmarkIcon.addEventListener('click', function() {
  isBookmarked = !isBookmarked; // 북마크 상태를 토글

  if (isBookmarked) {
    // 북마크되었을 때의 동작
    bookmarkIcon.style.color = 'gold'; // 아이콘 색상을 변경하여 북마크 상태 표시
    // 여기서 서버로 북마크 정보를 보내는 등의 작업을 수행해야 합니다.
  } else {
    // 북마크 해제되었을 때의 동작
    bookmarkIcon.style.color = ''; // 아이콘 색상을 초기화하여 북마크 해제 상태 표시
    // 서버에 북마크 해제 정보를 보내는 등의 작업도 필요합니다.
  }
});
