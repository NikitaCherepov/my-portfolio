# Моё портфолио
## Описание
Этот сайт - основной showcase моих навыков.
Много анимаций, интерактивности и небольших фич
### Некоторые фичи и описание их разработки
#### Плавное перетекание карточки при смене сортировки list/grid:
- В качестве карточки использовался только один компонент
- Часть содержимого всегда видна, чтобы дочерние компоненты также анимировались при переключении.
- Карточки должны вести себя по-разному: при grid должна быть анимация при наведении курсора на объект. При list такого быть не должно, но меняется внутренняя структура.
- Сама карточка работает благодаря условному рендерингу: при разных типах сортировки мы показываем разные детали, но при переключении подменяем один компонент на другой, оставляя тот же класс. Таким образом видимая часть анимируется так же плавно.
- Ограничение: не удалось использовать Image из next/image, так как в случае с ним анимация не происходила достаточно плавно. Пришлось оставить motion.img
#### Анимированный переход по страницам (routing)
- Сама анимация реализована с помощью framer-motion. В zustand хранится переменная для перехода, и адрес, на который нужно перейти.
- Клиентский компонент PageTransition оборачивает все дочерние страницы, и при смене переменных запускает useAnimate функции, направляя на нужный адрес (routing).
- И PageTransition, и все остальные дочерние страницы обёрнуты в серверные, для подключения метаданных.
#### Переиспользуемость компонентов
- Чтобы у меня всегда была возмонжость добавить новую подстраницу, пришлось заранее продумать и дизайн, и структуру сайта, включая архитектуру компонентов.
- Сначала я сделал страницу для портфолио сайтов. Реализовал анимации и сортировку - это заняло примерно пару недель.
- Затем я просто использовал весь текущий код для следующей подстраницы, и сама переделка заняла у меня не более пары дней.
- Перемещать карточку в компонент и настраивать детали через пропсы оказалось очень хлопотной задачей, учитывая сложность анимаций и возможные изменения для других страниц. Поэтому как полноценный компонент реализована только Button. Сам же код можно вставить, и он прекрасно будет работать, в зависимости от переменных, указаных в global.css
#### Плеер на странице с музыкой
- Для того, чтобы музыка не прекращалась, а с её переключением не было проблем:
- мы храним настройки пользователя в Zustand
- в отдельном компоненте PlayerWatcher постоянно обновляем текущее время, чтобы к актуальному значению отовсюду был доступ
- Сам же плеер использует dnd-kit, чтобы его можно было свободно перемещать по странице.
- С помощью кнопки сворачивания, которая появляется при наведении (также для компактности), можно свернуть/раскрыть его.
- При наведении на progress-bar появляется значок, показывающий текущее время
- При нажатии оно также сетается.
- Расположение плеера и режим раскрытия запоминается в localstorage, чтобы было удобнее.
#### Данные сортировки
- Они также анимированы, и сохраняются в localstorage
#### Также есть небольшая анимация карточек при скролле вверх-вниз

## Как запустить
- git clone https://github.com/NikitaCherepov/my-portfolio
- npm install
- npm run dev
## Или перейти на сайт: https://ncherepov.ru/
