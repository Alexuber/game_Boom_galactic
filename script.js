
// обращаемся к аудиодорожке в документе
audioPlayer = document.querySelector("audio");

/*
1. При нажатии на кнопку Старт, нужно прятать блок Старт и показывать блок Гейм. +
2. Включение мелодии при клике на блок #sound +
3. Если мелодия играет, то меняем картинку на ту, что показывает звук вкл\вкл +
4. работа с координатами, сделаем передвижение игрока вверх и вниз.
*/

/* createElement - создание эл-та
   appendChild  - добавить эл-т на страницу
   remove - удалить
*/


// обращаемся к кнопке Старт в документе
startBtn = document.querySelector("#start-btn");
// обращаемся к блоку Старт в документе
startBlock = document.querySelector("#start")
// обращаемся к блоку Гейм в документе
gameBlock = document.querySelector("#game");
// блок гейм в консоль выводим
console.dir(gameBlock);
// кол-во жизней
countLifes = 3;
// скин игрока
gamerSkin = "skin_1";

// кол-во очков
score = document.querySelector("#score span");

// задаем функцию: при нажатии на кнопку Старт () блок Старт - скрыть; блок Гейм - отобразить.
startBtn.onclick = function () {
    startGame();
}

// задаем переменную саунд с параметром офф
sound = "off"; // on

// обращаемся к кнопке саунд в документе
soundButton = document.querySelector("#sound img");

/* задаем функцию: при нажатии на кнопку саунд выполнить () если переменная саунд = ОН, 
то отобразить картинку mute_sound.png, музыку отключить, плеер поставить на паузу
*/
soundButton.onclick = function () {
    if (sound == "on") {
        soundButton.src = "images/mute_sound.png";
        sound = "off";
        audioPlayer.pause();
    } else {
/* иначе отобразить картинку sound_on.png, музыку включить, плеер проигрывать
*/
        soundButton.src = "images/sound_on.png";
        sound = "on";
        audioPlayer.play();
    }
}

// обращаемся к игроку в документе
gamer = document.querySelector("#player");

// задаем функцию передвижения игрока вверх-вниз
document.onkeydown = function (event) { // задаем событие при нажатии на клавиатуру
    if (event.keyCode == 87 && gamer.offsetTop > 60) { // если кейкод нашего события == 83, то есть наша кнопка "W", а также если наш Тор больше 48 
       gamer.style.top = gamer.offsetTop - 50 + "px";  // наш игрок перемещается вверх на 10 рх
    }
    
    if (event.keyCode == 83 && gamer.offsetTop < 700) {  // если кейкод нашего события == 87, то есть наша кнопка "S", а также если наш Тор меньше 666
       gamer.style.top = gamer.offsetTop + 50 + "px";  // наш игрок перемещается вниз на 10 рх
    }
    if (event.keyCode == 32) {  // если кейкод нашего события == 32, то есть наша кнопка "Space", то мы создаем пулю
        createBullet();
    }
}

/*выстрел если нажал пробел*/
setTimeout(function() {
    console.dir("1 sek");
}, 1000) 


// создаем функцию старт игры
function startGame() {
    startBlock.style.display = "none"; // убираем стартовый блок
    gameBlock.style.display = "block"; // добавляем игровой блок
    gamer.className = gamerSkin;
    createLifes();
    createEnemy();
}

/*
работа с врагами
*/

// функция создания врага1
function createEnemy() {
    let enemy = document.createElement("div"); // создаем ДИВ в документе
    enemy.className = "enemy " + typeEnemy(); // задаем класснейм
    enemy.style.top = random(100 + "px", document.querySelector("#app").clientHeight - 150) + "px"; // позицию
    gameBlock.appendChild(enemy); // указываем место отображения - игровой блок
    moveEnemy(enemy); // запускаем движение врага
    
}


 // функция движения врага1
function moveEnemy(enemy) {
        let timerID = setInterval(function () { // задаем функцию интервала движения ВЛЕВО с шагом 10 рх
        enemy.style.left = enemy.offsetLeft - 10 + "px";
// когда враг1 ушел за пределы поля -100 рх, то возвращаем его назад на ширину клиента + 200 рх.
        if (enemy.offsetLeft < -100) {
            enemy.remove(); // удаляем врага
            createEnemy(); // создаем врага1 заново
            clearInterval(timerID); // очищаем интервал
            die();
        }
    }, 100); // скорость передвижения
    
}


