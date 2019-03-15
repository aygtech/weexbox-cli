"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doctor_1 = require("../doctor");
const android_sdk_1 = require("./android-sdk");
const process_1 = require("../base/process");
const jdkDownload = 'https://www.oracle.com/technetwork/java/javase/downloads/';
class AndroidWorkflow {
    get appliesToHostPlatform() {
        return true;
    }
}
exports.AndroidWorkflow = AndroidWorkflow;
class AndroidValidator {
    constructor() {
        this.messages = [];
        this.androidSdk = new android_sdk_1.AndroidSdk();
        this.title = 'Android toolchain - develop for Android devices';
    }
    validate() {
        if (!this.androidSdk.directory) {
            if (process.env[`${android_sdk_1.kAndroidHome}`]) {
                const androidHomeDir = process.env[`${android_sdk_1.kAndroidHome}`];
                this.messages.push(new doctor_1.ValidationMessage(`${android_sdk_1.kAndroidHome} = ${androidHomeDir}
            but Android SDK not found at this location.`, true));
            }
            else {
                this.messages.push(new doctor_1.ValidationMessage(`Unable to locate Android SDK.
            Install Android Studio from: https://developer.android.com/studio/index.html
            On first launch it will assist you in installing the Android SDK components.
            If Android SDK has been installed to a custom location, set ${android_sdk_1.kAndroidHome} to that location.`, true));
            }
            return new doctor_1.ValidationResult(0, this.messages);
        }
        if (!this.androidSdk.isMustAndroidSdkVersion) {
            this.messages.push(new doctor_1.ValidationMessage(`There is no required version SDK plaform android-${android_sdk_1.mustAndroidSdkVersion}.`, false, true));
        }
        this.messages.push(new doctor_1.ValidationMessage(`Android SDK at ${this.androidSdk.directory}`));
        let sdkVersionText;
        if (this.androidSdk.latestVersion) {
            sdkVersionText = `Android SDK ${this.androidSdk.latestVersion.buildToolsVersionName}`;
            this.messages.push(new doctor_1.ValidationMessage(`Platform ${this.androidSdk.latestVersion.platformName}, build-tools ${this.androidSdk.latestVersion.buildToolsVersionName}`));
        }
        if (process.env[`${android_sdk_1.kAndroidHome}`]) {
            const androidHomeDir = process.env[`${android_sdk_1.kAndroidHome}`];
            this.messages.push(new doctor_1.ValidationMessage(`${android_sdk_1.kAndroidHome} = ${androidHomeDir}\n`));
        }
        const validationResult = this.androidSdk.validateSdkWellFormed();
        if (validationResult.length) {
            this.messages.push(new doctor_1.ValidationMessage(`Try re-installing or updating your Android SDK.`));
            return new doctor_1.ValidationResult(1, this.messages, sdkVersionText);
        }
        const javaBinary = this.androidSdk.findJavaBinary();
        if (!javaBinary) {
            this.messages.push(new doctor_1.ValidationMessage(`No Java Development Kit (JDK) found; You must have the environment
          variable JAVA_HOME set and the java binary in your PATH. 
          You can download the JDK from ${jdkDownload}.`, true));
        }
        if (!this.checkJavaVersion(javaBinary)) {
            return new doctor_1.ValidationResult(1, this.messages, sdkVersionText);
        }
        return new doctor_1.ValidationResult(2, this.messages, sdkVersionText);
    }
    checkJavaVersion(javaBinary) {
        if (!process_1.canRunSync(javaBinary, ['-version'])) {
            this.messages.push(new doctor_1.ValidationMessage(`Cannot execute ${javaBinary} to determine the version.`, true));
            return false;
        }
        let javaVersion;
        const result = process_1.runSync(javaBinary, ['-version']);
        if (result.status === 0) {
            const versionLines = result.stderr.toString().split('\n');
            javaVersion = versionLines.length >= 2 ? versionLines[1] : versionLines[0];
        }
        if (!javaVersion) {
            this.messages.push(new doctor_1.ValidationMessage(`Could not determine java version.`, true));
            return false;
        }
        this.messages.push(new doctor_1.ValidationMessage(`Java version ${javaVersion}.`));
        return true;
    }
    licensesAccepted() {
    }
}
exports.AndroidValidator = AndroidValidator;
//# sourceMappingURL=android-workflow.js.map