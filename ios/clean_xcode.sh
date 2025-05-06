#!/bin/bash

echo "Stopping Xcode-related processes..."
killall Xcode
killall Simulator

echo "Removing Xcode app..."
sudo rm -rf /Applications/Xcode.app

echo "Removing Developer folder..."
sudo rm -rf ~/Library/Developer/*
sudo rm -rf /Library/Developer/*

echo "Removing DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData

echo "Removing simulator devices..."
rm -rf ~/Library/Developer/CoreSimulator

echo "Removing CocoaPods caches..."
rm -rf ~/Library/Caches/CocoaPods
rm -rf Pods
rm -rf Podfile.lock

echo "Removing Command Line Tools..."
sudo rm -rf /Library/Developer/CommandLineTools

echo "Done! Please reinstall Xcode from the App Store and then run:"
echo "  sudo xcode-select --switch /Applications/Xcode.app"
echo "  sudo xcodebuild -runFirstLaunch"

