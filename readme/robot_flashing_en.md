# Installing the software

## Build and deploy

1. Clone this repo somewhere at your computer:

    `git clone git@github.com:nikitades/robomboozle.git ~/robomboozle`

2. Move to the folder of the client:

    `cd ~/robomboozle/client`

3. Run the code deploy to RPI:

    `npm run deploy`

    If all is ok, in the end should be something like:
    ```
    added 59 packages from 103 contributors in 56.957s
    Connection to 192.168.1.170 closed.
    ```

4. Set up the correct connection parameters:

    1. Log in to RPI via SSH:

        `ssh pi`

    2. Go to the folder with the source code of the client:

        `cd ~/robomboozle_client`

    3. Open the file `runClient.sh` to edit:

        `nano runClient.sh`

    4. Change the parameters to yours:

    ```
    [ -z "$tcpHost" ] && tcpHost="SERVER ADDRESS (your PC if testing, otherwire some constantly working computer like Digital Ocean or AWS)"
    [ -z "$tcpPort" ] && tcpPort="9000 (TCP video streaming port)"
    [ -z "$wsHost" ] && wsHost="SERVER ADDRESS (your PC if testing, otherwire some constantly working computer like Digital Ocean or AWS)"
    [ -z "$wsPort" ] && wsPort="8000 (port for the commands exchange)"
    [ -z "$secret" ] && secret="abcdef (the server password for the robot. abcdef by default)"
    [ -z "$rotation" ] && rotation="180 (the video rotation degree - who knows which angle did you install the camera at)"
    ```

    The example of a well-filled file for the local test:

    ```
    [ -z "$tcpHost" ] && tcpHost="192.168.1.111"
    [ -z "$tcpPort" ] && tcpPort="9000"
    [ -z "$wsHost" ] && wsHost="192.168.1.111"
    [ -z "$wsPort" ] && wsPort="8000"
    [ -z "$secret" ] && secret="abcdef"
    [ -z "$rotation" ] && rotation="180"
    ```

    Just leave the line `#!/bin/sh` or `#!/bin/bash` (shebang) where it is.

    5. Run the system service

    Since the system service is up right after the deploy, there are not correct parameters of the connection in the RPI's memory. So we have to restart the service to make them correct:

    ```
    sudo systemctl restart robomboozle.service
    ```

    Now the only thing left is the host. Right after the host is up, if you have prodived the correct parameters, the video streaming will start immediately, and the rest of things will work also.
 
## Server launch

1. Launching the server from the Docker image (easier way)

    Of course, the dockcker has to be installed and working.
    linux: google://how to install docker linux
    osx: google://how to install docker osx

    1. `docker run -it -p 8000:8000 -p 9000:9000 -e piSecret=abcdef -e steerSecret=fedcba -e watchSecret=aaaaaa nikitades/robomboozle-server:latest`
    - -p 8000:8000 - the inner port of the web services is 8000, expose as you wish. Remember, this port is `wsPort` in runClient.sh
    - -p 9000:9000 - the inner port of the tcp service is 9000, expose as you wish. Remember, this port is `tcpPort` in runClient.sh
    - -e piSecret - the password for the robot to connect to the server's command bus. This parameter is `secret` in runClient.sh
    - -e steerSecret - the password for the user with the permission to control the robot. fedcba by default
    - -e watchSecret - the pasword for the user allowed to watch only. aaaaaa by default

    Having run the command, go to `http://localhost:8000` and log in to the web interface.

2. Launchin the server from the source code (hard way)

    First compile, then run.

    1. Go to the folder with the cloned repo, to the server subfolder:

        `cd ~/robomboozle/server`

    2. Run the server building

        `sh ./buildServer.sh`

    3. Run the server

        `sh ./runServer.sh`

    It's important: the setup file is organised like `runClient.sh`

    The setup example (parameters are under the same names, except "piSecret", which is "secret" in `runClient.sh`, the ports are hardcoded at 8000 and 9000):

    ```
    [ -z "$piSecret" ] && piSecret="abcdef"
    [ -z "$steerSecret" ] && steerSecret="fedcba"
    [ -z "$watchSecret" ] && watchSecret="aaaaaa"
    ```

    Having launched the server, go to `http://localhost:8000` and log in to the web interface.

## Remote server launch (the hosting)

It's nothing different from the regular sever launch. The only special thing is that you'll have to ensure the service is started at boot and restart at fail. The common ways to do this is to use either Systemd, or docker compose, or docker swarm.