#!/bin/sh
sudo cp robomboozle.service /etc/systemd/system
sudo systemctl enable robomboozle
sudo systemctl restart robomboozle