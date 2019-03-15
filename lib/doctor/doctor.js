"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const android_workflow_1 = require("./android/android-workflow");
const ios_workflow_1 = require("./ios/ios-workflow");
const platform_1 = require("@weex-cli/utils/lib/platform/platform");
const colors = require("colors");
var ValidationType;
(function (ValidationType) {
    ValidationType[ValidationType["missing"] = 0] = "missing";
    ValidationType[ValidationType["partial"] = 1] = "partial";
    ValidationType[ValidationType["installed"] = 2] = "installed";
})(ValidationType = exports.ValidationType || (exports.ValidationType = {}));
class ValidatorTask {
    constructor(validator, result) {
        this.validator = validator;
        this.result = result;
        this.validator = validator;
        this.result = result;
    }
}
class ValidationResult {
    constructor(type, messages, statusInfo) {
        this.type = type;
        this.messages = messages;
        this.statusInfo = statusInfo;
        this.type = type;
        this.messages = messages;
    }
    get leadingBox() {
        switch (this.type) {
            case 0:
                return '[✗]';
            case 2:
                return '[✓]';
            case 1:
                return '[!]';
        }
        return null;
    }
}
exports.ValidationResult = ValidationResult;
class Doctor {
    constructor() {
        this.validators = [];
        this.iosWorkflow = new ios_workflow_1.IOSWorkflow();
        this.androidWorkflow = new android_workflow_1.AndroidWorkflow();
        this.getValidators();
    }
    getValidators() {
        if (this.androidWorkflow.appliesToHostPlatform) {
            this.validators.push(new android_workflow_1.AndroidValidator());
        }
        if (!platform_1.isWindows && this.iosWorkflow.appliesToHostPlatform) {
            this.validators.push(new ios_workflow_1.IOSValidator());
        }
    }
    startValidatorTasks() {
        const tasks = [];
        for (let validator of this.validators) {
            tasks.push(new ValidatorTask(validator, validator.validate()));
        }
        return tasks;
    }
    diagnose() {
        const taskList = this.startValidatorTasks();
        let messageResult = '';
        for (let validatorTask of taskList) {
            const validator = validatorTask.validator;
            const results = [];
            let result;
            let color;
            results.push(validatorTask.result);
            result = this.mergeValidationResults(results);
            color =
                result.type === 0
                    ? colors.red
                    : result.type === 2
                        ? colors.green
                        : colors.yellow;
            messageResult += `${color(`\n${result.leadingBox} ${validator.title}\n`)}`;
            for (let message of result.messages) {
                const text = message.message.replace('\n', '\n      ');
                if (message.isError) {
                    messageResult += `${colors.red(`    ✗  ${text}`)}\n`;
                }
                else if (message.isWaring) {
                    messageResult += `${colors.yellow(`    !  ${text}`)}\n`;
                }
                else {
                    messageResult += `    •  ${text}\n`;
                }
            }
        }
        return messageResult;
    }
    mergeValidationResults(results) {
        let mergedType = results[0].type;
        const mergedMessages = [];
        for (let result of results) {
            switch (result.type) {
                case 2:
                    if (mergedType === 0) {
                        mergedType = 1;
                    }
                    break;
                case 1:
                    mergedType = 1;
                    break;
                case 0:
                    if (mergedType === 2) {
                        mergedType = 1;
                    }
                    break;
                default:
                    break;
            }
            mergedMessages.push(...result.messages);
        }
        return new ValidationResult(mergedType, mergedMessages, results[0].statusInfo);
    }
}
exports.Doctor = Doctor;
class Workflow {
}
exports.Workflow = Workflow;
class DoctorValidator {
}
exports.DoctorValidator = DoctorValidator;
class ValidationMessage {
    constructor(message, isError = false, isWaring = false) {
        this.message = message;
        this.isError = isError;
        this.isWaring = isWaring;
        this.message = message;
        this.isError = isError;
        this.isWaring = isWaring;
    }
}
exports.ValidationMessage = ValidationMessage;
