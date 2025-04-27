# 万事开头难 a.k.a 配环境

## 现在需要具备的工具

Node.js

npm（一般在安装Node.js时一起安装）

Expo（用来模拟移动端）

## 电脑上

1. Windows选手点击[这里](https://nodejs.org/dist/v16.14.2/node-v16.14.2-x86.msi)，macOS选手点击[这里](https://nodejs.org/dist/v16.14.2/node-v16.14.2.pkg)安装LTS（Long Term Support）最新版本的Node.js。

2. 安装完毕后，开启一个新的终端：

   ```bash
   node -v
   npm -v
   ```

   以检查安装成功与否以及版本。理想stdout：

   ```bash
   # node -v
   v16.14.2
   # npm -v
   8.5.0
   ```

3. 安装expo-cli：

   ```bash
   npm install --global expo-cli
   ```

4. 重启终端：

   ```bash
   expo --version
   ```

   检查expo-cli是否安装成功。

   

## 手机上

### Android 设备模拟器

点击[这里](https://apkpure.com/expo/host.exp.exponent/download?from=details)下载Expo Go的安卓端安装包，之后在手机上安装。

### Apple 设备模拟器

macOS中Xcode应该自带 Simulator 软件。



## 现在来试试打开app吧

`cd` **进入** `/app` ，然后：

```bash
expo start
```

应该看到：

```
% expo start
Starting project at /Users/springs/Documents/BUAA/Schoolwork/Software-Engineering/团队编程/main-project/app
Developer tools running on http://localhost:19002
Starting Metro Bundler
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▀▀▄▄ ▀█ █ ▄▄▄▄▄ █
█ █   █ ███▄█  ▀▄▄█ █   █ █
█ █▄▄▄█ ██▄▀▄▀███▀█ █▄▄▄█ █
█▄▄▄▄▄▄▄█ █ ▀▄▀▄▀ █▄▄▄▄▄▄▄█
█▄▄▀  ▀▄▀█ ▄▄▀▀█▀ ▀▄█▀█▀▀▄█
█▄ ███▀▄▄▄▀  ▀▄▄ ▄▄ ▀▀▄▀▀ █
█  █ █ ▄▀ ▄█▄▄▀▄ █ ▄ ▀█▀ ██
█ ▄████▄ ██▀ ▄▄█ █▀▄▄▀▄▀  █
█▄██▄▄▄▄█▀ █▀     ▄▄▄  ▄▀▄█
█ ▄▄▄▄▄ ██▀█▄  ▄█ █▄█ ██▀ █
█ █   █ █  ▄▀▀██▄▄▄  ▄ █▀▀█
█ █▄▄▄█ █▀█   █▄█▄█▀▀▄█   █
█▄▄▄▄▄▄▄█▄█▄▄██▄▄▄█▄▄▄███▄█

› Metro waiting on exp://10.135.77.101:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press d │ show developer tools
› shift+d │ toggle auto opening developer tools on startup (disabled)

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
```

这些提示已经写得很清楚了，具体command可以自己试着玩玩。我们现在主要测试一下**安卓**手机上安装的Expo Go能不能正常使用：

1. 在**自己的终端**（不是我这个）运行 `expo start` 后打开Expo Go扫描二维码，等待程序开始运行。

2. 运行成功后，应该在屏幕上有这样一行字：

   > 看到这行就行了



