  // Hide flash messages after 3 seconds
  setTimeout(function() {
    var rejectedMessage = document.getElementById('rejectedMessage');
    var acceptedMessage = document.getElementById('acceptedMessage');

    if (rejectedMessage) {
      rejectedMessage.style.display = 'none';
    }

    if (acceptedMessage) {
      acceptedMessage.style.display = 'none';
    }
  }, 3000);