// ref https://blog.csdn.net/qq_43974059/article/details/116889824
// ref https://developer.android.com/reference/android/speech/tts/TextToSpeech
importClass(android.speech.tts.TextToSpeech);
importClass(java.util.Locale);

function initTTS(context, callback) {
    let pitch = 1.0;
    let speechRate = 1.0;
    let obj = {
        onInit: function (status) {
            if (status == TextToSpeech.SUCCESS) {
                if (tts.setLanguage(Locale.SIMPLIFIED_CHINESE) != TextToSpeech.SUCCESS) {
                    toastLog("设置语言失败 error");
                    exit();
                }
                if (tts.setPitch(pitch) != TextToSpeech.SUCCESS) {
                    toastLog("设置pitch失败 error");
                    exit();
                }
                if (tts.setSpeechRate(speechRate) != TextToSpeech.SUCCESS) {
                    toastLog("设置语速失败 error");
                    exit();
                }
                toastLog("TTS初始化完成");
                // NOTE: 必须使用callback，因为TTS的初始化是异步的，且无法监控。
                callback(context);
            } else {
                toastLog("初始化TTS失败 error")
            }
        }
    };
    let tts = new TextToSpeech(context, TextToSpeech.OnInitListener(obj));
    return tts;
}

function speakText(tts, text) {
    let SpeakStatus = tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
    if (SpeakStatus != TextToSpeech.SUCCESS) {
        toastLog("朗读speak失败 error");
    } else {
        toastLog("朗读speak成功 success");
    }
}

// function main() {
//     let ttsIns = initTTS(
//         context,
//         () => {
//             speakText(ttsIns, "请说中文普通话");
//         }
//     );

// }

// main();

module.exports = { speakText, initTTS};