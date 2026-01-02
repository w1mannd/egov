// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Портал ГосУслуги запущен');
    
    // Инициализация компонентов
    initMobileMenu();
    initNotifications();
    initModals();
    initAnimations();
    initTelegramIntegration();
});

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Закрытие меню при клике на ссылку
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// Уведомления
function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const closeNotifications = document.getElementById('closeNotifications');
    const notificationsModal = document.getElementById('notificationsModal');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            notificationsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Сброс счетчика уведомлений
            const badge = notificationBtn.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
            
            // Отметить уведомления как прочитанные
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
        });
    }
    
    if (closeNotifications) {
        closeNotifications.addEventListener('click', () => {
            notificationsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Закрытие по клику вне окна
    if (notificationsModal) {
        notificationsModal.addEventListener('click', (e) => {
            if (e.target === notificationsModal) {
                notificationsModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Модальные окна
function initModals() {
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });
}

// Анимации
function initAnimations() {
    // Анимация при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с классом .animate-on-scroll
    document.querySelectorAll('.service-card, .step-card, .stat-card, .news-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Добавляем CSS для анимации
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Интеграция с Telegram WebApp
function initTelegramIntegration() {
    // Проверяем, открыто ли приложение в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Инициализируем WebApp
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();
        
        // Устанавливаем тему Telegram
        if (tg.colorScheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        }
        
        // Получаем данные пользователя
        const user = tg.initDataUnsafe?.user;
        if (user) {
            updateUserProfile(user);
            
            // Логируем для отладки
            console.log('Telegram User:', user);
            
            // Добавляем данные в LocalStorage для использования на других страницах
            localStorage.setItem('tg_user', JSON.stringify(user));
        }
        
        // Обработка нажатия кнопки назад в Telegram
        tg.BackButton.onClick(() => {
            window.history.back();
        });
        
        // Показываем кнопку назад если не на главной
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            tg.BackButton.show();
        }
        
        // Обновляем заголовок в Telegram
        tg.setHeaderColor('#0f172a');
        tg.setBackgroundColor('#0f172a');
        
    } else {
        // Режим демо - загружаем тестовые данные
        console.log('Режим демо: приложение не запущено в Telegram');
        loadDemoData();
    }
}

// Обновление профиля пользователя
function updateUserProfile(user) {
    // Обновляем приветствие
    const welcomeElements = document.querySelectorAll('.welcome-text, .user-greeting');
    welcomeElements.forEach(el => {
        if (el.textContent.includes('Добро пожаловать')) {
            el.textContent = `Добро пожаловать, ${user.first_name || 'Пользователь'}!`;
        }
    });
    
    // Обновляем аватар
    const avatarElements = document.querySelectorAll('.btn-profile img, .avatar-img');
    avatarElements.forEach(img => {
        if (user.photo_url) {
            img.src = user.photo_url;
        } else {
            // Генерация аватара на основе имени
            const seed = user.first_name || 'Telegram';
            img.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        }
    });
}

// Загрузка демо-данных
function loadDemoData() {
    // Генерация случайного имени для демо
    const names = ['Александр', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Елена'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    // Обновляем приветствие
    const welcomeElements = document.querySelectorAll('.welcome-text, .user-greeting');
    welcomeElements.forEach(el => {
        if (el.textContent.includes('Добро пожаловать')) {
            el.textContent = `Добро пожаловать, ${randomName}!`;
        }
    });
    
    // Сохраняем демо-пользователя в LocalStorage
    const demoUser = {
        id: Math.floor(Math.random() * 1000000),
        first_name: randomName,
        last_name: 'Демо',
        username: `demo_${randomName.toLowerCase()}`
    };
    
    localStorage.setItem('tg_user', JSON.stringify(demoUser));
}

// Утилиты
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Стили для тоста
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: toastSlideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Автоматическое закрытие
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
    
    // Добавляем анимации
    const style = document.createElement('style');
    if (!document.querySelector('#toast-animations')) {
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes toastSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes toastSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Экспорт функций для использования в других файлах
window.PortalUtils = {
    showToast,
    initTelegramIntegration,
    loadDemoData
};

// Инициализация после полной загрузки страницы
window.addEventListener('load', function() {
    // Плавная загрузка
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Проверка онлайн-статуса
    window.addEventListener('online', () => {
        showToast('Соединение восстановлено', 'success');
    });
    
    window.addEventListener('offline', () => {
        showToast('Нет подключения к интернету', 'error');
    });
});