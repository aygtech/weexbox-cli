"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const platform_1 = require("@weex-cli/utils/lib/platform/platform");
const process_1 = require("../base/process");
const version_1 = require("@weex-cli/utils/lib/base/version");
const android_studio_1 = require("./android-studio");
exports.kAndroidHome = 'ANDROID_HOME';
const numberedAndroidPlatformRe = new RegExp('^android-([0-9P]+)$');
const javaHomeEnvironmentVariable = 'JAVA_HOME';
exports.mustAndroidSdkVersion = 26;
class AndroidSdkVersion {
    constructor(sdk, sdkLevel, platformName, buildToolsVersion) {
        this.sdk = sdk;
        this.sdkLevel = sdkLevel;
        this.platformName = platformName;
        this.buildToolsVersion = buildToolsVersion;
        this.sdk = sdk;
        this.sdkLevel = sdkLevel;
        this.platformName = platformName;
        this.buildToolsVersion = buildToolsVersion;
    }
    get buildToolsVersionName() {
        if (!this.buildToolsVersion) {
            return '';
        }
        return `${this.buildToolsVersion.major}.${this.buildToolsVersion.minor}.${this.buildToolsVersion.patch}`;
    }
    get androidJarPath() {
        return this.getPlatformsPath('android.jar');
    }
    get aaptPath() {
        return this.getBuildToolsPath('aapt');
    }
    getPlatformsPath(itemName) {
        return path.join(this.sdk.directory, 'platforms', this.platformName, itemName);
    }
    getBuildToolsPath(binaryName) {
        if (!this.buildToolsVersionName) {
            return '';
        }
        return path.join(this.sdk.directory, 'build-tools', this.buildToolsVersionName, binaryName);
    }
    validateSdkWellFormed() {
        if (this.exists(this.androidJarPath) !== null) {
            return [this.exists(this.androidJarPath)];
        }
        if (this.canRun(this.aaptPath, ['v']) !== null) {
            return [this.canRun(this.aaptPath, ['v'])];
        }
        return [];
    }
    exists(path) {
        if (!fs.existsSync(path)) {
            return `Android SDK file not found: ${path}.`;
        }
        return null;
    }
    canRun(path, args = []) {
        if (!process_1.canRunSync(path, args)) {
            return `Android SDK file not found: ${path}.`;
        }
        return null;
    }
}
exports.AndroidSdkVersion = AndroidSdkVersion;
class AndroidSdk {
    constructor() {
        this.sdkVersions = [];
        this.androidStudio = new android_studio_1.AndroidStudio();
        this.isMustAndroidSdkVersion = false;
        this.init();
    }
    get adbPath() {
        return this.getPlatformToolsPath('adb');
    }
    get sdkManagerPath() {
        return path.join(this.directory, 'tools', 'bin', 'sdkmanager');
    }
    findJavaBinary() {
        if (this.androidStudio.javaPath) {
            return path.join(this.androidStudio.javaPath, 'bin', 'java');
        }
        const javaHomeEnv = process.env[`${javaHomeEnvironmentVariable}`];
        if (javaHomeEnv) {
            return path.join(javaHomeEnv, 'bin', 'java');
        }
    }
    getPlatformToolsPath(binaryName) {
        return path.join(this.directory, 'platform-tools', binaryName);
    }
    validateSdkWellFormed() {
        if (!process_1.canRunSync(this.adbPath, ['version'])) {
            return [`Android SDK file not found: ${this.adbPath}.`];
        }
        if (!this.sdkVersions.length || !this.latestVersion) {
            return [`Android SDK is missing command line tools; download from https://goo.gl/XxQghQ`];
        }
        return this.latestVersion.validateSdkWellFormed();
    }
    locateAndroidSdk() {
        this.directory = this.findAndroidHomeDir();
    }
    findAndroidHomeDir() {
        let androidHomeDir;
        if (process.env[`${exports.kAndroidHome}`]) {
            androidHomeDir = process.env[`${exports.kAndroidHome}`];
        }
        else if (platform_1.homedir) {
            if (platform_1.isLinux) {
                androidHomeDir = path.join(platform_1.homedir, 'Android', 'Sdk');
            }
            else if (platform_1.isMacOS) {
                androidHomeDir = path.join(platform_1.homedir, 'Library', 'Android', 'sdk');
            }
            else if (platform_1.isWindows) {
                androidHomeDir = path.join(platform_1.homedir, 'AppData', 'Local', 'Android', 'sdk');
            }
        }
        if (androidHomeDir) {
            if (this.validSdkDirectory(androidHomeDir)) {
                return androidHomeDir;
            }
            if (this.validSdkDirectory(path.join(androidHomeDir, 'sdk'))) {
                return path.join(androidHomeDir, 'sdk');
            }
        }
        const aaptBins = process_1.which('aapt');
        for (let aaptBin in aaptBins) {
            const dir = path.resolve(aaptBin, '../../');
            if (this.validSdkDirectory(dir)) {
                return dir;
            }
        }
        const adbBins = process_1.which('adb');
        for (let adbBin in adbBins) {
            const dir = path.resolve(adbBin, '../../');
            if (this.validSdkDirectory(dir)) {
                return dir;
            }
        }
        return null;
    }
    validSdkDirectory(dir) {
        const dirPath = path.join(dir, 'platform-tools');
        if (fs.existsSync(dirPath)) {
            return fs.statSync(dirPath).isDirectory();
        }
        return false;
    }
    init() {
        this.locateAndroidSdk();
        if (!this.directory) {
            return;
        }
        let platforms = [];
        const platformsDir = path.join(this.directory, 'platforms');
        let buildTools = [];
        const buildToolsDir = path.join(this.directory, 'build-tools');
        if (fs.existsSync(platformsDir)) {
            platforms = fs.readdirSync(platformsDir);
        }
        if (fs.existsSync(buildToolsDir)) {
            buildTools = fs.readdirSync(buildToolsDir);
        }
        platforms.map(platformName => {
            let matchVersion = platformName.match(numberedAndroidPlatformRe)[1];
            if (matchVersion === 'P') {
                matchVersion = '28';
            }
            const platformVersion = Number(matchVersion);
            if (exports.mustAndroidSdkVersion === platformVersion) {
                this.isMustAndroidSdkVersion = true;
            }
            let buildToolsVersion;
            buildTools.forEach(version => {
                const versionOption = version_1.versionParse(version);
                if (versionOption && versionOption.major === platformVersion) {
                    buildToolsVersion = version_1.versionParse(version);
                }
            });
            if (!buildTools) {
                return null;
            }
            this.sdkVersions.push(new AndroidSdkVersion(this, platformVersion, platformName, buildToolsVersion));
        });
        if (this.sdkVersions.length) {
            this.latestVersion = this.sdkVersions[this.sdkVersions.length - 1];
        }
    }
}
exports.AndroidSdk = AndroidSdk;
//# sourceMappingURL=android-sdk.js.map