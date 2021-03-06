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


    10. Universal notebook charger

        It's needed to make a charger for the robot.
        The only requirement is the ability to give 17-19 volts output. You have to rebuild the output contacts of the charger to fit to our in-wires (going from the wire terminals).

        [Example >>](https://aliexpress.ru/item/33002563321.html)



## Assembly

1. Making the case
    
    The carton is good for the case. I use the Ikea's carton box Pappis, and you're free to use any carton you'll find. The industrial inscriptions will make the robot look more DIY-ish.
    
    1. Cutting the carton for the projection
    
        ![case](assets/IMG_2200.jpg)

        The width of the box is 105 millimeters, the length is 205 mm. The height of the box is 80 mm. The result should look like the opened box with "ears" for the fixation. The "ears" should be on the side parts only.

    2. Bending the box

        ![bend](assets/IMG_5701.jpg)

        It's easy, just put down the ruler and bend along it. Try not to crush the carton where it doesn't have to be bent.

    3. Making holes

        We have to make the holes:
        - [2 holes in each "ear"](assets/IMG_3457.jpg) and 2 holes in the place where the "ear" is attached to
        - [8 holes to attach the carton case to the chassis, and for the switch](assets/IMG_0997.jpg)
        - [for the camera in the front side](assets/IMG_6941.jpg) - round in the center, and 4 small holes in the corners for the camera mounts
        - [for the battery indicator in the tail](assets/IMG_9045.jpg), and also 4 holes for the indicator mounts
        - in the right part of the case [a complicated hole for the servo drive](assets/IMG_6020.jpg), and two holes by the sides of it for the mounts (you should better take a look at how it's done on the image)
        - two small holes in the tail for the charging wires

        I'll use black mounting wires usually used to bind cables in the newly shipped devices to attach the peripherials to the case. It's simple and ugly enough.

    4. Fixing the case

        ![bound](assets/IMG_0938.jpg)

        It should look like this in the end. I used small black clamps to attach the case parts. And then I cut off the rest of the clamps.

    5. Attaching the case to the chassis

        ![bound_to_chassis](assets/IMG_1531.jpg)

        (Never mind the amount of peripherials is more than it's supposed to be according to this guide; we'll get there later)

        1. Put the case on the chassis
        2. Push the wires from the motors to the relevant holes
        3. Push the wires from the switch to the biggest hole
        
        Keep in mind that the camera has to be faced to the same as as the third (small) wheel. Otherwise the robot is not going to be controlled well.

    6. Connecting the servo and the battery indicator

        ![indicator](assets/IMG_5230.jpg)
        ![indicator2](assets/IMG_0383.jpg)

        Now let's attach the indicator with the black mounting wire. Tie the wires outside the box. The same with the servo. The servo drive should be really tightened because it will fall of during the wild ride.

    7. Installing the Raspberry Pi and the camera

        ![rpi](assets/IMG_1244.jpg)

        Put the RPI to the case as shown. If it's too loose, then put some carton pieces at between it and the case wall. It's really better to fix the Pi board.

        Then you should push the camera through the camera hole, and fix it with black mounting wires. Be sure not to put too much pressure to the small video chip on the camera board, since it is really easy do detach. You can put it back, but you'll have to disassemble the part of the robot.

        ![camera](assets/IMG_8361.jpg)

    8. Installing the battery block

        ![ab](assets/IMG_5852.jpg)

        I made a separator from the piece of carton to make it more comfortable to keep all the parts inside. It should look like a slightly beveled trapeze.

        First come the batteries, then the BMS board, then all the wires leading to the indicator (probably you'll have to take it off to put on all the battery wires) and the power contacts (P+ and P-). The power contacts should be put inside the wire terminals (according to the polarity).
        
        P- contact should go to the switch, and the free end in the future would be put inside the wire terminal. P+ contact goes straight to the terminal.

    9. Installing the wire terminals and converters

        ![stepdowns](assets/IMG_2632.jpg)

        It's a good idea to cover the battery block with a carton lid.
        Put two wire terminals in the space between the battery block and RPI. The positive contact from the battery block should be put to the clamp of the positive wire terminal. The negative contact (which should be by now joined wit the swith, and switch is OFF) should be put to the negative wire terminal. Lay everything carefully. Do not connect the converters' contacts to any of the devices right now.

    10. Connecting the motor driver

        1. Connect the motor driver to the 10 volts converter contacts
            
            That's important: the jumper has to be INSTALLED (look at the aliexpress photos to see the jumber). The jumper means to the driver board that it has to consume the power from a high-voltage source (not from a 5V source like Raspberry Pi). If you take off the jumper, the motor driver board is going to be broken.

            Thee blue contacts: external power | ground | 5-volts contact
            
            We connect + from the 10-volts converter to the left blue contact, and - from 10-volts converter to the middle blue contact (ground).

        2. Connect the motors to the motor driver board
            
            Connect like this:
            ```
            white       orange
            orange      white
            ```

            (If the board is turned the blue contacts to the bottom)

            (The way shown in the photo is partially wrong: at that moment I didn't know that the correct order is 1-4-3-2, but not 1-3-2-4. So I connected like orange-white-orange-white)

            ![motor_driver](assets/IMG_7303.jpg)

    11. Connect the GPIO contacts of RPI

        There is going to be three steps: the contacts of RPI itself, the driver board contacts and the servo contacts.
        
        But first take a look at the GPIO contacts scheme of Raspberry Pi:

        ![rpi_gpio](assets/Raspberry-Pi-GPIO-Header-with-Photo.png)

        There are two ways to name the GPIO contacts: by its sequence number and by the mysterious numbers that RPI engineers gave. We will be using the second way because it's more popular in software.

        So, for example, we have a PWM contact for the servo. It's going to be GPIO12, aka pin number 32.

        1. Raspberry Pi power contacts

            You should put the positive contact from the 5-volts converter to any of 5-volts pins of RPI. I will use the pin number 4.
            The negative contact should be put to any of the Ground pins, so I'll use the pin number 6.

            ![rpi_power](assets/IMG_1913.jpg)

        2. The motor driver contacts

            The driver has 6 contacts. The first three are for the left wheel, the last three are for the right one.

            Put first three contacts consequently to the pins: GPIO17, GPIO27, GPIO22.

            Put the last three to: GPIO16, GPIO20, GPIO21.

            It should be like this:

            ![motor_driver_gpio](assets/IMG_7470.jpg)

        3. Servo contacts

            It has three contacts: +, - and PWM.

            Put the positive contact to the pin number 2 (5-volts), the negative one to the pin number 9 (Ground), and the PWM pin to GPIO12.

            ![servo_pins](assets/IMG_5007.jpg)

    12. The test launch

        Pray and press the switch button. All the small LEDs should go on. And the main thing is two LEDs (red and green) on RPI, which also should go on.

    13. Making the charger

        1. Take the most wide changeable tip, break it to get to the power contacts and solder our wires (with out-ends). To choose the correct wire colors test the polarity with the voltmeter. The positive contact is usually in the center of a round cable, and the negative is outside. When soldered, cover all the connections with the tape to make it more resistent to shaking.

            ![charger](assets/IMG_6097.jpg)
            ![charger2](assets/IMG_9410.jpg)

        2. Take the third (of 3) step-down converter of DC and solder two in-wires to the input contacts of the converter and two out-wires to the output contacts. Connect the charger out wires with the converter in wires (**double check the polarity**). And then plug it into the  socket. The converter's output contacts now should have something like 20 volts. Turn the small screw counter-clockwise until the voltage becomes 16,8 volts.

    14. Somebody please get this robot an arm

        The best choice is the wooden stich and the tape.

        ![robot_arms_apts](assets/IMG_0210.jpg)

    15. The lid clamp

        It's two holes and the stick. One side of the stick has the stop (from the black mounting wire).

        ![lid_fixator](assets/IMG_1284.jpg)

**Done.**