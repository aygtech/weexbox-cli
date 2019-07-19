import { readdir, createReadStream, writeFile, pathExistsSync } from 'fs-extra'
import { createInterface } from 'readline'
import {Generate} from './generate'
export class Refimg {
  // 图片路径
  static imagesDir: string
  // 配置文件名称
  static flutterPubspecName: string
  // model名称
  static modelName: string
  // dart文件路径
  static dartPath: string
  // 图片数组
  static imageNames: any[]
  static  start(path) {
    const pathIsOK = this.setConfigPath()
    if (pathIsOK === true) {
      this.dartPath = path
      this.synImageConfig()
    } else {
      console.log('\x1B[31m%s\x1B[0m', 'error:请检查当前目录是否存在images，pubspec.yaml\n')
    }
  }

  // 同步图片配置
  static synImageConfig()  {
    this.readdirImage(this.imagesDir).then(images => {
      this.imageNames = images
      return this.writeImageForConfig(images, this.flutterPubspecName)
    }).then(conetnt => {
      return this.updateConfig(this.flutterPubspecName, conetnt)
    }).then(_ => {
      this.createModel()
    })
  }
  // 更新配置文件。
  static updateConfig(config: string, content: string) {
    return new Promise<any>(reslove => {
      writeFile(config, content, 'utf8', (error) => {
        if (error) {
          console.log('\x1B[31m%s\x1B[0m', 'error: ' + error + '\n')
        } else {
          console.log('\x1B[36m%s\x1B[0m', 'succeed: images目录的图片已同步到pubspec.yaml\n')
          reslove()
        }
      })
    })
  }
  // 生成model
  static createModel() {
    if (this.dartPath !== undefined) {
      this.dartPath = this.dartPath === 'd' ? './lib/util/image_path_config.dart' : this.dartPath
      Generate.start(this.dartPath, this.imageNames)
    }
  }
  // 图片写入配置。
  static writeImageForConfig(files: any[], configPath: string) {
    return new Promise<string>(reslove => {
      const rl = createInterface({
        input: createReadStream(configPath),
      })
      // 是否可添加
      let canAdd = true
      // 任务执行中。
      let tasking = false
      const lines = []
      rl.on('line', (line) => {
        // 找到 assets 标识,开始插入新的图片。
        if (this.lineIsAssets(line)) {
          canAdd = false
          tasking = true
          // 当前行是assets需要加入。
          lines.push(line)
          // 加入新的图片
          files.forEach(file => {
            const newfile = `     - images/${file}`
            lines.push(newfile)
          })
        }
        // 任务已经开始且当前行是#时，过滤任务结束。
        if (tasking === true && line.indexOf('#') !== -1) {
          tasking = false
          canAdd = true
        }
        if (canAdd === true) {
          lines.push(line)
        }
      })
      // 任务结束
      rl.on('close', () => {
        reslove(lines.join('\n'))
      })
    })
  }
  // 获取文件夹下的图片。
  static readdirImage(dir: string) {
    return new Promise<any[]>(reslove => {
      readdir(dir, (_, files) => {
        reslove(this.getImageFiles(files))
      })
    })
  }
  // 确保文件夹内是图片。
  static getImageFiles(files) {
    const images = []
    files.forEach(file => {
      if (file.indexOf('.png') !== -1 || file.indexOf('.jpg') !== -1) {
        images.push(file)
      }
    })
    return images
  }
  // 设置路径
  static setConfigPath() {
    this.imagesDir = './images'
    this.flutterPubspecName = 'pubspec.yaml'
    const hasDir = pathExistsSync(this.imagesDir)
    const hasPub = pathExistsSync(this.flutterPubspecName)
    return hasDir && hasPub
  }
  // 当前行是 assets
  static lineIsAssets(line) {
    return(line.indexOf('assets:') !== -1 && line.indexOf('#') === -1)
  }
}
