// ref https://www.jianshu.com/p/b263f6193144
importClass(android.content.Intent);
importClass(android.content.IntentFilter);
importClass(android.os.BatteryManager);
var tts = require('tts.js');

let LowThreshold = 30;
let HighThreshold = 80;

let BatteryN; // 电池电量
let Charging = false; // 正在充电中

let mBatteryInformationReciver = new JavaAdapter(android.content.BroadcastReceiver, {
    onReceive: function(content, intent) {
        let action = intent.getAction();
        if (intent.ACTION_BATTERY_CHANGED.equals(action)) {
            BatteryN = intent.getIntExtra("level", 0);
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
            if (BatteryN <= LowThreshold && !Charging) {
                tts.speakText(ttsIns, "小米手机电量低，请及时连接充电器！");
                // 有节奏震动手机
                device.vibrate([240, 400, 400, 400, 400, 400, 600, 600, 300, 300, 100, 100, 100]);
                toastLog("小米手机电量低");
            }

            if (BatteryN >= HighThreshold && Charging) {
                tts.speakText(ttsIns, "小米手机充电已完成，请断开充电器！");
                // 有节奏震动手机
                device.vibrate([240, 400, 400, 400, 400, 400, 600, 600, 300, 300, 100, 100, 100]);
                toastLog("小米手机充电已完成");
            }

            // NOTE：可以在此处添加更多监控逻辑哦
        }
    }
});


let watcher = new IntentFilter();
watcher.addAction(Intent.ACTION_BATTERY_CHANGED);

function initTTSCallback(context) {
    toastLog("开始注册IntentFilter");
    context.registerReceiver(mBatteryInformationReciver, watcher);
}

let ttsIns = tts.initTTS(
    context,
    initTTSCallback
);

events.on("exit", function() {
    context.unregisterReceiver(mBatteryInformationReciver);
});
