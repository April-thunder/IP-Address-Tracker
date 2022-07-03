const formInput = document.getElementById('form');
const input = document.getElementById('input');
const locationElem = document.getElementById('location');
const timezoneElem = document.getElementById('timezone');
const ipElem = document.getElementById('ip');
const ispElem = document.getElementById('isp');

let lat, lng, city, region, postalCode, timezone, userIp, userIsp;

// Определяем текущую геопозицию c помощью Яндекс API
// Определяеv местоположение пользователя и добавляется в балун
ymaps.ready(initGeo);
function initGeo() {
  let location = ymaps.geolocation;
  let myMap = new ymaps.Map('map', {
      center: [70, 34],
      zoom: 20,
    });

  location.get({
    provider: 'yandex', mapStateAutoApply: true
  })
    .then(
      function (result) {
        result.geoObjects.options.set('preset', {
          iconLayout: 'default#image',
          iconImageHref: './images/custom-baloon.svg',
          iconImageSize: [30, 30],
          iconImageOffset: [-10, -20]
      });
      // Пропишем полученный адрес в балуне.
      result.geoObjects.get(0).properties.set({
        balloonContentBody: 'Уважаемый User, вы где-то здесь'
      });
      myMap.geoObjects.add(result.geoObjects);
  });

// Удалим ненужные элементы Яндекс карты, отображаемые поумолчанию, а именно
  myMap.controls.remove('geolocationControl'); // геолокацию
  myMap.controls.remove('searchControl'); // поиск
  myMap.controls.remove('trafficControl'); // контроль трафика
  myMap.controls.remove('typeSelector'); // тип
  myMap.controls.remove('fullscreenControl'); // кнопку перехода в полноэкранный режим
  myMap.controls.remove('rulerControl'); //контроль правил
}

getDataUser()
.then(renderData);

// Определяем геопозицию по введеному IP
formInput.addEventListener('submit', (event) => {
  event.preventDefault();
  const isIpAddress = validateForm(input.value);
    if (isIpAddress) {
      getDataFromIp(input.value)
        .then(renderData)
        .then(() => ymaps.ready(init));
    } else {
      Fnon.Alert.Danger({
        title:'ОШИБКА',
        message:'IP-адрес не существует. Введите корректный IP',
      });
    }
    input.value = '';
});

// Проверяем заполнение формы
function validateForm(ipAddress) {
  const regExp = /(\d{1,3}\.){3}\d{1,3}/;
  return regExp.test(ipAddress);
}

// Получение данных пользователя
async function getDataUser() {
 try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    destrData(data, true);
  } catch (e) {
    alert('Возникла ошибка');
  }
}

// Получение данных по IP
async function getDataFromIp(ipAddress) {
  try {
 const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_CI9wUSGYQIKmIAQ9ZbLiUBoi1eGJu&ipAddress=${ipAddress}`);
    const data = await res.json();
    destrData(data, false);
  } 
  catch (e) {
    alert('Возникла ошибка');
  }
}

// Извлекаем данные, которые взяли ранее из geo.ipify
function destrData(data, isUserData) {
  if (isUserData) {
    ({city, region} = data);
    postalCode = data.postal;
    timezone = data.utc_offset.slice(0, 3) + ':00';
    userIp = data.ip;
    userIsp = data.org;
  } else {
    ({location: {lat, lng, city, region, postalCode, timezone, userIp, userIsp}} = data);
    userIp = data.ip;
    userIsp = data.isp;
  }
}

// Отрисовка данных в таблице
function renderData() {
  const newLocation = `${city}, ${region} ${postalCode}`;
  
  locationElem.innerText = newLocation;
  timezoneElem.innerText = timezone;
  ipElem.innerText = userIp;
  ispElem.innerText = userIsp;
}

// Отрисовка карты
function init() {
  let map = new ymaps.Map('map', {
    center: [lat, lng],
    zoom: 12,
  });

  map.geoObjects.add(new ymaps.Placemark([lat, lng], {
    balloonContent: 'Данный IP соотоветствует этому месту'
    }, 
    {
    iconLayout: 'default#image',
    iconImageHref: './images/custom-baloon.svg',
    iconImageSize: [30, 30],
    iconImageOffset: [-10, -20]
    }
  ));

  // Убираем карту, которая ранее отображена
  const prevMap = document.getElementById('map').firstElementChild;
  prevMap.remove();

  map.controls.remove('geolocationControl'); // геолокацию
  map.controls.remove('searchControl'); // поиск
  map.controls.remove('trafficControl'); // контроль трафика
  map.controls.remove('typeSelector'); // тип
  map.controls.remove('fullscreenControl'); // кнопку перехода в полноэкранный режим
  map.controls.remove('rulerControl'); // контрол правил
}



