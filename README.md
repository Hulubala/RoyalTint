PROJECT: Royal Tint Digital Platform (Web Dashboard & Mobile App)

This document provides instructions on how to evaluate the Royal TintDigital Platform. The project consists of two main components:
1. A Web Dashboard for Managers (deployed online).
2. A Mobile Application for Customers and Staff (provided as an APK).


**1. HOW TO ACCESS AND TEST THE LIVE SYSTEM (NO INSTALLATION REQUIRED)**
A. Manager Web Dashboard
The web application is hosted online via Vercel. You can access it from any browser.
- Link: [https://royal-tint-admin.vercel.app]

B. Customer & Staff Mobile Application
The Android application has been compiled into an APK file.
- APK Download Link: [https://drive.google.com/drive/folders/1uTCj1wGVnFdR_v25eS8rrNM0kRUDluFW]
- How to install:
  1. Download the APK file to an Android device.
  2. Open the file and click "Install" (You may need to allow "Install from unknown sources" in your settings).


**2. HOW TO RUN THE SYSTEM LOCALLY FROM SOURCE CODE (OPTIONAL)**
If you wish to run the source code directly on your local machine, please follow these steps:

Prerequisites:
- Flutter SDK (Version 3.24 or higher recommended)
- Android Studio (for Mobile emulator) or Google Chrome (for Web)

Steps:
1. Extract the project source code folder.
2. Open a terminal or command prompt inside the project directory.
3. Run the following command to download all dependencies:
   flutter pub get

4. To run the Web Dashboard (Manager):
   flutter run -d chrome

5. To run the Mobile App (Customer/Staff):
   Connect an Android device or start an Android Emulator, then run:
   flutter run


If you encounter any issues accessing the system, please do not hesitate to contact me.

Thank you.