// функция тип врага
function typeEnemy() {
    if (random(1, 2) == 1) { // рандом 1 или 2
        return "type-1";
       } else {
        return "type-2";
        }     
}
// функция создания пули
function createBullet() {
    let bullet = document.createElement("div"); // создаем див "пуля" в документ
    bullet.className = "bullet"; // задаем ему класс
    bullet.style.top = gamer.offsetTop + 140 + "px"
    gameBlock.appendChild(bullet); // указываем , ято пуля создается в игровом блоке
    moveBullet(bullet); // звыполнить функцию движения пули
}

// функция движения пули
function moveBullet(bullet) {
    let timerID = setInterval(function () { // задаем функцию интервала движения с шагом 10 рх
        bullet.style.left = bullet.offsetLeft + 10 + "px";
// когда пуля ушла за пределы поля больше 1200 рх, то 
        if (bullet.offsetLeft > document.querySelector("body").clientWidth) {
            bullet.remove(); // удаляем пулю
            clearInterval(timerID); // очищаем интервал
        }
        isBoom(bullet);
    }, 10); // скорость передвижения
    
}



// функция взріва
function isBoom(bullet) {
let enemies = document.querySelectorAll(".enemy");
    for (let enemy of enemies)
    if (bullet.offsetTop > enemy.offsetTop
        && bullet.offsetTop < enemy.offsetTop + enemy.clientHeight
        && bullet.offsetLeft > enemy.offsetLeft) {
        createBoom(bullet.offsetTop, bullet.offsetLeft);
        score.innerText = Number(score.innerText) + 1;
        bullet.remove(); // пуля удаляется
        enemy.remove(); // враг удаляется
        createEnemy();
        
    }

}

// счетчик жизней


// функция конец игры
function die() {
    countLifes = countLifes - 1;
    if (countLifes <= 0) {  // если кол-во жизней <=0 то 
        endGame();
    } if (countLifes < 0) {
        createLifes();
    }
}


// функция подсчета жизней
function createLifes() {
    let lifesBlock = document.querySelector("#lifes"); // обращаемся к жизням в док-те
        lifesBlock.innerHTML = ""; // начальній текст - пусто
    let count = 0 // начальній счетчик
    while (count < countLifes) {  // если счет < счетчика жизней
        let span = document.createElement("span"); // создаем контейнер
        lifesBlock.appendChild(span); // в блоке лайфблок
        count = count + 1;
    }
}

// функция создания взрыва
function createBoom(top, left) { // переменные топ и лефт
    let boom = document.createElement("div"); // создаем ДИВ
    boom.className = "boom"; // задаем класнейм диву
    boom.style.top = top - 100 + "px"; // задаем топ
    boom.style.left = left -100 + "px"; // задаем лефт
    gameBlock.appendChild(boom); // размещаем в геймБлоке
    setTimeout(function () { // интервал удаления через 1000 мс
        boom.remove();
    }, 1000);
}

// функция рандома для топ и лефт появления врага
function random(min, max) {
    let rand = -0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

// функция конец игры
function endGame() {
    
    let scoreBlock = document.querySelector("#end h3 span"); // обращаемся к контейнеру в документе
    scoreBlock.innerText = score.innerText;
     
    
    gameBlock.innerHTML = ""; 
    
    let endBlock = document.querySelector("#end"); // обращаемся к блоку энд в докуменет
    endBlock.style.display = "block"; // отображаем блок энд

    let restartButton = document.querySelector("#end button"); // обращаемся к кнопке в документе
    restartButton.onclick = restart; // задаем рестарт при нажатии на кнопу рестарт
}

// функция рестарт
function restart() {
        location.reload();
    }

// выбираем скин1 игрока
selectSkin1 = document.querySelector("#skin_1"); // обращаемся к скину1 в документе

// устанвливаем функцию выбора скина на иконку скина
selectSkin1.onclick = function () {
    selectSkin1.className = "selected"; // задаем класнейм
    selectSkin2.className = ""; 
    gamerSkin = "skin_1"; // выбираем скин
}

// выбираем скин2 игрока
selectSkin2 = document.querySelector("#skin_2"); // обращаемся к скину2 в документе

selectSkin2.onclick = function () {
    selectSkin2.className = "selected"; // задаем класнейм
    selectSkin1.className = "";
    gamerSkin = "skin_2"; // выбираем скин

}
