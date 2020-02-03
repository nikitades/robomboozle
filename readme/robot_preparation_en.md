# Preparing for the installation and launch.

## You will need

1. A PC with linux/OSX onboard (Windows is also OK, but then you'll have to deploy the software manually, with Putty probably)
2. Installed Node.js environment, and also npm and ssh
3. The Wi-Fi covering the place where you are going to run the robot
4. Raspbian installed on RPI (this guide is for the Raspbian; there is nothing unsolvable for the other guides, but then line-by-line copying just will not work)
    
    
## RPI Setup

1. Connect RPI to Wi-Fi

    It's necessary for RPI to connect to Wi-Fi automatically (to the one you'll set it up). There is a plenty of guides, so here is the official one:
    https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md

    It's a good idea to make RPI's IP adress static. And also the IP of the PC from which you are going to control the robot.

2. Create the SSH key on RPI

    Now we have to create the SSH access via the key. Here is the guide:
    https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md


3. Create the SSH host on the admin's PC (Linux, OSX)

    Here is a good guide of how it's done:
    https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client

    What is required: you have to be able to connect the RPI via the simple command: `ssh pi`. It means that you have to create the SSH host with the name `pi`.

    You will need the IP address of RPI, the user name (Raspbian's default user name is pi) and the SSH key you have created the step before. I also assume you've already sent the public fingerprint of the key to RPI.
    
    The example a filled SSH host could be found in the `exampleSSHConfig.txt` in this repo.

