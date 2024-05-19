// ref https://www.jianshu.com/p/b263f6193144
importClass(android.content.Intent);
importClass(android.content.IntentFilter);
importClass(android.os.BatteryManager);
var tts = require('tts.js');

let LowThreshold = 30;
let HighThreshold = 80;
let NotifyStep = 5;
let BatteryN; // 电池电量
let Charging = false; // 正在充电中

let mBatteryInformationReciver = new JavaAdapter(android.content.BroadcastReceiver, {
    onReceive: function(content, intent) {
        let action = intent.getAction();
        if (intent.ACTION_BATTERY_CHANGED.equals(action)) {
            let BatteryN2 = intent.getIntExtra("level", 0);
            // 如果电量没变、在安全区域，跳过
            if (BatteryN == BatteryN2) return;
            if (BatteryN2 >= 32 && BatteryN2 <= 78) {
                log("电量正常，" + BatteryN2 + "%，不发声。")
                BatteryN = BatteryN2;
                return;
            }

            switch(intent.getIntExtra("status", BatteryManager.BATTERY_STATUS_UNKNOWN)) {
                case BatteryManager.BATTERY_STATUS_CHARGING:
                    Charging = true;
                    break;
                case BatteryManager.BATTERY_STATUS_NOT_CHARGING:
                    Charging = false;
                    break;
                case BatteryManager.BATTERY_STATUS_FULL:
                    break;
                case BatteryManager.BATTERY_STATUS_UNKNOWN:
                    break;
            }
            if (BatteryN2 <= LowThreshold && !Charging) {
                // speak every 5% down
                if (BatteryN - BatteryN2 < NotifyStep) {
                    log("电量低，" + BatteryN2 + "%，不发声。")
                    return;
                }
                BatteryN = BatteryN2;
                tts.speakText(ttsIns, "小米手机电量低，请及时连接充电器！");
                // 有节奏震动手机
                device.vibrate([240, 400, 400, 400, 400, 400, 600, 600, 300, 300, 100, 100, 100]);
                toastLog("小米手机电量低，发声");
                return;
            }

            if (BatteryN2 >= HighThreshold && Charging) {
                // speak every 5% up
                if (BatteryN2 > BatteryN < NotifyStep) {
                    log("电量高，" + BatteryN2 + "%，不发声。")
                    return;
                }
                tts.speakText(ttsIns, "小米手机充电已完成，请断开充电器！");
                // 有节奏震动手机
                device.vibrate([240, 400, 400, 400, 400, 400, 600, 600, 300, 300, 100, 100, 100]);
                toastLog("小米手机充电已完成，发声");
                return;
            }

            // NOTE：可以在此处添加更多监控逻辑哦
            BatteryN = BatteryN2;
            toastLog("当前电量：" + BatteryN2);
        }
    }
});

let watcher = new IntentFilter();
watcher.addAction(Intent.ACTION_BATTERY_CHANGED);

let ttsIns = tts.initTTS(
    context,
    (context) => {
        toastLog("开始注册IntentFilter");

        context.registerReceiver(mBatteryInformationReciver, watcher);
        events.on("exit", function() {
            context.unregisterReceiver(mBatteryInformationReciver);
        });
    }
);
