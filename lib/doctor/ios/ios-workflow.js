"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doctor_1 = require("../doctor");
const mac_1 = require("@weex-cli/utils/lib/ios/mac");
const cocoapods_1 = require("@weex-cli/utils/lib/ios/cocoapods");
const process_1 = require("@weex-cli/utils/lib/process/process");
const child_process_1 = require("child_process");
const version_1 = require("@weex-cli/utils/lib/base/version");
const plist = require("@weex-cli/utils/lib/ios/plist-utils");
class IOSWorkflow {
    get appliesToHostPlatform() {
        return process.platform === 'darwin';
    }
    getPlistValueFromFile(path, key) {
        return plist.getValueFromFile(path, key);
    }
}
exports.IOSWorkflow = IOSWorkflow;
class IOSValidator {
    constructor() {
        this.messages = [];
        this.xcodeStatus = 0;
        this.brewStatus = 0;
        this.cocoaPods = new cocoapods_1.CocoaPods();
        this.xcode = new mac_1.Xcode();
        this.title = 'iOS toolchain - develop for iOS devices';
    }
    get hasHomebrew() {
        return !!process_1.which('brew').length;
    }
    get hasIDeviceInstaller() {
        try {
            return child_process_1.spawnSync('ideviceinstaller', ['-h']).status === 0;
        }
        catch (e) {
            return false;
        }
    }
    get hasIosDeploy() {
        try {
            return child_process_1.spawnSync('ios-deploy', ['--version']).status === 0;
        }
        catch (e) {
            return false;
        }
    }
    get iosDeployVersionText() {
        try {
            return child_process_1.spawnSync('ios-deploy', ['--version'])
                .stdout.toString()
                .replace('\n', '');
        }
        catch (e) {
            return '';
        }
    }
    get iosDeployMinimumVersion() {
        return '1.9.2';
    }
    get iosDeployIsInstalledAndMeetsVersionCheck() {
        if (!this.hasIosDeploy) {
            return false;
        }
        const version = version_1.versionParse(this.iosDeployVersionText);
        return version_1.compareVersion(version, version_1.versionParse(this.iosDeployMinimumVersion));
    }
    validate() {
        if (this.xcode.isInstalled) {
            this.xcodeStatus = 2;
            this.messages.push(new doctor_1.ValidationMessage(`Xcode at ${this.xcode.xcodeSelectPath}`));
            this.xcodeVersionInfo = this.xcode.versionText;
            if (this.xcodeVersionInfo && this.xcodeVersionInfo.includes(',')) {
                this.xcodeVersionInfo = this.xcodeVersionInfo.substring(0, this.xcodeVersionInfo.indexOf(','));
                this.messages.push(new doctor_1.ValidationMessage(this.xcodeVersionInfo));
            }
            if (!this.xcode.isInstalledAndMeetsVersionCheck) {
                this.xcodeStatus = 1;
                this.messages.push(new doctor_1.ValidationMessage(`Weex requires a minimum Xcode version of ${mac_1.XcodeRequiredVersionMajor}.${mac_1.XcodeRequiredVersionMinor}.0.\n
          Download the latest version or update via the Mac App Store.`, true));
            }
            if (!this.xcode.eulaSigned) {
                this.xcodeStatus = 1;
                this.messages.push(new doctor_1.ValidationMessage("Xcode end user license agreement not signed; open Xcode or run the command 'sudo xcodebuild -license'.", true));
            }
            if (!this.xcode.isSimctlInstalled) {
                this.xcodeStatus = 1;
                this.messages.push(new doctor_1.ValidationMessage(`Xcode requires additional components to be installed in order to run.\n'
          Launch Xcode and install additional required components when prompted.`, true));
            }
        }
        else {
            this.xcodeStatus = 0;
            if (!this.xcode.xcodeSelectPath) {
                this.messages.push(new doctor_1.ValidationMessage(`Xcode not installed; this is necessary for iOS development.\n
          Download at https://developer.apple.com/xcode/download/.`, true));
            }
            else {
                this.messages.push(new doctor_1.ValidationMessage(`Xcode installation is incomplete; a full installation is necessary for iOS development.\n
          Download at: https://developer.apple.com/xcode/download/\n
          Or install Xcode via the App Store.\n
          Once installed, run:\n
            sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`, true));
            }
        }
        if (this.hasHomebrew) {
            this.brewStatus = 2;
            const cocoaPodsStatus = this.cocoaPods.evaluateCocoaPodsInstallation;
            if (cocoaPodsStatus === cocoapods_1.CocoaPodsStatus.recommended) {
                if (this.cocoaPods.isCocoaPodsInitialized) {
                    this.messages.push(new doctor_1.ValidationMessage(`CocoaPods version ${this.cocoaPods.cocoaPodsVersionText}`));
                }
                else {
                    this.brewStatus = 1;
                    this.messages.push(new doctor_1.ValidationMessage(`CocoaPods installed but not initialized.\n
            ${cocoapods_1.noCocoaPodsConsequence}\n
            To initialize CocoaPods, run:\n
              pod setup\n
            once to finalize CocoaPods\' installation.`, true));
                }
            }
            else {
                this.brewStatus = 1;
                if (cocoaPodsStatus === cocoapods_1.CocoaPodsStatus.notInstalled) {
                    this.messages.push(new doctor_1.ValidationMessage(`CocoaPods not installed.\n
    ${cocoapods_1.noCocoaPodsConsequence}\n
    To install:
    ${cocoapods_1.cocoaPodsInstallInstructions}`, true));
                }
                else {
                    this.messages.push(new doctor_1.ValidationMessage(`CocoaPods out of date (${this.cocoaPods.cocoaPodsRecommendedVersion} is recommended).\n
            ${cocoapods_1.noCocoaPodsConsequence}\n
            To upgrade:\n
            ${cocoapods_1.cocoaPodsUpgradeInstructions}`, true));
                }
            }
        }
        else {
            this.brewStatus = 0;
            this.messages.push(new doctor_1.ValidationMessage(`Brew not installed; use this to install tools for iOS device development.\n
        Download brew at https://brew.sh/.`, true));
        }
        return new doctor_1.ValidationResult([this.xcodeStatus, this.brewStatus].reduce(this.mergeValidationTypes), this.messages, this.xcodeVersionInfo);
    }
    mergeValidationTypes(t1, t2) {
        return t1 === t2 ? t1 : 1;
    }
}
exports.IOSValidator = IOSValidator;
//# sourceMappingURL=ios-workflow.js.map