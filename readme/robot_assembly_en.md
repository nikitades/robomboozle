# Robot assembly

## You will need

1. A carton box ([Pappis from Ikea](assets/pappis-box-with-lid__0710998_PE727873_S5.jpg) is ok)
2. The tools:
    - a sharp paper knife or a scalpel
    - a pencil
    - a soldering iron and some solder (get a nice soldering iron with a thin point)
    - a voltmeter ([I have this one](https://aliexpress.ru/item/4000437047846.html))
    - a plenty of small wires ([these](assets/wires.jpg) are ok; the wires should be of every type and color: mostly red and black, some should be of every color, and the wire types should be both in-out, in-in and out-out.

    Worth noting: all the connections inside are made by plugging in the out-wires to the in-contacts. Follow the color order of the wires and bind together the wires with the common function.

3. The components:
    
    **You have to solder the first connections on this stage to prepare the robot peripherials for the installation. Do as in the photos (or better)**
    **На этом этапе нужно спаять первые соединения, чтобы подготовить периферию робота к установке. Делайте чтобы было как на картинке (или лучше)**

    1. The chassis, motors and the switch

        ![chassis](assets/IMG_5443.jpg)
        
        I am using the prefab one. It has to be in the specialized shops.

        Take a look at the wires. Having assembled the chassis, you now have to solder two wires (+ and -) to the contacts of each motor, and then carefully put the wires through the chassis holes.

        I had a switch shipped as well (and I hope you will have also). The thing just to open the circuit. Now you should solder small wire parts (with the in and out ends) to embed it to the whole scheme more easily.

        [Example >>](https://aliexpress.ru/item/32953806131.html)

    2. The servo drive to move the robo-hand (right)

        ![servo](assets/IMG_0703.jpg)

        Just any should fit. The power does not matter, mine is the weakest.
        
        I recommend to connect the wires as shown - connect the in-out wires to the servo contancts, and then puth the out ends to the GPIO pins on the Raspberry.

        [Example >>](https://aliexpress.ru/i/32946393109.html)

    3. Raspberry Pi 2+ and the camera

        ![Raspberry](assets/IMG_5382.jpg)

        RPI: any model older than the first should be fine (it depends on the pigpio js plugin which is used to create the PWM).
        
        Camera: any as well. There is no point in HD picture, so any VGA-capable camera is enough. The only necessary thing is the CSI interface.

        [RPI example >>](https://aliexpress.ru/item/32623151958.html)
        [Camera example >>](https://aliexpress.ru/item/32913316415.html)

    4. The motor driver board

        ![L298N](assets/IMG_0574.jpg)

        We have to run the DC motors somehow. The one way is to run them with the special small chips for the DC control (that's too hard). The other way is to use some prebuilt options like the motor driver board. There are two wheels on our chassis, so L298N with two motors output is just ok.

        As you see, I've already plugged in all the wires. You can do as shown, that's gonna help later. You should use in-in wires.

        [Example >>](https://aliexpress.ru/item/32994608743.html)

    5. Step-down DC/DC converters

        ![Stepdown](assets/IMG_1445.jpg)

        We will need 3 of them:
        - to convert 19 volts from the universal power supply to 16,8 volts of charging current
        - to convert 11-16,8 volts of batteries current to 5 volts for RPI
        - to convert 11-16,8 volts of batteries current to 10 volts for the motor driver board

        Almost any step-down coverter can fit. It just has to have the input range within 10-20 volts and the output range within 5-20 volts. Mine had 5-35 input and 4-30 output volts.

        [Example >>](https://aliexpress.ru/item/1084552308.html)

     6. A harsh tramway wire terminal

        ![hardcore](assets/IMG_6201.jpg)

        It is gonna be used as shown. It has to have at least five slots. But in case if you have another way to solve the current split problem, feel free to do as you want. These terminals are the only thing that came to my mind in 10 minuts (I asked my cat).

        The terminals are gonna be the main spot from where the rest of the peripherials are gonna be powered. The BMS board gives the power to the terminals through the positive and negative wires, and then the terminals give the power to the converters. And also there are to wires (one for each terminal) for the charging.

        [Example >>](https://aliexpress.ru/item/32846980682.html)

     7. 4 rechargeable 18500 batteries and the case (or two small cases)

        ![Batteries](assets/IMG_0146.jpg)

        I use Liitokala 3700 mAh because they look slightly better than the others. Anyway, all the batteries manufacturers provide wrong data about the real batteries capacity. You can surely get 2300-2500 mAh when it's said to have 3700.

        The batteries are usually sold with 70% charge. It's enough for the first launches. If it's less than 30%, it's better to charge the batteries somehow.

        [Example >>](https://aliexpress.ru/item/32846348901.html)
     
     8. BMS board (balancing board / charge control board)

        ![BMS board](assets/IMG_2622.jpg)

        It's needed to charge and dischardge batteries equally. I'm trying to be eco-friendly, so no non-chargeable batteries are allowed :)

        As you can see on the image, I'm at least Leonardo da Vinci in soldering. Try to do it better.

        Shortly, how to solder the elements:
        1. You should connect the batteries consequently, like a "snake" (consider the photo)
        2. According to the BMS board manual (mine is CF-4S30A), you have to connect the start of every new battery with the relevant BMS board contact. (Mine has two ways of connection: with the special white wire block or manual way with the contacts B1, B2 etc.) Then you have to solder two wires to the P+ and P- contacts for the charge and discharge.
        3. Since I'm using the small wires block, free special contacts are gonna be used for the batteries charge level indicator. So we should solder one wire (with the "in" end) to each special contact (B1, B2 etc.). Finally, we should solder two additional wires to the B+ and B- contacts, because these are first and 5-th contacts among the indicator pins. (B1 is 2nd, B2 is 3rd, B3 is 4th)

        (Also I somehow left soldered two redundant wires to the contacts B+ and B-. So if you are using the small wire block, you should have only one wire on B+ and B-)

        [Example >>](https://aliexpress.ru/i/32823806861.html)

    9. Battery charge level indicator

        ![battery charge indicator](assets/IMG_5658.jpg)

        It's in the bottom of the image. It has 5 inputs, from left to right (it's upside down on the image, so it's from right to left for you):

        0 - main negative contact (B-)
        
        1 - the first battery (B1)
        
        2 - the second battery (B2)
        
        3 - the third battery (B3)
        
        4 - basically, it has to be the fourth battery, but it at the same time is the main positive contact, so it's B+

        If you try really hard, you'll sort things out in this wire hell on the image.

        - there are 5 wires from battery block going to the BMS board (it's 7 on the image, because 2 of them are redundant)
        - there are 2 outputs to the wire terminals and then to peripherials (P+ and P-) and 5 outputs for the battery indicator (B-, B1, B2, B3, B+)

        You should plug in 5 wires from the BMS board to the 8S indicator and check the voltage. Then plug them out and let it be there until the whole robot starts being assembled.

        [Example >>](https://aliexpress.ru/item/33012058398.html)


    10. Универсальное зарядное устройство для ноутбуков

        Понадобится, чтобы сделать из него зарядник для робота.
        Единственное требование - чтобы мог выдавать 17-19 вольт. Вам потребуется переделать выходные контакты зарядника, чтобы они подходили к нашим проводочкам.

        [Пример >>](https://aliexpress.ru/item/33002563321.html)



## Сборка

1. Делаем корпус
    
    Для корпуса хорошо подойдет картон. Я использую икеевский картонный ящик Pappis, вы можете что угодно. Индустриальные надписи на бортах придадут роботу невыразивый DIY-респект.
    
    1. Режем коробку на развертку
    
        ![case](assets/IMG_2200.jpg)

        Ширина основания - 10,5 см, длина основания - 20,5 см. Высота - 8 см.
        На вашей развертке должен получиться разложенный на стороны параллелепипед с "ушками" для закрепления. "Ушки" достаточно сделать на боковинах корпуса.

    2. Сгибаем коробку

        ![bend](assets/IMG_5701.jpg)

        Всё просто, кладешь линкейку и сгибаешь. Не помните картон там где он гнуться не должен.

    3. Делаем дырки

        Нужно сделать дырки:
        - [2 штуки в каждом "ушке"](assets/IMG_3457.jpg) и 2 штуки в том месте, на которое "ушко" накладывается
        - [под крепление картонного корпуса на шасси (8 дырок) и выключатель](assets/IMG_0997.jpg)
        - [под камеру спереди](assets/IMG_6941.jpg) - круглая в центре, 4 небольшие по углам под крепление камеры
        - [под индикатор батареи сзади](assets/IMG_9045.jpg), и 4 дырки под крепление индикатора
        - в правой части корпуса [сложную дырку под сервопривод руки](assets/IMG_6020.jpg), и 2 дырки по бокам под крепление (лучше рассмотрите, как выглядит привод)
        - 2 небольшие дырки под зарядные провода

        В будущем как крепление я использую проволочки, которыми проводочки сматывают в электронике. Божественно удобно и ублюдочно-некрасиво. То что надо.

    4. Скрепляем корпус

        ![bound](assets/IMG_0938.jpg)

        Должно получиться примерно вот так. Для соединения частей корпуса я использовал черные хомуты. Усики отрезаем.

    5. Закрепляем корпус на шасси

        ![bound_to_chassis](assets/IMG_1531.jpg)

        (Не обращайте внимания что на фото немного больше периферии вставлено, мы к этому еще придем)

        1. Поставьте коробку на шасси
        2. Просуньте проводочки от контактов моторов в подходящие дырки
        3. Просуньте проводочки от выключателя в центральную дырку

        Держите в уме, что камера должна смотреть в ту же сторону, куда и третье колесо (иначе робот будет кошмарно плохо рулиться).

    6. Вставляем сервопривод и индикатор

        ![indicator](assets/IMG_5230.jpg)
        ![indicator2](assets/IMG_0383.jpg)

        Индикатор приматываем проволокой. Завязываем снаружи корпуса. Аналогично с сервоприводом. Привод должен прилегать сильно, иначе отпадет во время колебаний.

    7. Устанавливаем Raspberry и камеру

        ![rpi](assets/IMG_1244.jpg)

        Вкладываем RPI в корпус как показано. Если болтается, можно уплотнить кусочками сургуча (или обрезков картона, которые точно остались). Лучше уплотнить, потому что люфт это от лукавого.

        Камеру нужно просунуть в дырку, и 4 крепежных отверстия попарно соединить волшебными проволочками. Следите за тем, чтобы давление на сам видеочип было несильным, а то он очень легко отваливается. Потом можно обратно поставить, но нужно отсоединять камеру, а это морока.

        ![camera](assets/IMG_8361.jpg)

    8. Устанавливаем батарейный блок

        ![ab](assets/IMG_5852.jpg)

        Для удобства я сделал перегородку из картона. Советую (должна быть слегка скошенная трапеция).

        Сначала батареи, потом BMS-плата, потом проводочки, ведущие в индикатор либо P+ и P-, ведущие к распределительным клеммникам (возможно, индикатор придется снять - места маловато).

        P- втыкайте сначала в выключатель, а свободный второй конец в будущем воткнем в распределительные клеммники.

    9. Устанавливаем клеммники и преобразователи

        ![stepdowns](assets/IMG_2632.jpg)

        Стоит закрыть батарейный отсек крышечкой, станет попросторнее.
        В пространство перед отсеком кладем два клеммника. Плюсовой провод от батарейного отсека втыкаем в зажим положительного клеммника. Минусовой провод (который у нас уже пропущен через выключатель, а выключатель в положении ВЫКЛ) втыкаем в минусовой разъем клеммника. Укладываем всё аккуратненько. Пока что не втыкаем контакты кажого преобразователя в соответствующие устройства.

        На картинке драйвер моторов просто лежит, еще не подключен.

    10. Подключаем драйвер моторов

        1. Подключаем драйвер моторов к контактам 10-вольтового клеммника
            
            Что важно: должна быть УСТАНОВЛЕНА перемычка (рассмотрите фото на алиэкспрессе, чтобы увидеть перемычку). Перемычка сигнализирует драйверу моторов, что нужно брать питание с внешнего, более высоковольтного контура, а не от 5-вольтового с повышением. Если перемычку снять, драйвер моторов сломается.

            Три синие контакта: внешнее питание | земля | 5-вольтовый контакт
            Мы подключаем + от 10-вольтового клеммника к левому контакту внешнего питания, - от 10-вольтового клеммника к контакту земля.

        2. Подключаем контакты моторов к драйверу моторов
            
            Подключайте вот так:
            ```
            белый       оранжевый
            оранжевый   белый
            ```
            Это если ориентация платы "контактами питания вниз".

            (На фото неправильно подключено, я тогда еще не знал что нумерация идет 1-4-3-2, а не 1-3-2-4)

            ![motor_driver](assets/IMG_7303.jpg)

    11. Подключаем GPIO-контакты на Raspberry Pi

        Будет три шага: контакты питания самой Raspberry Pi, контакты драйвера моторов и контакты сервопривода.

        Но сначала взгляните на схему GPIO-контактов Raspberry Pi:

        ![rpi_gpio](assets/Raspberry-Pi-GPIO-Header-with-Photo.png)

        Существует два способа именовать контакты RPI: по их порядковому номеру и по их номерам, выданным безупречно логичными разработчиками Raspberry. Мы будем использовать второй, потому что он более распространен в ПО.

        То есть, например, ШИМ-модуляцию для сервопривода будет создавать для нас GPIO12, он же пин номер 32.

        1. Контакты питания Raspberry Pi

            Нужно от пятивольтового клеммника положительный контакт воткнуть в любой пятивольтовый пин. Подойдет номер 4.
            Отрицательный контакт нужно воткнуть в Ground-пин, подойдет номер 6.

            ![rpi_power](assets/IMG_1913.jpg)

        2. Контакты драйвера моторов

            У драйвера 6 контактов. Первые 3 отвечают за левое колесо, вторые 3 за правое.

            Первые три контакта последовательно втыкаем в пины: GPIO17, GPIO27, GPIO22.

            Вторые три втыкаем в GPIO16, GPIO20, GPIO21.

            Должно быть как тут:

            ![motor_driver_gpio](assets/IMG_7470.jpg)

        3. Контакты сервопривода

            У привода 3 контакта: +, - и ШИМ (широтно-импульсная модуляция).

            Положительный втыкаем в пин номер 2 (5-вольтовый), отрицальный втыкаем в номер 9 (Groud), а ШИМ-пин втыкаем в GPIO12.

            ![servo_pins](assets/IMG_5007.jpg)

    12. Пробный запуск

        Молимся, крестимся, щуримся, нажимаем на кнопку включения. Должны аккуратно загореться лампочки, и, самое главное, должен заморгать красным и зеленым диод на RPI.

    13. Делаем зарядное устройство

        1. Возьмите самый широкий сменный наконечник зарядного устройства, разломайте его, чтобы добраться до контактов, и припаяйте к ним наши проводочки. Чтобы правильно выбрать цвет проводов - красный или черный, воспользуйтесь вольтметром. Чаще положительный контакт в центре, а отрицательный снаружи. Когда припаяете, смотайте все изолетной, чтобы исключить болтание в точке припоя.

            ![charger](assets/IMG_6097.jpg)
            ![charger2](assets/IMG_9410.jpg)

        2. Возьмите 3-й (из 3-х) понижающий преобразователь постоянного тока, припаяйте ко входам 2 in-проводочка, а к выходам 2 out-проводочка. Во входы вставляйте 2 контакта с зарядного устройства (проверьте полярность!!!), а потом включайте в сеть. На выходных контактах померяйте напряжение и крутите ручку, пока не станет 16,8. Выставьте 16,8, таким напряжением будем заряжать наш батарейный блок.

    14. Кто-нибудь, дайте этому роботу руку

        Хорошо подойдет деревянная палочка и изолента.

        ![robot_arms_apts](assets/IMG_0210.jpg)

    15. Фиксатор крышки

        Короче две дырочки и палочка, с одной стороны палочки проволочка-фиксатор.

        ![lid_fixator](assets/IMG_1284.jpg)

**Готово.**