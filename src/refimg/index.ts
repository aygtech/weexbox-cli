import {readdir,createReadStream,writeFile,pathExistsSync} from 'fs-extra'
import {createInterface} from 'readline'

export class Refimg {
   // 图片路径
   static imagesDir:string
   static flutterPubspecName:string
   static start(){

    this.setConfigPath()

    const pathIsOK = this.setConfigPath()
    if (pathIsOK ===  true) {
      readdir(this.imagesDir, (_, files) => {
        this.clean(this.flutterPubspecName, (ret) => {
          this.outPut(ret, files)
        })
      })
    }
    else{
        console.log('请检查当前目录是否存在images和pubspec.yaml')
    }
   }
   // 设置路径
   static setConfigPath() {
     this.imagesDir = './images'
     this.flutterPubspecName = 'pubspec.yaml'
     const hasDir = pathExistsSync(this.imagesDir)
     const hasPub = pathExistsSync(this.flutterPubspecName)
     return hasDir && hasPub
   }
   static clean(fileName, callBack){
    const rl = createInterface({
      input: createReadStream(fileName),
    })
     // 是否可添加
     let canAdd = true
     // 任务执行中。
     let tasking = false
     const lines = []
     rl.on('line', (line) => {
      if (this.lineIsAssets(line)) {
        canAdd = false
        tasking = true
        // 当前行需要加入。
        lines.push(line)
      }
      // 任务已经开始且当前行是#时，可以继续执行。
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
      callBack(lines)
    })

   }
   static lineIsAssets(line){
     return (line.indexOf('assets:') !== -1 && line.indexOf('#') === -1)
   }
    // 合并数组后输出到yaml
   static outPut(ary1, ary2){
    const newLines = []
    ary1.forEach((line) => {
      newLines.push(line)
      if (this.lineIsAssets(line)) {
        ary2.forEach((line2) => {
          const newLine2 = `        - images/${line2}`
          newLines.push(newLine2)
        })
      }
    })
    const newContent = newLines.join('\n')
    writeFile(this.flutterPubspecName, newContent, 'utf8', (error) => {
      if (error) {
        console.log('同步异常--------', error)
      } else {
        console.log('图片同步成功')
      }
    })
   }   
}