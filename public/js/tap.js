document.addEventListener('DOMContentLoaded', function() {
  const tabList = document.querySelectorAll('.tab_menu .list li');

  tabList.forEach(function(tab, index) {
      const tabButton = tab.querySelector('.btn');
      tabButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          const tabContent = tab.querySelector('.cont');
          tabList.forEach(function(item) {
              item.classList.remove('is_on');
          });
          tab.classList.add('is_on');
          
          tabList.forEach(function(item) {
              const content = item.querySelector('.cont');
              content.style.display = 'none';
          });
          
          tabContent.style.display = 'block';
      });
  });
});
