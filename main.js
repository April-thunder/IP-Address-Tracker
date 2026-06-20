const formInput = document.getElementById('form');
const input = document.getElementById('input');
const locationElem = document.getElementById('location');
const timezoneElem = document.getElementById('timezone');
const ipElem = document.getElementById('ip');
const ispElem = document.getElementById('isp');

let lat, lng, city, region, postalCode, timezone, userIp, userIsp;
let myMap = null; // ссылка на объект карты

// Создание или обновление карты
function createMap(centerLat, centerLng, zoom = 12) {
    // Если карта уже существует, уничтожаем её
    if (myMap) {
        myMap.destroy();
        myMap = null;
    }

    myMap = new ymaps.Map('map', {
        center: [centerLat, centerLng],
        zoom: zoom,
    });

    // Убираем лишние элементы управления
    myMap.controls.remove('geolocationControl');
    myMap.controls.remove('searchControl');
    myMap.controls.remove('trafficControl');
    myMap.controls.remove('typeSelector');
    myMap.controls.remove('fullscreenControl');
    myMap.controls.remove('rulerControl');

    // Добавляем метку
    const placemark = new ymaps.Placemark(
        [centerLat, centerLng],
        { balloonContent: 'Данный IP соответствует этому месту' },
        {
            iconLayout: 'default#image',
            iconImageHref: 'images/custom-baloon.svg',
            iconImageSize: [30, 30],
            iconImageOffset: [-10, -20],
        }
    );
    myMap.geoObjects.add(placemark);
}

// Получение данных текущего пользователя
async function getDataUser() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Ошибка получения данных пользователя');
        const data = await res.json();
        destrData(data, true);
        renderData();

        if (lat && lng) {
            createMap(lat, lng);
        } else {
            // Если координаты не получены, показываем карту по умолчанию (Москва)
            createMap(55.7558, 37.6173);
        }
    } catch (e) {
        console.error(e);
        Fnon.Alert.Danger({
            title: 'Ошибка',
            message: 'Не удалось определить ваше местоположение. Попробуйте позже.',
        });
        createMap(55.7558, 37.6173);
    }
}

// Получение данных по введённому IP
async function getDataFromIp(ipAddress) {
    try {
        const res = await fetch(
            `https://geo.ipify.org/api/v2/country,city?apiKey=at_NRbSuVKKvynh0J8KqPl7zzzWa21M4&ipAddress=${ipAddress}`
        );
        if (!res.ok) throw new Error('Ошибка получения данных по IP');
        const data = await res.json();
        destrData(data, false);
        renderData();

        if (lat && lng) {
            createMap(lat, lng);
        } else {
            Fnon.Alert.Danger({
                title: 'Ошибка',
                message: 'Не удалось определить координаты для данного IP.',
            });
        }
    } catch (e) {
        console.error(e);
        Fnon.Alert.Danger({
            title: 'Ошибка',
            message: 'Не удалось получить данные по IP. Проверьте подключение или введите корректный IP.',
        });
    }
}

// Извлечение данных из ответа API
function destrData(data, isUserData) {
    if (isUserData) {
        // Данные от ipapi.co
        city = data.city || '';
        region = data.region || '';
        postalCode = data.postal || '';
        // utc_offset имеет вид "+03:00" – берём первые 6 символов
        timezone = data.utc_offset ? data.utc_offset.slice(0, 6) : '';
        userIp = data.ip || '';
        userIsp = data.org || '';
        lat = data.latitude || null;
        lng = data.longitude || null;
    } else {
        // Данные от geo.ipify
        const { location } = data;
        lat = location.lat || null;
        lng = location.lng || null;
        city = location.city || '';
        region = location.region || '';
        postalCode = location.postalCode || '';
        // timezone – строка, например "Europe/Moscow"
        timezone = location.timezone || '';
        userIp = data.ip || '';
        userIsp = data.isp || '';
    }
}

// Отрисовка данных в информационной панели
function renderData() {
    const locationStr = `${city || ''}${region ? ', ' + region : ''}${postalCode ? ' ' + postalCode : ''}`.trim() || 'Unknown';
    locationElem.innerText = locationStr;
    timezoneElem.innerText = timezone || 'Unknown';
    ipElem.innerText = userIp || 'Unknown';
    ispElem.innerText = userIsp || 'Unknown';
}

// Строгая валидация IP-адреса (каждый октет от 0 до 255)
function validateIP(ip) {
    const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return pattern.test(ip);
}

// Обработка отправки формы
formInput.addEventListener('submit', (event) => {
    event.preventDefault();
    const ipAddress = input.value.trim();
    if (validateIP(ipAddress)) {
        getDataFromIp(ipAddress);
    } else {
        Fnon.Alert.Danger({
            title: 'ОШИБКА',
            message: 'IP-адрес не существует. Введите корректный IP (например, 8.8.8.8)',
        });
    }
    input.value = '';
});

// Запуск при загрузке страницы (дожидаемся загрузки Яндекс.Карт)
ymaps.ready(() => {
    getDataUser();
});