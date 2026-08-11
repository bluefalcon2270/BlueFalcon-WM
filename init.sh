#!/bin/bash

# Stop on errors
set -e

echo -e "\033[0;36m=================================================\033[0m"
echo -e "\033[0;36m   BlueFalcon WM - One-Click Initializer         \033[0m"
echo -e "\033[0;36m=================================================\033[0m"

echo -e "\033[1;33mStep 1: Installing Git...\033[0m"
apt-get update -y -q
apt-get install -y -q git

echo -e "\033[1;33mStep 2: Downloading the Repository...\033[0m"
# Remove old directory if it exists to ensure a clean clone
rm -rf BlueFalcon-WM
git clone https://github.com/bluefalcon2270/BlueFalcon-WM.git

echo -e "\033[1;33mStep 3: Launching Interactive Menu...\033[0m"
cd BlueFalcon-WM
bash install.sh
