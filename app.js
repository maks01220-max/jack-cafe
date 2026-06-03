// Скрипты интернет-магазина Jack Cafe

document.addEventListener("DOMContentLoaded", () => {
    // Вызов основных функций при загрузке страницы
    updateCartCounter();
    setupThemeToggle();
    setupProductSorting();
    setupCartButtons();
    setupScrollReveal();
});

// Плавная анимация появления элементов при прокрутке экрана
function setupScrollReveal() {
    const blocks = document.querySelectorAll('.reveal');
    
    // Используем IntersectionObserver для отслеживания видимости
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    blocks.forEach(block => observer.observe(block));
}

// Получение данных корзины из памяти браузера (LocalStorage)
function getCartData() {
    const data = localStorage.getItem('jack_cart_items');
    // Тернарный оператор: если данные есть, парсим их, иначе возвращаем пустой массив
    return data ? JSON.parse(data) : []; 
}

// Сохранение обновленной корзины в память
function saveCartData(array) {
    localStorage.setItem('jack_cart_items', JSON.stringify(array));
}

// Обновление цифры на значке корзины в навигации
function updateCartCounter() {
    const badge = document.getElementById('cart-counter');
    // Паттерн "ранний возврат": если бейджа нет на странице, выходим
    if (!badge) return; 

    const items = getCartData();
    
    // Используем метод reduce для быстрого подсчета общего количества товаров
    const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = totalCount;
}

// Функция для показа модального окна с описанием кофе (вызывается из HTML)
function showDetails(title, composition, history) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalComposition').textContent = composition;
    document.getElementById('modalHistory').textContent = history;
    $('#infoModal').modal('show'); // Показываем модалку через Bootstrap/jQuery
}

// Настройка кнопок добавления в корзину
function setupCartButtons() {
    const buyButtons = document.querySelectorAll('.btn-buy');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Блокируем всплытие клика
            
            // Читаем данные из атрибутов data-*
            const name = button.dataset.name;
            const price = Number(button.dataset.price);
            
            const cart = getCartData();
            
            // Ищем, есть ли уже такой товар в корзине
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.qty += 1; // Увеличиваем количество
            } else {
                cart.push({ name, price, qty: 1 }); // Добавляем новый товар
            }
            
            saveCartData(cart);
            updateCartCounter();
            
            // Показ всплывающего уведомления
            const toast = document.getElementById('toast');
            if (toast) {
                toast.classList.add('show');
                // Скрываем через 2 секунды
                setTimeout(() => toast.classList.remove('show'), 2000);
            }
        });
    });
}

// Логика сортировки каталога товаров
function setupProductSorting() {
    const sortSelect = document.getElementById('sort-select');
    const grid = document.getElementById('product-grid');
    
    // Если на странице нет сортировки (например, в корзине), прерываем работу
    if (!sortSelect || !grid) return;

    sortSelect.addEventListener('change', (event) => {
        const sortType = event.target.value;
        const itemCards = Array.from(grid.getElementsByClassName('product-card'));
        
        // Сортировка массива элементов
        itemCards.sort((cardA, cardB) => {
            const priceA = parseFloat(cardA.dataset.price) || 0;
            const priceB = parseFloat(cardB.dataset.price) || 0;
            const popA = parseInt(cardA.dataset.pop) || 0;
            const popB = parseInt(cardB.dataset.pop) || 0;

            if (sortType === 'price_asc') return priceA - priceB;
            if (sortType === 'price_desc') return priceB - priceA;
            return popB - popA; // По умолчанию сортируем по убыванию популярности
        });

        // Оптимизированный способ перерисовки сетки
        // Оператор spread (...) позволяет передать массив элементов как аргументы
        // append сам переместит элементы в нужном порядке без удаления старых
        grid.append(...itemCards); 
    });
}

// Логика переключения темной/светлой темы
function setupThemeToggle() {
    const themeButton = document.getElementById('theme-toggle');
    if (!themeButton) return;
    
    const themeIcon = themeButton.querySelector('i');
    
    // Вспомогательная функция для обновления иконки
    const updateIcon = (isDark) => {
        themeIcon.classList.toggle('fa-sun', isDark);
        themeIcon.classList.toggle('fa-moon', !isDark);
        themeIcon.style.color = isDark ? '#c5a880' : ''; // Добавляем золотистый цвет солнцу
    };

    // Проверка сохраненной темы при загрузке
    const isSavedThemeDark = localStorage.getItem('theme') === 'dark';
    updateIcon(isSavedThemeDark);

    // Обработка клика
    themeButton.addEventListener('click', () => {
        // toggle автоматически добавит или уберет класс и вернет true/false
        const isDarkNow = document.body.classList.toggle('dark-theme');
        
        localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
        updateIcon(isDarkNow);
    });
}
