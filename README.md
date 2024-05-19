# [Autojs6](https://github.com/SuperMonster003/AutoJs6)脚本 电量充电报告器

- 会在电量低于30%时，语音提醒“小米手机电量低，请及时连接充电器！”并震动。
  - 每低5%的电量提醒一次。
- 会在电量高于80%时，语音提醒“小米手机充电已完成，请断开充电器！”并震动。
  - 每高5%的电量提醒一次。

## 测试情况

[Autojs6 v6.5.0 @ 2023/12/02](https://github.com/SuperMonster003/AutoJs6/releases/tag/v6.5.0) 在小米手机12S Ultra（HyperOS 1.0.5.0 with Android 14）上测试通过。

## 实现难点

Android的TTS初始化相较慢，导致speak时失败。通过在onInit方法中添加callback函数实现。