import { AboutPage } from '../about/about';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { Storage } from '@ionic/storage';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
 
const MEDIA_FILES_KEY = 'mediaFiles';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mediaFiles = [];
  @ViewChild('myvideo') myVideo: any;
  
  constructor(public navCtrl: NavController,
     private mediaCapture: MediaCapture,
      private storage: Storage,
       private file: File,
        private media: Media) {

  }
  ionViewDidLoad() {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
    })
  }
  



about(){
this.navCtrl.push(AboutPage);
}

captureVideo() {
  let options: CaptureVideoOptions = {
    limit: 1,
    duration: 30
  }
  this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
    let capturedFile = res[0];
    let fileName = capturedFile.name;
    let dir = capturedFile['localURL'].split('/');
    dir.pop();
    let fromDirectory = dir.join('/');      
    var toDirectory = this.file.dataDirectory;
    
    this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
      this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
    },err => {
      console.log('err: ', err);
    });
        },
  (err: CaptureError) => console.error(err));
}

play(myFile) {
  console.log(myFile);
  if (myFile.name.indexOf('.wav') > -1) {
    console.log("audio");
    const audioFile: MediaObject = this.media.create(myFile.localURL);

    audioFile.play();
  } else {
    console.log("video");
    let path = this.file.dataDirectory + myFile.name;
    let url = path.replace(/^file:\/\//, '');
    let video = this.myVideo.nativeElement;

    console.log("this.file.dataDirectory**"+this.file.dataDirectory);
    console.log(" myFile.name**"+ myFile.name);
    console.log("path**"+path);
    console.log("url**"+url);
    video.src = url;
    video.play();
  }
}
// play2(myFile) {
//   alert(myFile);
 
//     alert("video");
//     let url = "/storage/emulated/0/DCIM/Camera/" + myFile.name;
//     alert("url**"+url);
//     let video = this.myVideo.nativeElement;
//     video.src = url;
//     video.play();
// }

storeMediaFiles(files) {
  this.storage.get(MEDIA_FILES_KEY).then(res => {
    if (res) {
      let arr = JSON.parse(res);
      arr = arr.concat(files);
      this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
    } else {
      this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
    }
    this.mediaFiles = this.mediaFiles.concat(files);
  })
}

}
